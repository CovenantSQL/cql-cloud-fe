/* global window */

import { router } from 'utils'
import { stringify } from 'qs'
import store from 'store'
import { message } from 'antd'
import { ROLE_TYPE } from 'utils/constant'
import { queryLayout, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE, USER_PERMISSION } from 'utils/constant'
import routes from 'utils/routes'
import api from 'api'
import config from 'config'

const {
  queryAccount,
  queryRouteList,
  logoutUser,
  queryUserInfo,
  queryCQLUserInfo,
} = api

export default {
  namespace: 'app',
  state: {
    // persistant
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    token: store.get('token') || '',
    userInfo: store.get('userInfo') || {},
    keypairs: store.get('keypairs') || {},
    // state
    user: {},
    permissions: {
      visit: [],
    },
    routeList: [
      {
        id: '1',
        icon: 'laptop',
        name: 'Dashboard',
        zhName: '仪表盘',
        router: '/dashboard',
      },
    ],
    locationPathname: '',
    locationQuery: {},
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },

    setup({ dispatch }) {
      // if not login then redirect to login page
      dispatch({ type: 'query' })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      const { locationPathname } = yield select(_ => _.app)
      console.log('app/query locationPathname', locationPathname)
      // add CQL login check logic
      const { success, data, msg } = yield call(queryCQLUserInfo)

      if (success) {
        // if login, set permisson as developer
        let permissions = USER_PERMISSION.DEVELOPER
        permissions.visit = routes.map(item => item.id)
        const routeList = routes

        // construct user data
        const {
          id,
          name,
          location,
          email,
          company,
          blog,
          bio,
          created_at,
          avatar_url,
        } = data.extra
        const user = {
          id,
          name,
          email,
          username: name,
          phone: 0,
          address: location,
          isMale: 0,
          createTime: created_at,
          avatar: avatar_url,
        }

        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            routeList,
          },
        })
        if (pathMatchRegexp(['/', '/login'], window.location.pathname)) {
          router.push({
            pathname: '/dashboard',
          })
        }
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        message.error(msg)
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        })
      }
    },

    *checkToken({ payload }, { call, put, select }) {
      console.log('app/checkToken called')
      // use account info for check token viability
      const {
        success,
        data: { keypairs },
      } = yield call(queryAccount)
      yield put({ type: 'app/handleKeypairsChange', payload: keypairs })

      const { locationPathname } = yield select(_ => _.app)

      if (success) {
        if (
          pathMatchRegexp(
            ['/', '/login', '/callback/github'],
            window.location.pathname
          )
        ) {
          console.log('in')
          keypairs === null
            ? router.push({ pathname: '/wallets' })
            : router.push({ pathname: '/dashboard' })
        }
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        // token is invalid, reset token to empty
        yield put({ type: 'handleTokenChange', payload: '' })
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        })
      }
    },

    *signOut({ payload }, { call, put }) {
      // clear token
      yield put({ type: 'handleTokenChange', payload: '' })
      console.log('localstorage', store.get('token'))

      // clear user related state
      yield put({
        type: 'updateState',
        payload: {
          user: {},
          permissions: { visit: [] },
          menu: [
            {
              id: '1',
              icon: 'laptop',
              name: 'Dashboard',
              zhName: '仪表盘',
              router: '/dashboard',
            },
          ],
        },
      })

      // query to redirect
      // yield put({ type: 'query' })
      router.push('/login')
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    handleTokenChange(state, { payload }) {
      store.set('token', payload)
      state.token = payload
    },

    handleUserInfoChange(state, { payload }) {
      store.set('userInfo', payload)
      state.userInfo = payload
    },

    handleKeypairsChange(state, { payload }) {
      store.set('keypairs', payload)
      state.keypairs = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
  },
}
