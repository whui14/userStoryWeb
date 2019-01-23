import API from '../utils/API'
import messageHandler from '../utils/messageHandler'
export const SET_BASIC = 'SET_BASIC'
export const setUserInfo = (user) => (dispatch) => {
  console.log(user)
  return Promise.resolve().then(() => {
    localStorage.setItem('token', user.token)
    localStorage.setItem('userId', user.userId)
    dispatch({
      type: SET_BASIC,
      payload: user,
    })
  })
}

export const LOGOUT = 'LOGOUT'
export const logout = (token) => (dispatch) => {
  API.query('/user/logout', {
    token: token,
    options: {
      method: 'POST',
    }
  }).then(messageHandler).then((json) => {
    if (json.code === 0) {
      dispatch({
        type: LOGOUT,
        payload: {}
      })
    }
  })
}
