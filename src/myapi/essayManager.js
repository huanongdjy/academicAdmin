import axios from '@/libs/myaxios'

export function addEssay (inputJson) {
  return axios({
    url: '/addEssay',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
