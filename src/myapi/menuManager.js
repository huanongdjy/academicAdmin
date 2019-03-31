import axios from '@/libs/myaxios'

export function getMenusWithPage (pageSize, currentPage) {
  var inputJson = {
    pageSize,
    currentPage
  }
  return axios({
    url: '/getMenusWithPage',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function updateMenu (inputJson) {
  return axios({
    url: '/updateMenu',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function searchMenu (inputJson) {
  return axios({
    url: '/searchMenu',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
