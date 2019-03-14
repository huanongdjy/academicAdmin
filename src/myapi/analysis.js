import axios from '@/libs/myaxios'

export function getInforCardData (begTime, endTime) {
  var inputJson = {
    begTime,
    endTime
  }
  return axios({
    url: '/getInforCardData',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function getPieData (begTime, endTime) {
  var inputJson = {
    begTime,
    endTime
  }
  return axios({
    url: '/getPieData',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
