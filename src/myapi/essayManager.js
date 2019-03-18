import axios from '@/libs/myaxios'

export function addEssay (inputJson) {
  return axios({
    url: '/addEssay',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function getEssays (pageSize, currentPage, type) {
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
