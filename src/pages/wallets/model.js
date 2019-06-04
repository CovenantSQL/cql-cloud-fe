import { router, pathMatchRegexp } from 'utils'
import api from 'api'

const {
  queryAccount,
  createWallet,
  setMainWallet,
  deleteWallet,
  uploadWallet,
  downloadWallet,
} = api

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
      const { data, success } = yield call(createWallet)
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            createdAccount: data,
          },
        })
        yield put({ type: 'queryCurrentWallets' })
      }
    },
    *deleteCQLWallet({ payload }, { put, call }) {
      const { data, success } = yield call(deleteWallet, payload)
      if (success) {
        yield put({ type: 'queryCurrentWallets' })
        return success
      }
    },
    *setMainWallet({ payload }, { put, call, select }) {
      const { selectedMainWallet } = yield select(_ => _.wallets)
      const { data, success } = yield call(setMainWallet, {
        account: selectedMainWallet,
      })
      return success
    },
    *uploadCQLWallet({ payload }, { put, call }) {
      try {
        const { data, success } = yield call(uploadWallet, payload)
        return { account: data.account, success }
      } catch (e) {
        return { account: '', success: false }
      }
    },
    *downloadCQLWallet({ payload }, { put, call }) {
      const { data, success } = yield call(downloadWallet, payload)
      return { key: data.key, success }
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
