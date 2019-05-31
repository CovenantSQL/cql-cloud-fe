import { router, pathMatchRegexp } from 'utils'
import api from 'api'

const { queryAccount, createWallet } = api

export default {
  namespace: 'wallets',

  state: {
    keypairs: null,
    createdAccount: {
      account: '',
      key: '',
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'queryCurrentWallets' })
    },
  },

  effects: {
    *queryCurrentWallets({ payload }, { put, call, select }) {
      const { data } = yield call(queryAccount)
      console.log('cu', data.keypairs)
      yield put({
        type: 'updateState',
        payload: {
          keypairs: data.keypairs,
        },
      })
    },
    *createCQLWallet({ payload }, { put, call }) {
      const { data } = yield call(createWallet)
      yield put({
        type: 'updateState',
        payload: {
          createdAccount: data,
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
