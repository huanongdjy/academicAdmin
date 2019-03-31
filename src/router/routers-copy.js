import Main from '@/components/main'
// import store from '@/store'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/usermanage',
    name: 'usermanage',
    meta: {
      hideInBread: true
      // access: [store.state.user.meta[0].access]
    },
    component: Main,
    children: [
      {
        path: 'usermanage_page',
        name: 'usermanage_page',
        meta: {
          title: '用户管理',
          icon: 'ios-book'
        },
        component: () => import('@/view/directive/myUserMananger')
      }
    ]
  },
  {
    path: '/roleManager',
    name: 'roleManager',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'role_page',
        name: 'role_page',
        meta: {
          title: '角色管理',
          href: '',
          icon: 'ios-book'
        },
        component: () => import('@/view/directive/roleManager.vue')
      }
    ]
  },
  {
    path: '/achievementmanage',
    name: 'achievementmanage',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'achievementmanage_page',
        name: 'achievementmanage_page',
        meta: {
          title: '学术成果管理',
          icon: 'ios-book'
        },
        component: () => import('@/view/directive/myAchievementManager.vue')
      }
    ]
  },
  {
    path: '/activitymanage',
    name: 'activitymanage',
    // meta: {
    //   hideInBread: true
    // },
    meta: {
      icon: 'md-menu',
      title: '学术活动管理'
    },
    component: Main,
    children: [
      {
        path: 'activitymanage_page',
        name: 'activitymanage_page',
        meta: {
          title: '未举办活动',
          href: '',
          icon: 'ios-book'
        },
        component: () => import('@/view/directive/myEssay.vue')
      },
      {
        path: 'activityholded_page',
        name: 'activityholded_page',
        meta: {
          icon: 'ios-book',
          title: '已举办活动'
        },
        component: () => import('@/view/directive/essayholded.vue')
      }
    ]
  },
  {
    path: '/subjectmanage',
    name: 'subjectmanage',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'subjectmanage_page',
        name: 'subjectmanage_page',
        meta: {
          title: '学科管理',
          href: '',
          icon: 'ios-book'
        },
        component: () => import('@/view/directive/myTypeManager.vue')
      }
    ]
  },
  // {
  //   path: '/record',
  //   name: 'record',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'record_page',
  //       name: 'record_page',
  //       meta: {
  //         title: '日志',
  //         href: '',
  //         icon: 'ios-book'
  //       },
  //       component: () => import('@/view/directive/myUserMananger.vue')
  //     }
  //   ]
  // },
  {
    path: '/collegeManager',
    name: 'collegeManager',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'college_page',
        name: 'college_page',
        meta: {
          title: '学院管理',
          href: '',
          icon: 'ios-book'
        },
        component: () => import('@/view/directive/collegeManager.vue')
      }
    ]
  },
  {
    path: '/personalManager',
    name: 'personalManager',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'personal_page',
        name: 'personal_page',
        meta: {
          title: '个人中心',
          href: '',
          icon: 'ios-book'
        },
        component: () => import('@/view/directive/personalManager.vue')
      }
    ]
  }
]
