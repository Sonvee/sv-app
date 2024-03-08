const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 会员套餐列表
  async vipList() {
    const planRes = await db.collection('sv-id-vip-plans').get()

    return handler.result({
      data: planRes.data,
    })
  },
  // 更新会员套餐
  async vipUpdate() {
    const {
      _id,
    } = this.params

    if (!_id) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id // 移除_id字段，_id不参与更新
    const planRes = await db.collection('sv-id-vip-plans').doc(_id).update(this.params)

    return handler.result({
      data: planRes.data,
    })
  },
  // 添加会员套餐
  async vipAdd() {
    const {
      name,
      price,
      validtime
    } = this.params

    if (!name || !price || !validtime) {
      throw handler.result({
        code: 40001
      })
    }

    const planRes = await db.collection('sv-id-vip-plans').add(this.params)

    return handler.result({
      data: planRes.data,
    })
  },
  // 删除会员套餐
  async vipDelete() {
    const {
      _id
    } = this.params

    if (!_id) {
      throw handler.result({
        code: 40001
      })
    }

    const planRes = await db.collection('sv-id-vip-plans').doc(_id).remove()

    return handler.result({
      data: planRes.data,
    })
  },
}