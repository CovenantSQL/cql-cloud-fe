import { get } from 'lodash'
// import { router } from 'utils'
import api from 'api'

const {
  queryToken,
  // queryAccount,
} = api

export default {
  namespace: 'callback',

  state: {},

  effects: {
    *token({ payload }, { put, call, select }) {
      // get CQL token
      try {
        const data = yield call(queryToken, payload)
        // set localStorage for token and userInfo
        const token = get(data, 'data.token')
        const userInfo = get(data, 'data.extra')
        yield put({ type: 'app/handleTokenChange', payload: token })
        yield put({ type: 'app/handleUserInfoChange', payload: userInfo })
      } catch (e) {
        console.error(e)
      }

      // get user's main wallet
      yield put({ type: 'app/checkToken' })
    },
  },
}
