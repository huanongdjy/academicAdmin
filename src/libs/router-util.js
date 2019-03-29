import { getToken, hasChild, localSave, localRead } from '@/libs/util'
import Main from '@/components/main'
import axios from 'axios'
import config from '@/config'
import { forEach } from '@/libs/tools'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

// 初始化路由
export const initRouter = (vm) => {
  if (!getToken()) {
    return
  }
  let list = []
  // 模拟异步请求，改为您实际的后端请求路径
  axios.get(baseUrl + '/system/permission/userMenuList', {
    headers: { 'Authorization': 'Bearer ' + getToken() }
  }).then(res => {
    var menuData = res.data.data
    // 这是后端回传给前端的数据，如上面所说的
    console.log('menuData:', menuData)
    localSave('route', JSON.stringify(menuData))
    // 格式化菜单
    list = formatMenu(menuData)
    // 刷新界面菜单
    vm.$store.commit('updateMenuList', list)
  })

  return list
}

// 加载菜单，在创建路由时使用
export const loadMenu = () => {
  let list = []
  let data = localRead('route')
  if (!data) {
    return list
  }
  list = formatMenu(JSON.parse(data))
  return list
}

// 格式化菜单
export const formatMenu = (list) => {
  let res = []
  forEach(list, item => {
    let obj = {
      path: item.path,
      name: item.name
    }
    obj.meta = item.meta
    // 惰性递归 ****
    if (item.parentId === 0) {
      obj.component = Main
    } else {
      // 惰性递归 ****
      let data = item.component
      // 这里需要改成自己定义的 .vue 夜间路径
      obj.component = () => import('@/view' + data)
    }
    if (hasChild(item)) {
      obj.children = formatMenu(item.children)
    }
    res.push(obj)
  })
  return res
}
