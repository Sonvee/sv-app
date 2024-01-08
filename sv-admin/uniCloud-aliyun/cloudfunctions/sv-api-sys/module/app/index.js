const handler = require('sv-handle-res')
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