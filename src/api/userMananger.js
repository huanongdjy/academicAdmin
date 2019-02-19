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

export function updateUser (inputJson) {
  console.log(inputJson)
  return axios({
    url: '/updateUser',
    data: inputJson,
    method: 'post',
    withCredentials: true
  })
}
