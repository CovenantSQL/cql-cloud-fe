import request from 'utils/request'
import { apiPrefix } from 'utils/config'

import store from 'store'

import api from './api'

const gen = params => {
  let url = apiPrefix + params
  let method = 'GET'

  const paramsArray = params.split(' ')
  if (paramsArray.length === 2) {
    method = paramsArray[0]
    url = apiPrefix + paramsArray[1]
  }

  return function(data) {
    return request({
      url,
      data,
      method,
    })
  }
}

const APIFunction = {}
for (const key in api) {
  APIFunction[key] = gen(api[key])
}

APIFunction.queryWeather = params => {
  params.key = 'i7sau1babuzwhycn'
  return request({
    url: `${apiPrefix}/weather/now.json`,
    data: params,
  })
}

// CQL
// APIFunction.queryAccount = (params = {}) => {
//   return request({
//     url: `http://api00.cn.gridb.io:15153/v3/admin/account`,
//     data: params,
//   })
// }

export default APIFunction
