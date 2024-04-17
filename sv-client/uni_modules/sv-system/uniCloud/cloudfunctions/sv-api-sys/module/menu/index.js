const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 系统菜单
  async menuList() {
    let {
      role,
      permission,
      tree = true,
    } = this.params

    let menuRes

    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    // 连接表实例
    let query = dbJQL.collection('opendb-admin-menus')
    
    // 非超级管理员需要根据权限获取数据
    if (!role || role.indexOf('admin') == -1) {
      query = query.where({
        "$or": [{
          "permission": []
        }, {
          "permission": {
            $in: permission
          }
        }]
      })
    }

    menuRes = await query.orderBy('sort', 'asc').get({
      getTree: tree
    })

    return handler.result({
      data: menuRes.data,
    })
  },
  async menuAdd() {
    // 菜单添加
    const menuRes = await db.collection('opendb-admin-menus').add(this.params)
    return handler.result({
      data: menuRes,
      message: '添加成功'
    })
  },
  async menuDelete() {
    // 菜单删除
    const {
      menu_id
    } = this.params

    const menuRes = await db.collection('opendb-admin-menus').where({
      menu_id: dbCmd.eq(menu_id)
    }).remove()

    return handler.result({
      data: menuRes,
      message: menuRes.deleted ? '删除成功' : '删除失败'
    })
  },
  async menuUpdate() {
    // 菜单更新，需要根据_id字段更新，而不是menu_id
    const {
      _id
    } = this.params

    delete this.params._id // 移除_id字段，_id不加入更新

    const menuRes = await db.collection('opendb-admin-menus').doc(_id).update(this.params)

    return handler.result({
      data: menuRes,
      message: '更新成功'
    })
  },
}