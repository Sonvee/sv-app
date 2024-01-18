import pagesJson from '@/pages.json'

// pages.json路由表匹配
function generateRouteTable(json) {
  let routeTable = [];
  // 主包pages中页面路由
  json.pages.forEach(page => {
    routeTable.push({
      url: page.path,
      name: page.style.navigationBarTitleText
    });
  });
  // 分包subPackages中页面路由（如果有的话）
  json.subPackages?.forEach(subPackage => {
    subPackage.pages.forEach(page => {
      routeTable.push({
        url: `${subPackage.root}/${page.path}`,
        name: page.style.navigationBarTitleText
      });
    });
  });
  return routeTable;
}
export const pageRouteTable = generateRouteTable(pagesJson)

export function getTabBarList() {
  const absTabbar = pagesJson?.tabBar?.list?.map(item => '/' + item.pagePath)
  const relTabbar = pagesJson?.tabBar?.list?.map(item => item.pagePath)
  return {
    absTabbar,
    relTabbar
  }
}