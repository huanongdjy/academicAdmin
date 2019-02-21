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

export function updateAchievement (inputJson) {
  return axios({
    url: '/updateAchievement',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function uploadPhoto (uploadList) {
  // var inputJson = {
  //   up
  // }
  return axios({
    url: '/updateAchievement',
    method: 'post',
    data: uploadList,
    withCredentials: true
  })
}

export function deletePhotos (uploadList) {
  var inputJson = {
    uploadList
  }
  return axios({
    url: '/deletePhotos',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function addAchievement (inputJson) {
  return axios({
    url: '/addAchievement',
    method: 'post',
    data: uploadList,
    withCredentials: true
  })
}
