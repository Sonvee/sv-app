const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 查询指定id用户信息
  async userInfo() {
    const {
      _id
    } = this.params

    const userRes = await db.collection('uni-id-users').doc(_id).get()

    return handler.result({
      data: userRes.data[0]
    })
  },
  /**
   * 查询用户列表
   */
  async userList() {
    let {
      _id,
      name = '',
      role,
      platform = '',
      pagesize = 20,
      pagenum = 1
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
    
    let userRes, total, pages
    
    // 连接表实例
    let query = db.collection('uni-id-users')

    // 全量查询
    if (pagesize < 1) {
      userRes = await query.get()
      // 总数统计 已获取userRes.data，可避免再用count与服务器交互
      // const count = await query.count()
      // total = count.total
      total = userRes.data.length || 0
      // 页数统计
      pages = Math.ceil(total / pagesize)

      throw handler.result({
        data: userRes.data,
        total,
        pagesize,
        pagenum,
        pages,
        params: this.params
      })
    }

    // 构建筛选条件(对象形式) - 写法一
    /* const conditions = {}
    if (_id) {
      conditions._id = dbCmd.eq(_id)
    }

    if (name) {
      conditions.$or = [
        { username: { $regex: name, $options: 'i' } },
        { nickname: { $regex: name, $options: 'i' } },
      ]
    }

    if (platform) {
      conditions['register_env.uni_platform'] = dbCmd.eq(platform)
    }

    if (role && role.length > 0) {
      conditions.role = dbCmd.in([role])
    }

    // 将所有有效的筛选条件添加到查询对象中
    if (Object.keys(conditions).length > 0) {
      query = query.where(conditions)
    } */

    // 构建筛选条件(数组形式) - 写法二
    let conditions = []

    if (_id) {
      conditions.push({
        "_id": dbCmd.eq(_id)
      })
    }

    if (name) {
      // 模糊查询（不区分大小写）
      conditions.push({
        "$or": [{
            username: {
              $regex: name,
              $options: 'i'
            }
          },
          {
            nickname: {
              $regex: name,
              $options: 'i'
            }
          },
        ]
      });
    }

    if (platform) {
      conditions.push({
        "register_env.uni_platform": dbCmd.eq(platform)
      })
    }

    if (role) {
      conditions.push({
        "role": dbCmd.in([role])
      })
    }

    // 合并所有条件
    if (conditions.length > 0) {
      query = query.where(dbCmd.and(...conditions))
    }

    userRes = await query.orderBy('register_date', 'asc')
      .skip(pagesize * (pagenum - 1)).limit(pagesize).get()

    const countRes = await query.count()
    total = countRes.total
    pages = Math.ceil(total / pagesize)

    return handler.result({
      data: userRes.data,
      pagesize,
      pagenum,
      total,
      pages,
      params: this.params
    })
  },
  async userDelete() {
    const {
      _id
    } = this.params

    // 第三方账号不一定有username，需要用_id来查找

    if (!_id) {
      throw handler.result({
        code: 40001
      })
    }

    const userRes = await db.collection('uni-id-users').doc(_id).remove()

    return handler.result({
      data: userRes
    })

  },
  async userUpdate() {
    const {
      _id
    } = this.params

    // 第三方账号不一定有username，需要用_id来查找

    if (!_id) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id // 移除_id字段，_id不参与更新
    const userRes = await db.collection('uni-id-users').doc(_id).update(this.params)

    return handler.result({
      data: userRes
    })

  },
}