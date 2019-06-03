import { router, pathMatchRegexp } from 'utils'
import api from 'api'

const { queryAccount, createWallet, setMainWallet } = api

export default {
  namespace: 'wallets',

  state: {
    keypairs: null,
    selectedMainWallet: '',
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
      console.log('cu', data)
      yield put({
        type: 'updateState',
        payload: {
          selectedMainWallet: data.main,
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
    *setMainWallet({ payload }, { put, call, select }) {
      const { selectedMainWallet } = yield select(_ => _.wallets)
      const { data, success } = yield call(setMainWallet, {
        account: selectedMainWallet,
      })
      return success
    },
    *udpateSelectedMainWallet({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          selectedMainWallet: payload,
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
