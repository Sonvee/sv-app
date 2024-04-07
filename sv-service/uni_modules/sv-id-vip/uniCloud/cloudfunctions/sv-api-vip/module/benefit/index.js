const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  // 会员权益列表
  async benefitList() {
    const benefitRes = await db.collection('sv-id-vip-benefits').orderBy('sort', 'asc').get()

    return handler.result({
      data: benefitRes.data,
    })
  },
  // 更新会员权益
  async benefitUpdate() {
    const {
      benefit_id,
    } = this.params

    if (!benefit_id) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id // 移除_id字段，_id不参与更新
    delete this.params.benefit_id // 移除benefit_id字段，不参与更新

    const benefitRes = await db.collection('sv-id-vip-benefits').where({
      benefit_id
    }).update(this.params)

    return handler.result({
      data: benefitRes.data,
    })
  },
  // 添加会员权益
  async benefitAdd() {
    const {
      benefit_id,
      benefit_name
    } = this.params

    if (!benefit_id || !benefit_name) {
      throw handler.result({
        code: 40001
      })
    }

    const benefitRes = await db.collection('sv-id-vip-benefits').add(this.params)

    return handler.result({
      data: benefitRes.data,
    })
  },
  // 删除会员权益
  async benefitDelete() {
    const {
      benefit_id
    } = this.params

    if (!benefit_id) {
      throw handler.result({
        code: 40001
      })
    }

    const benefitRes = await db.collection('sv-id-vip-benefits').where({
      benefit_id
    }).remove()

    return handler.result({
      data: benefitRes.data,
    })
  }
}