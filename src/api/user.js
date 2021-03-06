import axios from '@/libs/myaxios'

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return new Promise((resolve, reject) => {
    axios({
      url: '/login',
      data,
      method: 'post'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// export const getUserInfo = (token) => {
//   return axios({
//     url: '/getUserInfo',
//     data: {
//       token
//     },
//     method: 'post'
//   })
// }

export const logout = () => {
  return axios({
    url: '/logout',
    method: 'post'
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
