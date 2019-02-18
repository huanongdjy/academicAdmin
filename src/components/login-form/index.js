import LoginForm from './login-form.vue'
import axios from '@/libs/api.request'
export default LoginForm

export function login (username, password, identity) {
  var inputjson = {
    username,
    password,
    identity
  }
  return axios.request({
    url: '/login',
    data: inputjson,
    method: 'post'
  })
}
