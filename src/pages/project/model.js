import modelExtend from 'dva-model-extend'
import api from 'api'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'

const { queryProjectConfig } = api

export default modelExtend(pageModel, {
  namespace: 'project',

  state: {
    db: '',
    config: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/project', location.pathname)) {
          dispatch({
            type: 'query',
            payload: {
              db:
                '8f52f1d65dd25a070dcb6e27f53961d88ff78588b36ea31c41071ee5f2f6a058',
            },
          })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      // update state.db
      yield put({ type: 'updateState', payload })

      // call api for config
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
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
})
