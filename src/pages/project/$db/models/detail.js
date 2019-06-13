import { pathMatchRegexp } from 'utils'
import api from 'api'

const {
  queryProjectConfig,
  queryProjectUserList,
  queryProjectTables,
  updateProjectOAuthConfig,
  queryProjectOAuthCallback,
  createProjectTable,
} = api

export default {
  namespace: 'projectDetail',

  state: {
    db: '',
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
      yield put({ type: 'updateState', payload: { db: payload.db } })

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
    *updateOAuthConfig({ payload }, { call, put }) {
      const { data, success } = yield call(updateProjectOAuthConfig, payload)
      if (success) {
        return { data, success }
      } else {
        throw data
      }
    },
    *getPrivderCallback({ payload }, { call, put }) {
      const { data, success } = yield call(queryProjectOAuthCallback, payload)
      if (success) {
        return { data, success }
      } else {
        throw data
      }
    },
    *createTable({ payload }, { call, put }) {
      const { data, success } = yield call(createProjectTable, payload)
      if (success) {
        return { data, success }
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
