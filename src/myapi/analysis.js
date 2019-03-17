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

export function getLineChart (time0, time1, time2, time3, time4, time5, time6, time7) {
  var inputJson = {
    time0,
    time1,
    time2,
    time3,
    time4,
    time5,
    time6,
    time7
  }
  return axios({
    url: '/getLineChart',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
