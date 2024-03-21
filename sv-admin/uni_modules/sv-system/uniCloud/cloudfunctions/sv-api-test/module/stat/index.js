const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  /**
   * 统计长列表测试
   * pagesize: 每页显示数量，默认10，-1时返回所有数据
   * pagenum: 页码，默认1
   */
  statList() {
    let list = []
    for (let i = 1; i <= 100; i++) {
      list.push({
        text: `第${i}个`,
        value: i
      })
    }
    
    // 启用本地静态分页
    return handler.paging({
      data: list,
      params: this.params
    })
  },
  /**
   * 统计空数据测试
   * pagesize: 每页显示数量，默认10，-1时返回所有数据
   * pagenum: 页码，默认1
   */
  statEmpty() {
    return handler.paging({
      data: [],
      params: this.params,
    })
  }
}