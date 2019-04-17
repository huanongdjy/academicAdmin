import axios from '@/libs/myaxios'

export function getInforCardData (college_id, begTime, endTime) {
  var inputJson = {
    college_id,
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

export function getEssayPieData (college_id, begTime, endTime) {
  var inputJson = {
    college_id,
    begTime,
    endTime
  }
  return axios({
    url: '/getEssayPieData',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function getAchievementPieData (college_id, begTime, endTime) {
  var inputJson = {
    college_id,
    begTime,
    endTime
  }
  return axios({
    url: '/getAchievementPieData',
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
