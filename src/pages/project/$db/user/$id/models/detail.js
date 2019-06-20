import { pathMatchRegexp } from 'utils'
import api from 'api'

const { queryProjectUser } = api

export default {
  namespace: 'userDetail',

  state: {
    data: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/project/:db/user/:id', pathname)
        if (match) {
          dispatch({ type: 'query', payload: { db: match[1], id: match[2] } })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const res = yield call(queryProjectUser, payload)
      const {
        success,
        data: { extra, ...other },
      } = res
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: Object.assign({}, other, extra),
          },
        })
      } else {
        throw res
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
}
