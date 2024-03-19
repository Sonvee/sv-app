const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // cdkey列表
  async cdkeyList() {
    let {
      pagesize = 20,
        pagenum = 1
    } = this.params

    // 转换为Number类型
    pagesize = +pagesize
    pagenum = +pagenum

    // user_id根据uni-id-users用户表联表查询
    const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
      clientInfo: this.getClientInfo()
    })

    // 使用getTemp先过滤处理获取临时表再联表查询，推荐用法
    // 注意结尾的方法是getTemp，对表过滤得到临时表
    const tempPlanDB = dbJQL.collection('sv-id-vip-plans').getTemp()
    let cdkeyRes
    if (pagesize > 1) {
      cdkeyRes = await dbJQL.collection('sv-id-vip-cdkeys', tempPlanDB).orderBy('create_date', 'desc')
        .skip(pagesize * (pagenum - 1)).limit(pagesize).get()
    } else {
      cdkeyRes = await dbJQL.collection('sv-id-vip-cdkeys', tempPlanDB).orderBy('create_date', 'desc').get()
    }

    // 总数统计
    const count = await db.collection('sv-id-vip-cdkeys').count()
    // 页数统计
    const pages = Math.ceil(count.total / pagesize)

    return handler.result({
      data: cdkeyRes.data,
      total: count.total,
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
      'cdkey': cdkey
    }).get()
    const isExist = findExist.affectedDocs
    if (isExist) {
      throw handler.result({
        code: 40003
      })
    }

    const cdkeyRes = await db.collection('sv-id-vip-cdkeys').add(this.params)

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

    const cdkeyRes = await db.collection('sv-id-vip-cdkeys').where({
      cdkey
    }).remove()

    return handler.result({
      data: cdkeyRes.data,
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
      cdkeyData,
      promisesAll
    })
  },
}