import { router, pathMatchRegexp } from 'utils'
import { get } from 'lodash'
import api from 'api'

const { loginUser, queryGithubOAuth } = api

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      const data = yield call(loginUser, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (!pathMatchRegexp('/login', from)) {
          if (from === '/') router.push('/dashboard')
          else router.push(from)
        } else {
          router.push('/dashboard')
        }
      } else {
        throw data
      }
    },
    *loginGithub({ payload }, { put, call, select }) {
      const data = yield call(queryGithubOAuth, payload)
      const redirectUrl = get(data, 'data.url')
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    },
  },
}
