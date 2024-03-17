const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 角色列表
  async roleList() {
    const {
      role
    } = this.params

    let roleRes

    if (role && role.length > 0) {
      roleRes = await db.collection('uni-id-roles').where({
        "role_id": dbCmd.in(role)
      }).get()
    } else {
      roleRes = await db.collection('uni-id-roles').get()
    }

    return handler.result({
      data: roleRes.data,
    })
  },
  // 更新角色
  async roleUpdate() {
    const {
      _id,
      role_id,
      role_name
    } = this.params

    if (!role_id || !role_name) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id // 移除_id字段，_id不参与更新
    const roleRes = await db.collection('uni-id-roles').doc(_id).update(this.params)

    return handler.result({
      data: roleRes.data,
    })
  },
  // 添加角色
  async roleAdd() {
    const {
      role_id,
      role_name
    } = this.params

    if (!role_id || !role_name) {
      throw handler.result({
        code: 40001
      })
    }

    const roleRes = await db.collection('uni-id-roles').add(this.params)

    return handler.result({
      data: roleRes.data,
    })
  },
  // 删除角色
  async roleDelete() {
    const {
      role_id
    } = this.params

    if (!role_id) {
      throw handler.result({
        code: 40001
      })
    }

    const roleRes = await db.collection('uni-id-roles').where({
      "role_id": dbCmd.eq(role_id)
    }).remove()

    return handler.result({
      data: roleRes.data,
    })
  },

  // 指定用户添加角色 - 云对象之间调用
  async userRoleAdd({
    user_id,
    role_name,
  }) {
    // 先删除后添加，确保只会存在同一种角色
    // 一个云对象导出的不同方法之间不能互相调用
    await db.collection('uni-id-users').doc(user_id).update({
      'role': dbCmd.pull(role_name)
    })
    const roleRes = await db.collection('uni-id-users').doc(user_id).update({
      'role': dbCmd.push(role_name)
    })

    return handler.result({
      data: roleRes.data,
    })
  },
  // 指定用户删除角色 - 云对象之间调用
  async userRoleDelete({
    user_id,
    role_name,
  }) {
    const roleRes = await db.collection('uni-id-users').doc(user_id).update({
      'role': dbCmd.pull(role_name)
    })

    return handler.result({
      data: roleRes.data,
    })
  }
}