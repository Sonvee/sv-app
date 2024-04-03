const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 测试列表
  async testList() {
    let {
      test_id,
      test_name,
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

    let testRes, pages, total

    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    // 连接表实例
    let query = dbJQL.collection('sv-sys-test')

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

    if (pagesize < 1) {
      // 全量查询
      testRes = await query.get({
        getCount: true
      })
      total = testRes.count
      pages = 1
    } else {
      // 分页查询
      testRes = await query.skip(pagesize * (pagenum - 1)).limit(pagesize).get({
        getCount: true
      })
      total = testRes.count
      pages = Math.ceil(total / pagesize)
    }

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
  // 批量添加
  async testAddList() {
    let {
      data,
      cover
    } = this.params

    if (!data || data.length <= 0) {
      throw handler.result({
        code: 40001
      })
    }

    const mainDB = 'sv-sys-test' // 主表
    const mainKey = 'test_id' // 主键
    let filterData, mapData

    // 缺少必填参数test_id、test_name的项不进行添加
    filterData = data.filter(item => item.test_id && item.test_name)

    if (cover) {
      // 确认覆盖 先删后添加
      mapData = filterData.map(item => item[mainKey])
      let whereClause = {}
      whereClause[mainKey] = dbCmd.in(mapData)
      await db.collection(mainDB).where(whereClause).remove()
    } else {
      // 取消覆盖 先将filterData中已存在的移除
      const listRes = await db.collection(mainDB).get()
      mapData = listRes.data.map(item => item[mainKey])
      filterData = filterData.filter(item => mapData.indexOf(item[mainKey]) == -1)
    }

    if (filterData.length <= 0) {
      throw handler.result({
        code: 200,
        message: '没有数据更新'
      })
    }

    const addRes = await db.collection(mainDB).add(filterData)

    return handler.result({
      data: addRes,
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