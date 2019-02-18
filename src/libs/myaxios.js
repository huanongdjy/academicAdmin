import axios from 'axios'
// import Qs from 'qs'

// import cookie from '../../static/js/cookie.js'

// axios默认配置
axios.defaults.timeout = 10000 //  超时时间
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'text/plain'
axios.defaults.baseURL = 'http://localhost:8083' //   默认地址

// 路由响应拦截
// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.resultCode === '404') {
      // console.log("response.data.resultCode是404")
      // 返回 错误代码-1 清除ticket信息并跳转到登录页面
    //  cookie.del("ticket")
    //  window.location.href='http://login.com'
      // return
    } else {
      return response
    }
  },
  error => {
    return Promise.reject(error.response)// 返回接口返回的错误信息
  })

export default axios
