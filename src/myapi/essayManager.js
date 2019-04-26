import axios from '@/libs/myaxios'
import { localRead } from '@/libs/util'// getToken

export function addEssay (inputJson) {
  return axios({
    url: '/addEssay',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function getEssays (pageSize, currentPage, type) {
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

export function searchEssays (inputJson) {
  return axios({
    url: '/searchEssays',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function deleteEssay (inputJson) {
  return axios({
    url: '/deleteEssay',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function updateEssay (inputJson) {
  return axios({
    url: '/updateEssay',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function changeEssayToshow (id, toshow) {
  var inputJson = {
    id,
    toshow
  }
  return axios({
    url: '/changeEssayToshow',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
