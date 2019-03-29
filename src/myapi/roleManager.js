import axios from '@/libs/myaxios'

export function getRoles (pageSize, currentPage) {
  var inputJson = {
    pageSize,
    currentPage
  }
  return axios({
    url: '/getIdentitysWithPage',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function addRole (inputJson) {
  return axios({
    url: '/addIdentity',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
export function deleteRole (inputJson) {
  return axios({
    url: '/deleteIdentity',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function updateRole (inputJson) {
  return axios({
    url: '/updateIdentity',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function searchRole (inputJson) {
  return axios({
    url: '/searchIdentity',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
