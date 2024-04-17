const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 订阅列表
  async subscriptionList() {
    let {
      user_id,
      mode,
      start_date_range,
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

    let subscriptionRes, pages, total

    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    const tempPlanDB = dbJQL.collection('sv-id-vip-plans').getTemp()

    // 连接表实例
    let query = dbJQL.collection('sv-id-vip-subscription', tempPlanDB)

    // 构建筛选条件(JQL语法)
    let conditions = ''
    if (user_id) {
      conditions += `user_id == "${user_id}"`
    }
    if (mode || mode === 0) {
      if (conditions) {
        conditions += ' && '
      }
      conditions += `mode == ${+mode}`
    }
    if (start_date_range && start_date_range.length == 2) {
      if (conditions) {
        conditions += ' && '
      }
      conditions += `start_date >= ${start_date_range[0]} && start_date <= ${start_date_range[1]}`
    }
    // 使用JQL进行条件查询
    if (conditions) {
      query = query.where(conditions)
    }
    
    // 排序规则
    query = query.orderBy('start_date', 'desc')

    if (pagesize < 1) {
      // 全量查询
      subscriptionRes = await query.get({
        getCount: true
      })
      total = subscriptionRes.count
      pages = 1
    } else {
      // 分页查询
      subscriptionRes = await query.skip(pagesize * (pagenum - 1)).limit(pagesize).get({
        getCount: true
      })
      total = subscriptionRes.count
      pages = Math.ceil(total / pagesize)
    }

    return handler.result({
      data: subscriptionRes.data,
      total,
      pagesize,
      pagenum,
      pages,
      params: this.params
    })
  },
  // 创建订阅
  async subscriptionAdd({
    user_id,
    subscription_plan,
    start_date,
    duration_time,
    status = 0,
    mode = 0,
    pay_fee = 0
  }) {

    if (!user_id || !subscription_plan || !start_date || !duration_time) {
      throw handler.result({
        code: 40001
      })
    }

    const subscriptionRes = await db.collection('sv-id-vip-subscription').add({
      user_id,
      subscription_plan,
      start_date,
      duration_time,
      status,
      mode,
      pay_fee
    })

    // 创建订阅后累加会员时长 
    await uniCloud.importObject('sv-api-vip').vipValidUpdate({
      'user_id': user_id,
      'duration_time': duration_time,
    })

    // 然后将该订阅状态修改为已激活status:1
    await db.collection('sv-id-vip-subscription').where({
      'user_id': user_id
    }).update({
      'status': 1
    })

    return handler.result({
      data: subscriptionRes.data,
    })
  },

  /**
   * 订阅删除 - 仅供测试用 一般禁止删除订阅记录
   */
  async subscriptionDelete() {
    const {
      _id
    } = this.params

    if (!_id) {
      throw handler.result({
        code: 40001
      })
    }

    // 可单删可批量删
    const subscriptionRes = await db.collection('sv-id-vip-subscription').where({
      '_id': Array.isArray(_id) ? dbCmd.in(_id) : dbCmd.eq(_id)
    }).remove()

    return handler.result({
      data: subscriptionRes,
    })
  }
}