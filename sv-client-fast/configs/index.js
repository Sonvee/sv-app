import manifest from '@/manifest.json'

const base_url = 'https://fc-mp-74bfcbac-6ba6-4f39-8513-8831390ff75a.next.bspapp.com' // 云函数URL化基础路径
const base_cdn = 'https://mp-74bfcbac-6ba6-4f39-8513-8831390ff75a.cdn.bspapp.com' // 云存储下载域名

const config = {
  name: manifest.name,
  appid: manifest.appid,
  description: manifest.description,
  version: manifest.versionName,
  base_url: base_url,
  api_url: `${base_url}/api`,
  logo_url: `${base_cdn}/staticstorage/logo.png` // logo图标路径
}

export default config