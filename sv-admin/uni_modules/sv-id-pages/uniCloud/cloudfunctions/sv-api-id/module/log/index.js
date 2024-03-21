const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 权限列表
  async logList() {
    let {
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

    let logRes, pages, total

    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    const tempIdDB = dbJQL.collection('uni-id-users').field('_id,nickname').getTemp()

    // 连接表实例
    let query = dbJQL.collection('uni-id-log', tempIdDB)

    // 全量查询
    if (pagesize < 1) {
      logRes = await query.get({
        getCount: true
      })
      // 总数统计
      total = logRes.count
      // 页数统计
      pages = Math.ceil(total / pagesize)

      throw handler.result({
        data: logRes.data,
        total,
        pagesize,
        pagenum,
        pages,
        params: this.params
      })
    }

    // 条件查询

    logRes = await query.orderBy('create_date', 'desc')
      .skip(pagesize * (pagenum - 1)).limit(pagesize).get({
        getCount: true
      })

    total = logRes.count
    pages = Math.ceil(total / pagesize)

    return handler.result({
      data: logRes.data,
      total,
      pagesize,
      pagenum,
      pages,
      params: this.params
    })
  },
}