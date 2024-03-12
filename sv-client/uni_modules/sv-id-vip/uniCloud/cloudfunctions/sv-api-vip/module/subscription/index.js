const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 订阅列表
  async subscriptionList() {
    let {
      pagesize = 20,
        pagenum = 1
    } = this.params

    // 转换为Number类型
    pagesize = +pagesize
    pagenum = +pagenum

    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    // 判断cdkey是否存在
    const tempPlanDB = dbJQL.collection('sv-id-vip-plans').getTemp()

    let subscriptionRes
    if (pagesize > 1) {
      subscriptionRes = await dbJQL.collection('sv-id-vip-subscription', tempPlanDB)
        .orderBy('create_date', 'desc')
        .skip(pagesize * (pagenum - 1)).limit(pagesize).get()
    } else {
      subscriptionRes = await dbJQL.collection('sv-id-vip-subscription', tempPlanDB)
        .orderBy('create_date', 'desc').get()
    }

    // 总数统计
    const count = await db.collection('sv-id-vip-subscription').count()
    // 页数统计
    const pages = Math.ceil(count.total / pagesize)

    return handler.result({
      data: subscriptionRes.data,
      total: count.total,
      pagesize,
      pagenum,
      pages,
      params: this.params
    })
  },
  // 创建订阅
  async subscriptionAdd({
    user_id,
    plan_id,
    start_date,
    duration_time,
    status = 0,
    mode = 0
  }) {

    if (!user_id || !plan_id || !start_date || !duration_time) {
      throw handler.result({
        code: 40001
      })
    }

    const subscriptionRes = await db.collection('sv-id-vip-subscription').add({
      user_id,
      plan_id,
      start_date,
      duration_time,
      status,
      mode
    })

    // 创建订阅后立即激活订阅，并累加会员时长，最后将该订阅状态修改为已激活status:1
    // await db.collection('uni-id-users').doc(user_id).update({
    //   'vip_validity': dbCmd.inc(duration_time)
    // })
    // 1. 先判断用户是否已是vip
    
    // 2. 若不是vip，则 vip_validity = 当前时间戳 + 订阅套餐时长
    
    // 3. 若已是vip，则 vip_validity = vip_validity + 订阅套餐时长

    await db.collection('sv-id-vip-subscription').where({
      'user_id': user_id
    }).update({
      'status': 1
    })

    return handler.result({
      data: subscriptionRes.data,
    })
  },
}