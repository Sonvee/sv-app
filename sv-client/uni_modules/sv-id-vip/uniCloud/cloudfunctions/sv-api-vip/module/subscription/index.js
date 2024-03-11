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

    let subscriptionRes
    if (pagesize > 1) {
      subscriptionRes = await db.collection('sv-id-vip-subscription')
        .orderBy('create_date', 'desc')
        .skip(pagesize * (pagenum - 1)).limit(pagesize).get()
    } else {
      subscriptionRes = await db.collection('sv-id-vip-subscription')
        .orderBy('create_date', 'desc').get()
    }

    return handler.result({
      data: subscriptionRes.data,
    })
  },
  // 创建订阅
  async subscriptionCreate() {
    let {
      user_id
    } = this.params

    if (!user_id) {
      throw handler.result({
        code: 40001
      })
    }

    const findExist = await db.collection('sv-id-vip-subscription').where({
      'user_id': user_id
    }).get()
    const isExist = findExist.affectedDocs
    if (isExist) {
      throw handler.result({
        code: 40003
      })
    }

    const subscriptionRes = await db.collection('sv-id-vip-subscription').add({
      'user_id': user_id,
      'plans_id': [],
      'end_date': 0
    })

    return handler.result({
      data: subscriptionRes.data,
    })
  },
  // 更新订阅
  async subscriptionUpdatePlans() {
    const {
      user_id,
      plan_id
    } = this.params

    if (!user_id || !plan_id) {
      throw handler.result({
        code: 40001
      })
    }

    const findExist = await db.collection('sv-id-vip-subscription').where({
      'user_id': user_id
    }).get()
    const isExist = findExist.affectedDocs
    if (!isExist) {
      throw handler.result({
        code: 40002
      })
    }

    const planRes = await db.collection('sv-id-vip-plans').doc(plan_id).get()

    if (!planRes.affectedDocs) {
      throw handler.result({
        code: 40001,
        message: '未查询到plan_id匹配的套餐'
      })
    }

    const subscriptionRes = await db.collection('sv-id-vip-subscription').where({
      'user_id': user_id
    }).update({
      plans_id: dbCmd.push({
        'start_date': Date.now(),
        'plan': planRes.data[0]
      }),
      record: dbCmd.push({
        'start_date': Date.now(),
        'plan': planRes.data[0]
      })
    })

    return handler.result({
      data: subscriptionRes.data,
    })
  }
}