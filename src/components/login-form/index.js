import LoginForm from './login-form.vue'
import axios from '@/libs/api.request'
export default LoginForm

export function login (username, password) {
  var inputjson = {
    username,
    password
  }
  return axios.request({
    url: '/login',
    data: inputjson,
    method: 'post'
  })
}
