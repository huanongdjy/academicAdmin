import { localSave, localRead } from '@/libs/util'// getToken
import Main from '@/components/main'
// import axios from 'axios'
import { getMenuList } from '@/myapi/menuManager'
// import config from '@/config'
// import { forEach } from '@/libs/tools'
// import httpurl from '@/config/httpURL'
// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// 初始化路由
export const initRouter = (vm) => {
  // if (!getToken()) {
  //   return
  // }
  let list = []
  // 模拟异步请求，改为您实际的后端请求路径
  // axios.post(httpurl + 'getMenuList').then(res => {
  //   var menuData = res.data.menuList
  //   // 这是后端回传给前端的数据，如上面所说的
  //   localSave('route', JSON.stringify(menuData))
  //   // 格式化菜单
  //   list = formatMenu(menuData)
  //   // 刷新界面菜单
  //   vm.$store.commit('updateMenuList', list)
  //   return list
  // })
  getMenuList().then(res => {
    var menuData = res.menuList
    // 这是后端回传给前端的数据，如上面所说的
    localSave('route', JSON.stringify(menuData))
    // 格式化菜单
    list = formatMenu(menuData)
    // 刷新界面菜单
    vm.$store.commit('updateMenuList', list)
    return list
  })
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
  list.forEach(item => {
    var obj
    if (item.component === 'Main') {
      obj = {
        menu_id: item.menu_id,
        path: item.path,
        name: item.name,
        component: Main,
        meta: {
          // hideInBread: true,
          access: [item.access]
        },
        children: []
      }
      if (item.title === '学术活动管理') {
        obj = {
          menu_id: item.menu_id,
          path: item.path,
          name: item.name,
          component: Main,
          meta: {
            access: [item.access],
            title: item.title,
            icon: 'md-menu'
          },
          children: []
        }
        // obj.meta.title = item.title
        // obj.meta.icon = 'md-menu'
      }
    } else {
      obj = {
        path: item.path,
        name: item.name,
        meta: {
          title: item.title,
          herf: '',
          icon: 'ios-book'
        }
      }
      let data = item.component
      obj.component = () => import('@/view' + data)
    }
    if (!(item.children === null)) {
      let retlist = formatMenu(item.children)
      retlist.forEach(it => {
        obj.children.push(it)
      })
    }
    res.push(obj)
  })
  return res
}
