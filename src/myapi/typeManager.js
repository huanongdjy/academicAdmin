import axios from '@/libs/myaxios'

export function getTypes (pageSize, currentPage) {
  var inputJson = {
    pageSize,
    currentPage
  }
  return axios({
    url: '/getTypesWithPage',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function getAllType (inputJson) {
  return axios({
    url: '/getAllType',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function addType (inputJson) {
  return axios({
    url: '/addType',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
export function deleteType (inputJson) {
  return axios({
    url: '/deleteType',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function updateType (inputJson) {
  return axios({
    url: '/updateType',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function searchType (inputJson) {
  return axios({
    url: '/searchType',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
