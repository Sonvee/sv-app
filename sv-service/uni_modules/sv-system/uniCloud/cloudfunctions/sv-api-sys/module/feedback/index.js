const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 反馈列表
  async feedbackList() {
    let {
      user_id,
      feedback_id,
      feedback_title,
      feedback_type,
      feedback_status,
      pagesize = 20,
      pagenum = 1
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

    let feedbackRes, pages, total

    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    // 连接表实例
    let query = dbJQL.collection('sv-sys-feedback')

    // 构建筛选条件(对象形式)
    const conditions = {}
    if (user_id) {
      conditions.user_id = dbCmd.eq(user_id)
    }
    if (feedback_id) {
      conditions.feedback_id = dbCmd.eq(feedback_id)
    }
    if (feedback_title) {
      conditions.feedback_title = dbCmd.eq(feedback_title)
    }
    if (feedback_type) {
      conditions.feedback_type = dbCmd.eq(Number(feedback_type))
    }
    if (feedback_status || feedback_status === 0) {
      conditions.feedback_status = dbCmd.eq(Number(feedback_status))
    }

    // 将所有有效的筛选条件添加到查询对象中
    if (Object.keys(conditions).length > 0) {
      query = query.where(conditions).orderBy('create_date', 'desc')
    }

    if (pagesize < 1) {
      // 全量查询
      feedbackRes = await query.get({
        getCount: true
      })
      total = feedbackRes.count
      pages = 1
    } else {
      // 分页查询
      feedbackRes = await query.skip(pagesize * (pagenum - 1)).limit(pagesize).get({
        getCount: true
      })
      total = feedbackRes.count
      pages = Math.ceil(total / pagesize)
    }

    return handler.result({
      data: feedbackRes.data,
      total,
      pagesize,
      pagenum,
      pages,
      params: this.params
    })
  },

  // 反馈添加
  async feedbackAdd() {
    const {
      user_id,
      feedback_id,
      feedback_content
    } = this.params

    if (!user_id || !feedback_id || !feedback_content) {
      throw handler.result({
        code: 40001
      })
    }

    const feedbackRes = await db.collection('sv-sys-feedback').add(this.params)

    return handler.result({
      data: feedbackRes,
      message: '提交成功'
    })
  },

  // 反馈更新
  async feedbackUpdate() {
    const {
      feedback_id
    } = this.params

    if (!feedback_id) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id // 移除_id字段，_id不参与更新
    const feedbackRes = await db.collection('sv-sys-feedback').where({
      'feedback_id': dbCmd.eq(feedback_id)
    }).update(this.params)

    return handler.result({
      data: feedbackRes,
    })
  },

  // 反馈删除
  async feedbackDelete() {
    const {
      feedback_id
    } = this.params

    if (!feedback_id) {
      throw handler.result({
        code: 40001
      })
    }

    const feedbackRes = await db.collection('sv-sys-feedback').where({
      'feedback_id': Array.isArray(feedback_id) ? dbCmd.in(feedback_id) : dbCmd.eq(feedback_id)
    }).remove()

    return handler.result({
      data: feedbackRes,
    })
  },
}