import { pathMatchRegexp } from 'utils'
import api from 'api'

const { queryProjectConfig, queryProjectUserList, queryProjectTables } = api

export default {
  namespace: 'projectDetail',

  state: {
    config: {},
    userList: {},
    tables: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // match basic
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/project/:db/:sub?', pathname)
        if (match) {
          const db = match[1]
          const sub = match[2]

          dispatch({ type: 'query', payload: { db: match[1] } })
          if (sub) {
            switch (sub) {
              case 'auth':
                dispatch({ type: 'getProjectUserList', payload: { db } })
                break
              case 'db':
                dispatch({ type: 'getProjectTables', payload: { db } })
                break
              case 'rules':
                console.log('TODO: get current rules')
                break
              default:
                return
            }
          }
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const { data, success } = yield call(queryProjectConfig, payload)
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            config: data,
          },
        })
      } else {
        throw data
      }
    },
    *getProjectUserList({ payload }, { call, put }) {
      const { data, success } = yield call(queryProjectUserList, payload)
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            userList: data,
          },
        })
      } else {
        throw data
      }
    },
    *getProjectTables({ payload }, { call, put }) {
      const { data, success } = yield call(queryProjectTables, payload)
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            tables: data,
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
