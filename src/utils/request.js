import axios from 'axios'
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import qs from 'qs'
import store from 'store'
import config from 'utils/config'

// const { CancelToken } = axios
// window.cancelRequest = new Map()

export default function request(options) {
  let { data, url, method = 'get' } = options
  const cloneData = cloneDeep(data)

  try {
    let domain = config.apiEndpoint || ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      console.log('...................', domain, urlMatch)
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }

  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${url}${isEmpty(cloneData) ? '' : '?'}${qs.stringify(cloneData)}`
      : url

  // options.cancelToken = new CancelToken(cancel => {
  //   window.cancelRequest.set(Symbol(Date.now()), {
  //     pathname: window.location.pathname,
  //     cancel,
  //   })
  // })

  // Add X-CQL-Token for authorization
  const token = store.get('token')
  if (token) {
    axios.interceptors.request.use(function(config) {
      config.headers['X-CQL-Token'] = token
      return config
    })
  }

  return axios(options)
    .then(response => {
      const { statusText, status, data } = response

      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }

      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...result,
      })
    })
    .catch(error => {
      const { response, message } = error

      // handle token expired or missing
      if (response.status === 403) {
        return response.data
      }

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.msg || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
