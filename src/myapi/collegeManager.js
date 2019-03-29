import axios from '@/libs/myaxios'

export function getColleges (pageSize, currentPage) {
  var inputJson = {
    pageSize,
    currentPage
  }
  return axios({
    url: '/getCollegesWithPage',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
// export function getAllCollege (inputJson) {
//   return axios({
//     url: '/getAllCollege',
//     method: 'post',
//     data: inputJson,
//     withCredentials: true
//   })
// }

export function addCollege (inputJson) {
  return axios({
    url: '/addCollege',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
export function deleteCollege (inputJson) {
  return axios({
    url: '/deleteCollege',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function updateCollege (inputJson) {
  return axios({
    url: '/updateCollege',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}

export function searchCollege (inputJson) {
  return axios({
    url: '/searchCollege',
    method: 'post',
    data: inputJson,
    withCredentials: true
  })
}
