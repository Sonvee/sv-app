const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 测试列表
  async testList() {
    let {
      pagesize = 20,
        pagenum = 1,
        test_id,
        test_name,
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

    let testRes, pages, total

    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    // 连接表实例
    let query = dbJQL.collection('sv-sys-test')

    // 全量查询
    if (pagesize < 1) {
      testRes = await query.get({
        getCount: true
      })
      // 总数统计
      total = testRes.count
      // 页数统计
      pages = Math.ceil(total / pagesize)

      throw handler.result({
        data: testRes.data,
        total,
        pagesize,
        pagenum,
        pages,
        params: this.params
      })
    }

    // 构建筛选条件(对象形式)
    const conditions = {}
    if (test_id) {
      conditions.test_id = dbCmd.eq(test_id)
    }
    if (test_name) {
      conditions.test_name = dbCmd.eq(test_name)
    }
    // 将所有有效的筛选条件添加到查询对象中
    if (Object.keys(conditions).length > 0) {
      query = query.where(conditions)
    }

    testRes = await query.skip(pagesize * (pagenum - 1)).limit(pagesize).get({
      getCount: true
    })

    total = testRes.count
    pages = Math.ceil(total / pagesize)

    return handler.result({
      data: testRes.data,
      total,
      pagesize,
      pagenum,
      pages,
      params: this.params
    })
  },
  // 更新
  async testUpdate() {
    const {
      _id,
    } = this.params

    if (!_id) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id // 移除_id字段，_id不参与更新
    const testRes = await db.collection('sv-sys-test').doc(_id).update(this.params)

    return handler.result({
      data: testRes.data,
    })
  },
  // 添加
  async testAdd() {
    const {
      test_id,
      test_name
    } = this.params

    if (!test_id || !test_name) {
      throw handler.result({
        code: 40001
      })
    }

    const testRes = await db.collection('sv-sys-test').add(this.params)

    return handler.result({
      data: testRes.data,
    })
  },
  // 删除
  async testDelete() {
    const {
      test_id
    } = this.params

    if (!test_id) {
      throw handler.result({
        code: 40001
      })
    }

    const testRes = await db.collection('sv-sys-test').where({
      'test_id': Array.isArray(test_id) ? dbCmd.in(test_id) : dbCmd.eq(test_id)
    }).remove()

    return handler.result({
      data: testRes,
    })
  },
}