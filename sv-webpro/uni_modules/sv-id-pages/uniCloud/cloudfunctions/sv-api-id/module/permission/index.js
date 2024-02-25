const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 权限列表
  async permissionList() {
    const permissionRes = await db.collection('uni-id-permissions').get()

    return handler.result({
      data: permissionRes.data,
    })
  },
  // 更新权限
  async permissionUpdate() {
    const {
      _id,
      permission_id,
      permission_name
    } = this.params

    if (!permission_id || !permission_name) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id // 移除_id字段，_id不参与更新
    const permissionRes = await db.collection('uni-id-permissions').doc(_id).update(this.params)

    return handler.result({
      data: permissionRes,
    })
  },
  // 添加权限
  async permissionAdd() {
    const {
      permission_id,
      permission_name
    } = this.params

    if (!permission_id || !permission_name) {
      throw handler.result({
        code: 40001
      })
    }

    const permissionRes = await db.collection('uni-id-permissions').add(this.params)

    return handler.result({
      data: permissionRes,
    })
  },
  // 删除权限
  async permissionDelete() {
    const {
      permission_id
    } = this.params

    if (!permission_id) {
      throw handler.result({
        code: 40001
      })
    }

    const permissionRes = await db.collection('uni-id-permissions').where({
      "permission_id": dbCmd.eq(permission_id)
    }).remove()

    return handler.result({
      data: permissionRes,
    })
  },
}