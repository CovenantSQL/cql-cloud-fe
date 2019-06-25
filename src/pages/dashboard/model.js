import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import api from 'api'
import { pathMatchRegexp } from 'utils'
import { model } from 'utils/model'

const {
  getPTC,
  queryTasks,
  queryTask,
  createProject,
  queryProject,
  topupProject,
  updateProjectMiscConfig,
} = api

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    tasks: [],
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

          dispatch({ type: 'app/getProjectList' })
          // query dashboard related
          dispatch({ type: 'getTaskList', payload: { all: true } })
        }
      })
    },
  },
  effects: {
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
    *createProject({ payload }, { call, put }) {
      const { data, success } = yield call(createProject, payload)

      yield put({ type: 'getTaskList', payload: { all: true } })
      return { data, success }
    },
    *topupProjectDB({ payload }, { call, put }) {
      const { data, success } = yield call(topupProject, payload)
      return { data, success }
    },
    *updateProjectMisc({ payload }, { call, put }) {
      const { data, success } = yield call(updateProjectMiscConfig, payload)
      return { data, success }
    },
  },
})
