import axios from '@/libs/myaxios'

export function getUsers (pageSize, currentPage) {
  var inputJson = {
    pageSize,
    currentPage
  }
  return axios({
    url: '/getUsers',
    data: inputJson,
    method: 'post',
    withCredentials: true
  })
}

export function getUserByUsername (username) {
  return axios({
    url: '/getUserByUsername',
    data: inputJson,
    method: 'post',
    withCredentials: true
  })
}

export function updateUser (inputJson) {
  return axios({
    url: '/updateUser',
    data: inputJson,
    method: 'post',
    withCredentials: true
  })
}

export function addUser (inputJson) {
  return axios({
    url: '/addUser',
    data: inputJson,
    method: 'post',
    withCredentials: true
  })
}

export function searchUser (inputJson) {
  return axios({
    url: '/searchUser',
    data: inputJson,
    method: 'post',
    withCredentials: true
  })
}

export function deleteUser (inputJson) {
  return axios({
    url: '/deleteUser',
    data: inputJson,
    method: 'post',
    withCredentials: true
  })
}
