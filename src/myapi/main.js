import axios from '@/libs/myaxios'

export function getAccess () {
  return axios({
    url: '/getAccess',
    method: 'post',
    withCredentials: true
  })
}
