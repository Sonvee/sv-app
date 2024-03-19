const handler = require('sv-handler')
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  async dictList() {
    const {
      name
    } = this.params

    const dictRes = await db.collection('sv-sys-dict').where(dbCmd.or({
      "dict_id": new RegExp(name, 'g')
    }, {
      "dict_name": new RegExp(name, 'g')
    })).orderBy('dict_id', 'asc').get()

    return handler.result({
      data: dictRes.data
    })
  },

  async dictAdd() {
    const {
      dict_id,
      dict_name,
      dict
    } = this.params

    if (!dict_id || !dict_name || !dict) {
      throw handler.result({
        code: 40001
      })
    }

    const dictRes = await db.collection('sv-sys-dict').add(this.params)

    return handler.result({
      data: dictRes
    })
  },

  async dictUpdate() {
    const {
      _id,
      dict_id,
      dict_name,
      dict
    } = this.params

    if (!_id || !dict_id || !dict_name || !dict) {
      throw handler.result({
        code: 40001
      })
    }

    delete this.params._id
    const dictRes = await db.collection('sv-sys-dict').doc(_id).update(this.params)

    return handler.result({
      data: dictRes
    })
  },

  async dictDelete() {
    const {
      dict_id
    } = this.params

    const dictRes = await db.collection('sv-sys-dict').where({
      "dict_id": dbCmd.eq(dict_id)
    }).remove()

    return handler.result({
      data: dictRes
    })

  }
}