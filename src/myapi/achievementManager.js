import axios from '@/libs/myaxios'
import { localRead } from '@/libs/util'// getToken

export function getAchievement (pageSize, currentPage, type) {
  let college_id = localRead('college_id')
  var inputJson = {
    pageSize,
    currentPage,
    type,
    college_id
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
    data: inputJson,
    withCredentials: true
  })
}

export function deleteAchievement (inputJson) {
  return axios({
    url: '/deleteAchievement',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function searchaChievement (inputJson) {
  return axios({
    url: '/searchaChievement',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function changeAchievementToshow (id, toshow) {
  var inputJson = {
    id,
    toshow
  }
  return axios({
    url: '/changeAchievementToshow',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
