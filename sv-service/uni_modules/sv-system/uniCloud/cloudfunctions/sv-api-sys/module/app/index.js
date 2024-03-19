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

    // 缺少必填参数appid、name的项不进行添加
    data = data.filter(item => item.appid && item.name)

    if (cover) {
      // 确认覆盖 先删后添加
      const appidList = data.map(item => item.appid)
      await db.collection('opendb-app-list').where({ "appid": dbCmd.in(appidList) }).remove()
    } else {
      // 取消覆盖 先将data中已存在的移除
      const listRes = await db.collection('opendb-app-list').get()
      const appidList = listRes.data.map(item => item.appid)
      data = data.filter(item => appidList.indexOf(item.appid) == -1)
    }

    if (data.length <= 0) {
      return handler.result({
        code: 200,
        message: 'no valid value'
      })
    }

    const appRes = await db.collection('opendb-app-list').add(data)

    return handler.result({
      data: appRes.data,
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