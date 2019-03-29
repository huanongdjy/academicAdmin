import axios from '@/libs/myaxios'

export function addOutcome (inputJson) {
  return axios({
    url: '/addOutcome',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function getOutcome (inputJson) {
  return axios({
    url: '/getOutcome',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
