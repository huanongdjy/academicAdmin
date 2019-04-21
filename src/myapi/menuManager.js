import axios from '@/libs/myaxios'

export function getMenusWithPage (pageSize, currentPage) {
  var inputJson = {
    pageSize,
    currentPage
  }
  return new Promise((resolve, reject) => {
    axios({
      url: '/getMenusWithPage',
      method: 'post',
      data: inputJson,
      withCredentials: true
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
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

export function getMenuList () {
  return new Promise((resolve, reject) => {
    axios({
      url: '/getMenuList',
      method: 'post',
      withCredentials: true
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
  //   setTimeout(() => {
  //     resolve(res)
  //     resolve()
  //   }, 2000)
  // }).catch(err => {
  //   reject(err)
  // })
}
