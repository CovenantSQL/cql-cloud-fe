import { pathMatchRegexp } from 'utils'
import api from 'api'

const {
  queryProjectConfig,
  queryProjectUserList,
  queryProjectTables,
  queryProjectOAuthCallback,
  queryProjectTableDetail,
  createProjectTable,
  updateProjectUser,
  updateProjectOAuthConfig,
} = api

export default {
  namespace: 'projectDetail',

  state: {
    db: '',
    // auth
    config: {},
    userList: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    // db
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
                dispatch({
                  type: 'getProjectUserList',
                  payload: {},
                  pagi: { current: 1, pageSize: 10 },
                })
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
    /**
     * payload:
     * enabled: only show enabled
     * page: current page
     * pageSize: page size
     */
    *getProjectUserList({ payload, pagi }, { call, put, select }) {
      const { db, pagination } = yield select(_ => _.projectDetail)
      let p = pagi || pagination

      let _payload = Object.assign(
        { db },
        {
          offset: p.pageSize * (p.current - 1),
          limit: p.pageSize,
        },
        payload
      )

      /**
       * _payload for API call:
       * db, term
       * enabled: only show enabled
       * offset: page * limit
       * limit: page size
       */
      const { data, success } = yield call(queryProjectUserList, _payload)
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            userList: data.users,
            pagination: {
              current: Number(p.current),
              pageSize: Number(p.pageSize),
              total: data.total,
            },
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
    *updateUser({ payload }, { call, put, select }) {
      const { db } = yield select(_ => _.projectDetail)
      let _payload = Object.assign({ db }, payload)

      const { data, success } = yield call(updateProjectUser, _payload)
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
