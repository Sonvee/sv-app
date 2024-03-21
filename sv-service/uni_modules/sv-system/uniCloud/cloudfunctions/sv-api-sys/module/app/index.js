const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 应用列表
  async appList() {
    const appRes = await db.collection('opendb-app-list').get()

    return handler.result({
      data: appRes.data,
    })
  },
  // 更新应用
  async appUpdate() {
    const {
      _id,
      appid,
      name
    } = this.params

    if (!appid || !name) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id // 移除_id字段，_id不参与更新
    const appRes = await db.collection('opendb-app-list').doc(_id).update(this.params)

    return handler.result({
      data: appRes.data,
    })
  },
  // 添加应用
  async appAdd() {
    const {
      appid,
      name
    } = this.params

    if (!appid || !name) {
      throw handler.result({
        code: 40001
      })
    }

    const appRes = await db.collection('opendb-app-list').add(this.params)

    return handler.result({
      data: appRes.data,
    })
  },
  // 批量添加应用
  async appAddList() {
    let {
      data,
      cover
    } = this.params
    
    if (!data || data.length <= 0) {
      throw handler.result({
        code: 40001
      })
    }
    
    const mainDB = 'opendb-app-list' // 主表
    const mainKey = 'appid' // 主键
    let filterData, mapData
    
    // 缺少必填参数appid、name的项不进行添加
    filterData = data.filter(item => item.appid && item.name)
    
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
      data: addRes.data,
    })
  },
  // 删除应用
  async appDelete() {
    const {
      appid
    } = this.params

    if (!appid) {
      throw handler.result({
        code: 40001
      })
    }

    const appRes = await db.collection('opendb-app-list').where({
      "appid": dbCmd.eq(appid)
    }).remove()

    return handler.result({
      data: appRes.data,
    })
  },
}