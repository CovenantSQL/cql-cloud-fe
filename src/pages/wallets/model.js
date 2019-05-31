import { router, pathMatchRegexp } from 'utils'
import api from 'api'

const { queryAccount } = api

export default {
  namespace: 'wallets',

  state: {
    keypairs: null,
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'queryCurrentWallets' })
    },
  },

  effects: {
    *queryCurrentWallets({ payload }, { put, call, select }) {
      const { data } = yield call(queryAccount)
      yield put({
        type: 'updateState',
        payload: {
          keypairs: data.keypair,
        },
      })
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
