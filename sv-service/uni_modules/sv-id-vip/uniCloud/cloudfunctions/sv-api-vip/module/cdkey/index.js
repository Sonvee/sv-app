const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // cdkey列表
  async cdkeyList() {
    let {
      cdkey,
      bind_plan,
      pagesize = 20,
      pagenum = 1,
    } = this.params

    // 转换为Number类型
    pagesize = +pagesize
    pagenum = +pagenum

    // 页码不可小于1
    if (pagenum < 1) {
      throw handler.result({
        code: 40001,
        message: 'pagenum不可小于1'
      })
    }

    let cdkeyRes, pages, total

    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    const tempPlanDB = dbJQL.collection('sv-id-vip-plans').getTemp()

    // 连接表实例
    let query = dbJQL.collection('sv-id-vip-cdkeys', tempPlanDB)

    // 构建筛选条件(对象形式)
    const conditions = {}
    if (cdkey) {
      conditions.cdkey = dbCmd.eq(cdkey)
    }
    if (bind_plan) {
      conditions["bind_plan.0.plan_id"] = dbCmd.eq(bind_plan) // 联表查询需要查询联表对应项中字段
    }
    // 将所有有效的筛选条件添加到查询对象中
    if (Object.keys(conditions).length > 0) {
      query = query.where(conditions)
    }
    
    // 排序规则
    query = query.orderBy('create_date', 'desc')

    if (pagesize < 1) {
      // 全量查询
      cdkeyRes = await query.get({
        getCount: true
      })
      total = cdkeyRes.count
      pages = 1
    } else {
      // 分页查询
      cdkeyRes = await query.skip(pagesize * (pagenum - 1)).limit(pagesize).get({
        getCount: true
      })
      total = cdkeyRes.count
      pages = Math.ceil(total / pagesize)
    }

    return handler.result({
      data: cdkeyRes.data,
      total,
      pagesize,
      pagenum,
      pages,
      params: this.params
    })
  },
  // cdkey不做Update更新api

  // 添加cdkey
  async cdkeyAdd() {
    const {
      cdkey,
      bind_plan,
      valid_date
    } = this.params

    if (!cdkey || !bind_plan || !valid_date) {
      throw handler.result({
        code: 40001
      })
    }

    const findExist = await db.collection('sv-id-vip-cdkeys').where({
      cdkey
    }).get()
    const isExist = findExist.affectedDocs
    if (isExist) {
      throw handler.result({
        code: 40003
      })
    }

    const cdkeyRes = await db.collection('sv-id-vip-cdkeys').add({
      ...this.params,
      create_date: Date.now()
    })

    return handler.result({
      data: cdkeyRes.data,
    })
  },
  // 删除cdkey
  async cdkeyDelete() {
    const {
      cdkey
    } = this.params

    if (!cdkey) {
      throw handler.result({
        code: 40001
      })
    }

    // 可单删可批量删
    const cdkeyRes = await db.collection('sv-id-vip-cdkeys').where({
      'cdkey': Array.isArray(cdkey) ? dbCmd.in(cdkey) : dbCmd.eq(cdkey)
    }).remove()

    return handler.result({
      data: cdkeyRes,
    })
  },
  // cdkey激活
  async cdkeyActive() {
    const {
      cdkey,
      user_id
    } = this.params

    if (!cdkey || !user_id) {
      throw handler.result({
        code: 40001
      })
    }

    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    // 判断cdkey是否存在
    const tempPlanDB = dbJQL.collection('sv-id-vip-plans').getTemp()
    const findExist = await dbJQL.collection('sv-id-vip-cdkeys', tempPlanDB).where({
      cdkey
    }).get({
      getOne: true
    })

    const isExist = findExist.affectedDocs
    if (!isExist) {
      throw handler.result({
        code: 40002
      })
    }

    // 判断cdkey是否有效
    const findExistData = findExist.data

    if (findExistData.status) {
      throw handler.result({
        code: 40004,
        message: 'cdkey已使用或已失效'
      })
    } else {
      if (Date.now() > findExistData.valid_date) {
        // 修改状态为过期失效 status: 2
        await db.collection('sv-id-vip-cdkeys').where({
          cdkey
        }).update({
          status: 2
        })

        throw handler.result({
          code: 40004,
          message: 'cdkey已过期'
        })
      }
    }

    // 可能存在套餐id变更导致激活码失效的情况
    const plan = findExistData.bind_plan[0]

    if (!plan) {
      await db.collection('sv-id-vip-cdkeys').where({
        cdkey
      }).update({
        status: 2
      })

      throw handler.result({
        code: 400,
        message: 'cdkey已失效'
      })
    }

    // 激活cdkey步骤：
    // 1. 先修改cdkey状态为已使用 status: 1
    await db.collection('sv-id-vip-cdkeys').where({
      'cdkey': cdkey
    }).update({
      status: 1
    })

    // 2. 计算激活码对应套餐生效时长，并添加订阅
    const duration_time = plan.valid_day * 24 * 60 * 60 * 1000

    await uniCloud.importObject('sv-api-vip').subscriptionAdd({
      'user_id': user_id,
      'subscription_plan': plan.plan_id,
      'start_date': Date.now(),
      'duration_time': duration_time,
      'mode': 1
    })

    // 3. 向用户角色列表中添加vip
    await uniCloud.importObject('sv-api-id').userRoleAdd({
      'user_id': user_id,
      'role_name': 'vip',
    })

    return handler.result({
      data: findExistData,
      message: '激活成功',
    })
  },

  /**
   * 激活码自动定时验证
   */
  async cdkeyVerifyAuto() {
    // 筛选出所有待使用的激活码
    const cdkeyRes = await db.collection('sv-id-vip-cdkeys').where({
      status: dbCmd.nin([1, 2])
    }).get()

    const cdkeyData = cdkeyRes.data

    // 将需要执行的异步操作放入一个数组
    const promises = cdkeyData.map(async (item) => {
      if (!item.valid_date || Date.now() > item.valid_date || !item.bind_plan || item.bind_plan.length < 1) {
        return new Promise((resolve, reject) => {
          // 修改cdkey状态为已失效
          db.collection('sv-id-vip-cdkeys').where({
            'cdkey': item.cdkey
          }).update({
            status: 2
          }).then(() => {
            resolve()
          }).catch((error) => {
            reject(error);
          })
        });
      } else {
        // 如果当前激活码valid_date未过期，则直接返回一个Resolved状态的Promise
        return Promise.resolve();
      }
    });

    // 使用Promise.all并发执行所有异步操作
    const promisesAll = await Promise.all(promises);

    return handler.result({
      data: cdkeyData,
      handle: promisesAll
    })
  },

  async cdkeyInvalidRemove() {
    // 筛选出所有失效的激活码
    const cdkeyRes = await db.collection('sv-id-vip-cdkeys').where({
      status: dbCmd.in([1, 2])
    }).remove()

    return handler.result({
      data: cdkeyRes,
    })
  }
}