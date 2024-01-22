const handler = require('sv-handle-res')
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

    // 总数统计
    const count = await db.collection('uni-id-log').count()

    // user_id根据uni-id-users用户表联表查询
    const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
      clientInfo: this.getClientInfo()
    })

    // 使用getTemp先过滤处理获取临时表再联表查询，推荐用法
    // 注意结尾的方法是getTemp，对表过滤得到临时表
    const tempIdDB = dbJQL.collection('uni-id-users').field('_id,nickname').getTemp()
    let logRes, pages
    if (pagesize < 0) {
      // 全量查询
      logRes = await dbJQL.collection('uni-id-log', tempIdDB).orderBy('create_date', 'desc').get()
      pages = 1
    } else {
      // 分页查询
      logRes = await dbJQL.collection('uni-id-log', tempIdDB).orderBy('create_date', 'desc')
        .skip(pagesize * (pagenum - 1)).limit(pagesize).get()
      // 页数统计
      pages = Math.ceil(count.total / pagesize)
    }

    return handler.result({
      data: logRes.data,
      total: count.total,
      pagesize,
      pagenum,
      pages,
      params: this.params
    })
  },
}