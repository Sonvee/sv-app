export const rules = {
  username: [{
      required: true,
      message: '请输入用户名'
    },
    {
      min: 3,
      max: 32,
      message: '用户名长度在 3 到 32 个字符'
    },
    {
      validator: (rule, value, callback) => {
        if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
          callback('用户名不能是：手机号或邮箱')
        }
        if (/^\d+$/.test(value)) {
          callback('用户名不能为纯数字')
        }
        if (/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(value)) {
          callback('用户名不能包含中文')
        }
        return true
      }
    }
  ],
  nickname: [{
      required: true,
      message: '请输入昵称'
    },
    {
      min: 3,
      max: 32,
      message: '昵称长度在 3 到 32 个字符'
    },
    {
      validator: (rule, value, callback) => {
        if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
          callback('用户名不能是：手机号或邮箱')
        }
        if (/^\d+$/.test(value)) {
          callback('用户名不能为纯数字')
        }
        return true
      }
    }
  ],
  password: [{
      required: true,
      message: '请输入密码'
    },
    {
      min: 8,
      max: 16,
      message: '密码长度在 8 到 16 个字符'
    },
    {
      validator: (rule, value, callback) => {
        if (
          !new RegExp(
            /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/
          ).test(value)
        ) {
          callback('密码必须为字母、数字和特殊符号任意两种的组合，密码长度必须在8-16位之间')
        }
        return true
      }
    }
  ],
  dcloud_appid: [{ required: true, message: '请选择可用APP', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  oldPassword: [{
      required: true,
      message: '请输入密码'
    },
    {
      min: 8,
      max: 16,
      message: '密码长度在 8 到 16 个字符'
    },
    {
      validator: (rule, value, callback) => {
        if (
          !new RegExp(
            /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/
          ).test(value)
        ) {
          callback('密码必须为字母、数字和特殊符号任意两种的组合，密码长度必须在8-16位之间')
        }
        return true
      }
    }
  ],
  newPassword: [{
      required: true,
      message: '请输入密码'
    },
    {
      min: 8,
      max: 16,
      message: '密码长度在 8 到 16 个字符'
    },
    {
      validator: (rule, value, callback) => {
        if (
          !new RegExp(
            /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/
          ).test(value)
        ) {
          callback('密码必须为字母、数字和特殊符号任意两种的组合，密码长度必须在8-16位之间')
        }
        return true
      }
    }
  ]
}