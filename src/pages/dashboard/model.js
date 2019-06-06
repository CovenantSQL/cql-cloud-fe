import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import api from 'api'
import { pathMatchRegexp } from 'utils'
import { model } from 'utils/model'

const { queryDashboard, queryWeather, getPTC, queryTasks, queryTask } = api

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    tasks: [],
    weather: {
      city: '深圳',
      temperature: '30',
      name: '晴',
      icon: '//s5.sencdn.com/web/icons/3d_50/2.png',
    },
    sales: [],
    quote: {
      avatar:
        'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
    numbers: [],
    recentSales: [],
    comments: [],
    completed: [],
    browser: [],
    cpu: {},
    user: {
      avatar:
        'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (
          pathMatchRegexp('/dashboard', pathname) ||
          pathMatchRegexp('/', pathname)
        ) {
          // check token validility
          dispatch({ type: 'app/query' })
          // check mainwallet null
          dispatch({ type: 'app/checkMainWallet' })

          // query dashboard related
          dispatch({ type: 'query' })
          // dispatch({ type: 'queryWeather' })
          dispatch({ type: 'getTaskList', payload: { all: true } })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryDashboard, parse(payload))
      yield put({
        type: 'updateState',
        payload: data,
      })
    },
    *queryWeather({ payload = {} }, { call, put }) {
      payload.location = 'shenzhen'
      const result = yield call(queryWeather, payload)
      const { success } = result
      if (success) {
        const data = result.results[0]
        const weather = {
          city: data.location.name,
          temperature: data.now.temperature,
          name: data.now.text,
          icon: `//s5.sencdn.com/web/icons/3d_50/${data.now.code}.png`,
        }
        yield put({
          type: 'updateState',
          payload: {
            weather,
          },
        })
      }
    },
    *getPTC({ payload }, { call, put }) {
      const { data, success } = yield call(getPTC)
      yield put({ type: 'app/checkMainWallet' })

      // get all recent tasks
      yield put({ type: 'getTaskList', payload: { all: true } })
      return { data, success }
    },
    *getTaskList({ payload }, { call, put }) {
      const { data, success } = yield call(queryTasks, payload)
      if (success) {
        yield put({
          type: 'updateState',
          payload: data,
        })
      }
      return { data, success }
    },
    *getTaskInfo({ payload }, { call, put }) {
      const { data, success } = yield call(queryTask, payload)
      return { data, success }
    },
  },
})
