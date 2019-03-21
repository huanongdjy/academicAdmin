import {
  login,
  logout,
  getUserInfo
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import { getAccess } from '@/myapi/main'
import routers from '@/router/routers'

export default {
  state: {
    username: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    meta: []
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.username = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMeta (state, memus) {
      state.meta = memus
    }
  },
  getters: {
    getUsername: state => state.username
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password, identity }) {
      getAccess().then(res => {
        // routers[2].meta.access.push(res.data.memus[0].access)
        commit('setMeta', res.data.memus)
        console.log(res.data.memus)
        console.log(routers)
      })
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password,
          identity
        }).then(res => {
          const data = res.data
          if (data.resultCode === 200) {
            commit('setToken', res.data.token)
            const data = res.data.user
            commit('setAvator', data.avator)
            commit('setUserName', data.username)
            commit('setUserId', data.userId)
            commit('setAccess', [data.identity.access])
            commit('setHasGetInfo', true)
            setTimeout(() => {
              resolve(res)
              resolve()
            }, 1000)
          } else {
            resolve(res)
            resolve()
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data.user
            // commit('setAvator', data.avator)
            commit('setUserName', data.username)
            commit('setUserId', data.userId)
            commit('setAccess', [data.access])
            commit('setHasGetInfo', true)
            resolve(data)
          // })
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
