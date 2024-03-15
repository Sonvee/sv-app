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
  },

  /**
   * 更新用户会员有效期 - 一般在订阅成功时累加会员有效期用
   * @param {object} param {user_id:用户id, duration_time:权益续时(秒)}  
   */
  async vipValidUpdate({
    user_id,
    duration_time
  }) {
    // 1. 先判断vip_validity是否已过期
    const userRes = await db.collection('uni-id-users').doc(user_id).get()
    let {
      vip_validity = 0
    } = userRes.data[0]

    if (Date.now() > vip_validity) {
      // 2. 若vip_validity过期，则 validity_time = 当前时间戳 + 订阅权益时长
      vip_validity = Date.now() + duration_time
    } else {
      // 3. 若vip_validity未过期，则 vip_validity = vip_validity + 订阅权益时长
      vip_validity = vip_validity + duration_time
    }

    const userUpdateRes = await db.collection('uni-id-users').doc(user_id).update({
      'vip_validity': vip_validity
    })

    return handler.result({
      data: userUpdateRes.data,
    })
  },

  /**
   * 用户会员验证
   * 实时事件驱动：建议在用户访问特定接口、页面、登录时等情况触发检查
   */
  async vipVerify() {
    const {
      user_id
    } = this.params

    if (!user_id) {
      throw handler.result({
        code: 40001
      })
    }

    // 判断vip_validity是否已过期
    const userRes = await db.collection('uni-id-users').doc(user_id).get()
    let {
      vip_validity = 0
    } = userRes.data[0]

    if (Date.now() > vip_validity) {
      await uniCloud.importObject('sv-api-id').userRoleDelete({
        'user_id': user_id,
        'role_name': 'vip',
      })

      throw handler.result({
        data: {
          vip: false,
          vip_validity
        },
        message: 'VIP已过期',
      })
    }

    return handler.result({
      data: {
        vip: true,
        vip_validity
      },
      message: '尊敬的VIP会员，欢迎~',
    })
  },

  /**
   * 用户会员自动定时验证
   */
  async vipVerifyAuto() {
    // 筛选出所有vip用户
    const userRes = await db.collection('uni-id-users').where({
      'role': dbCmd.in(['vip'])
    }).get()

    const vipUsers = userRes.data

    // 将需要执行的异步操作放入一个数组
    const promises = vipUsers.map(async (item) => {
      if (!item.vip_validity || Date.now() > item.vip_validity) {
        // 将删除角色的操作包装在一个Promise中
        return new Promise((resolve, reject) => {
          uniCloud.importObject('sv-api-id').userRoleDelete({
            'user_id': item._id,
            'role_name': 'vip',
          }).then(() => {
            resolve();
          }).catch((error) => {
            reject(error);
          });
        });
      } else {
        // 如果当前用户vip_validity未过期，则直接返回一个Resolved状态的Promise
        return Promise.resolve();
      }
    });

    // 使用Promise.all并发执行所有异步操作
    const promisesAll = await Promise.all(promises);

    return handler.result({
      vipUsers,
      promisesAll
    })
  },
}