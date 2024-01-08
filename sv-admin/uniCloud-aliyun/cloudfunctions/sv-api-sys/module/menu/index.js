const handler = require('sv-handle-res')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 系统菜单
  async menuList() {
    const {
      role,
      permission,
      tree = true
    } = this.params
    /**
     * 获取JQL database引用，此处需要传入云对象的clientInfo
     * @tutorial https://uniapp.dcloud.net.cn/uniCloud/jql-cloud.html
     */
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    })

    let menuRes

    if (role && role.indexOf('admin') > -1) {
      menuRes = await dbJQL.collection('opendb-admin-menus')
        .orderBy('sort', 'asc')
        .get({
          getTree: tree
        })
    } else {
      // 菜单列表，默认按sort升序排序，菜单不做分页处理
      // where条件会对所有查询的节点生效
      menuRes = await dbJQL.collection('opendb-admin-menus')
        .where({
          "$or": [{
              "permission": []
            },
            {
              "permission": {
                $in: permission
              }
            }
          ]
        })
        .orderBy('sort', 'asc')
        .get({
          getTree: tree
        })
    }

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