const handler = require('sv-handle-res')
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
      platform = '',
      pagesize = 20,
      pagenum = 1
    } = this.params
    
    // 转换为Number类型
    pagesize = +pagesize
    pagenum = +pagenum

    let userRes

    // 总数统计
    const count = await db.collection('uni-id-users').count()
    // 页数统计
    const pages = Math.ceil(count.total / pagesize)

    // _id单搜，优先级最大
    if (_id) {
      userRes = await db.collection('uni-id-users').doc(_id).get()
      if (userRes.data.length > 0) {
        throw handler.result({
          data: userRes.data,
          total: count.total,
          pagesize,
          pagenum,
          pages,
          params: {
            _id
          }
        })
      } else {
        throw handler.result({
          data: userRes.data,
          total: count.total,
          pagesize,
          pagenum,
          pages,
          params: {
            _id
          },
          code: 400,
          message: '未查询到该_id用户',
        })
      }
    }

    // 页码不可小于1
    if (pagenum < 1) {
      throw handler.result({
        code: 40001,
        message: 'pagenum不可小于1'
      })
    }

    // 全量查询
    if (pagesize < 1) {
      userRes = await db.collection('uni-id-users').get()
      throw handler.result({
        data: userRes.data,
        total: count.total,
        pagesize,
        pagenum,
        pages,
        params: this.params
      })
    }

    // 分页查询
    if (name && !platform) {
      // 用户名/昵称 模糊查询 单字匹配
      // userRes = await db.collection('uni-id-users').where(dbCmd.or({
      //   "username": new RegExp(name.split("").join("|"), 'g')
      // }, {
      //   "nickname": new RegExp(name.split("").join("|"), 'g')
      // })).skip(pagesize * (pagenum - 1)).limit(pagesize).get()

      // 用户名/昵称 模糊查询 全字匹配
      userRes = await db.collection('uni-id-users')
        .where(dbCmd.or({
          "username": new RegExp(name, 'g')
        }, {
          "nickname": new RegExp(name, 'g')
        })).skip(pagesize * (pagenum - 1)).limit(pagesize).get()

    } else if (!name && platform) {
      // 用户平台
      userRes = await db.collection('uni-id-users').where({
        "register_env.uni_platform": dbCmd.eq(platform)
      }).skip(pagesize * (pagenum - 1)).limit(pagesize).get()

    } else if (name && platform) {
      // 都筛选
      userRes = await db.collection('uni-id-users').where(
        dbCmd.and(
          dbCmd.or({
            "username": new RegExp(name.split("").join("|"), 'g')
          }, {
            "nickname": new RegExp(name.split("").join("|"), 'g')
          }), {
            "register_env.uni_platform": dbCmd.eq(platform)
          }
        )
      ).skip(pagesize * (pagenum - 1)).limit(pagesize).get()

    } else {
      // 不进行筛选
      userRes = await db.collection('uni-id-users').skip(pagesize * (pagenum - 1)).limit(pagesize).get()
    }

    return handler.result({
      data: userRes.data,
      total: count.total,
      pagesize,
      pagenum,
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