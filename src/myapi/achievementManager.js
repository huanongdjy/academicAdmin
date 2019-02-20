import axios from '@/libs/myaxios'

export function getAchievement (pageSize, currentPage, type) {
  var inputJson = {
    pageSize,
    currentPage,
    type
  }
  return axios({
    url: '/getInformationWithPage',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function updateAchievement () {
  return axios({
    url: '/getInformationWithPage',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
