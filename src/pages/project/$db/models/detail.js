import { pathMatchRegexp } from 'utils'
import api from 'api'

const {
  queryProjectConfig,
  queryProjectUserList,
  queryProjectTables,
  updateProjectOAuthConfig,
  queryProjectOAuthCallback,
  queryProjectTableDetail,
  createProjectTable,
} = api

export default {
  namespace: 'projectDetail',

  state: {
    db: '',
    config: {},
    userList: {},
    table_names: [],
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
          dispatch({ type: 'updateState', payload: { db: match[1] } })
          dispatch({ type: 'query' })

          if (sub) {
            switch (sub) {
              case 'auth':
                dispatch({ type: 'getProjectUserList', payload: { db } })
                break
              case 'db':
                dispatch({ type: 'getProjectTables' })
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
    *query({ payload }, { call, put, select }) {
      const { db } = yield select(_ => _.projectDetail)

      const { data, success } = yield call(queryProjectConfig, { db })
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
    *getProjectTables({ payload }, { call, put, select }) {
      const { db } = yield select(_ => _.projectDetail)
      let _payload = Object.assign({ db }, payload)

      const { data, success } = yield call(queryProjectTables, _payload)
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            table_names: data.tables,
          },
        })
        for (let i = 0; i < data.tables.length; i++) {
          let table_name = data.tables[i]
          let detail = yield call(queryProjectTableDetail, {
            table: table_name,
            db,
          })
          yield put({
            type: 'updateTable',
            payload: {
              [table_name]: detail.data,
            },
          })
        }
      } else {
        throw data
      }
    },
    *getProjectTableDetail({ payload }, { call, put, select }) {
      const { db } = yield select(_ => _.projectDetail)
      let _payload = Object.assign({ db }, payload)

      const { data, success } = yield call(queryProjectTableDetail, _payload)
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
    *createTable({ payload }, { call, put, select }) {
      const { db } = yield select(_ => _.projectDetail)
      let _payload = Object.assign({ db }, payload)

      const { data, success } = yield call(createProjectTable, _payload)
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
    updateTable(state, { payload }) {
      return {
        ...state,
        tables: {
          ...state.tables,
          ...payload,
        },
      }
    },
  },
}
