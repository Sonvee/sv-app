# sv-id-pages

## 写在前面

1. 基于uni-id-pages，重构部分页面和逻辑代码。
2. 目前适配了账号密码登录，手机号一键登录，短信验证码登录，微信登录，密码更改，短信验证码重置密码等。
3. 个人觉得直接使用uni-id-pages中对只开发小程序或app开发者来说可能有点冗余，且uni-id-pages不易改。
4. 因为本质上是基于uni-id-pages，适配了uni-id相关的云函数，可从原uni-id-pages迁移，但是要注意部分页面路径需要改动。

## 使用方式

使用uni_modules一键导入

### uni-config-center配置

在uniCloud/cloudfunctions/common/uni-config-center/下

#### 1. uni-captcha验证码配置
原uni-id-pages的验证码个人感觉很难看清，故该插件内已做了相对较易识别的样式，正常情况下已无需再更改。
详见官方文档[uni-captcha图形验证码](https://uniapp.dcloud.net.cn/uniCloud/uni-captcha.html)
```
{
	"width": 150,
	"height": 40,
	"background": "",
	"size": 4,
	"noise": 4,
	"color": true,
	"fontSize": 60,
	"ignoreChars": "",
	"mathExpr": false,
	"mathMin": 1,
	"mathMax": 9,
	"mathOperator": "",
	"expiresDate": 180,
	"scene": {
		"login": {
			"mathExpr": true
		},
		"register": {
			"expiresDate": 60
		}
	}
}
```

#### 2. uni-id配置

uni-id的配置应该不用多说，官方文档[uni-id用户体系](https://uniapp.dcloud.net.cn/uniCloud/uni-id-summary.html)，配置相关appid和secret等相关参数

## 特点

1. 支持账号密码登录、短信验证码登录、手机号一键登录、微信登录，密码更改，短信验证码重置密码等。
2. 该插件相对uni-id-pages来说，代码更简洁，且富含注释，易二次开发，样式也易修改。
3. 新的登录与个人空间界面，若需自定义页面样式，也很容易且方便开发者重构。
4. 扩展uni-id-pages-userInfo内容。
5. 提供url化的接口，遵守云对象url化规范，使用前需要知晓官方文档[云函数URL化](https://uniapp.dcloud.net.cn/uniCloud/http.html)使用方式。
6. 对图片上传进行了优化，开发者可自定义头像上传的文件夹，默认会在云存储生成avatarstorage文件夹，头像图片以 用户id + 时间戳 为文件名，在avatarstorage文件夹下保存，并且在用户更新头像时，会对旧头像进行文件资源删除释放处理。
7. 登录成功监听：（和uni-id-pages原版保持一致，新增回调参数e，即用户登录成功后的id等属性）

```
uni.$on('uni-id-pages-login-success', (e) => {
	console.log('==== 登录成功 ====', e);
})
```

8. 退出登录事件：（和uni-id-pages原版保持一致）

```
import { mutations } from '@/uni_modules/sv-id-pages/common/store.js'
mutations.logout()
```

9. 角色表和权限表内置了默认初始数据，位于database下的 uni-id-roles.init_data.json 及  uni-id-permission.init_data.json 可鼠标右键初始化云数据库数据

## 写在最后
若对插件有任何疑问或者优化建议，欢迎在评论区留言，在插件市场中的私信消息本人可能不经常留意，导致没能及时回复，
可以加入本人的插件问答QQ交流群: 852637893，欢迎进群交流。

<img width="200" src="https://mp-0ecede5c-a993-48bf-ba4b-45d9a8c7e79b.cdn.bspapp.com/resource/qqqun.jpg" alt="交流群:852637893"/>
