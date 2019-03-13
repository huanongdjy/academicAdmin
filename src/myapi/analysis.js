import axios from '@/libs/myaxios'

export function getPieData (inputJson) {
  return axios({
    url: '/getPieData',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}