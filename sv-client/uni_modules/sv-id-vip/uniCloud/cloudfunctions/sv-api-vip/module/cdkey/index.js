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
  // 更新cdkey
  async cdkeyUpdate() {
    const {
      _id,
      cdkey
    } = this.params

    if (!cdkey) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id // 移除_id字段，_id不参与更新
    const cdkeyRes = await db.collection('sv-id-vip-cdkeys').doc(_id).update(this.params)

    return handler.result({
      data: cdkeyRes.data,
    })
  },
  // 添加cdkey
  async cdkeyAdd() {
    const {
      cdkey,
      plan_id,
      valid_date
    } = this.params

    if (!cdkey || !plan_id || !valid_date) {
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
      "cdkey": cdkey
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
      'cdkey': cdkey
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
          'cdkey': cdkey
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
    const plan = findExistData.plan_id[0]

    if (!plan) {
      await db.collection('sv-id-vip-cdkeys').where({
        'cdkey': cdkey
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
      'plan_id': plan._id,
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
  }
}