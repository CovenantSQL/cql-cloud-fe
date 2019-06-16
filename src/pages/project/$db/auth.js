import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { connect } from 'dva'
import {
  Button,
  Icon,
  Modal,
  Tag,
  InputNumber,
  Table,
  Input,
  Popconfirm,
  Form,
} from 'antd'
import { Page } from 'components'
import { OAuthTable } from './components'
import styles from './index.less'

const DEFAULT_OAUTH = [
  {
    provider: 'github',
    config: {
      enabled: false,
      client_id: '',
      client_secret: '',
    },
  },
  {
    provider: 'twitter',
    config: {
      enabled: false,
      client_id: '',
      client_secret: '',
    },
  },
  {
    provider: 'google',
    config: {
      enabled: false,
      client_id: '',
      client_secret: '',
    },
  },
]
@connect(({ projectDetail }) => ({ projectDetail }))
class Auth extends PureComponent {
  testUpdateOAuth = async () => {
    const { dispatch, projectDetail } = this.props
    const { data, success } = await dispatch({
      type: 'projectDetail/updateOAuthConfig',
      payload: {
        db: projectDetail.db,
        provider: 'github',
        client_id: 'foo',
        client_secret: 'bar',
        enabled: true,
      },
    })
  }
  testCreateTable = async () => {
    const { dispatch, projectDetail } = this.props
    const { data, success } = await dispatch({
      type: 'projectDetail/createTable',
      payload: {
        db: projectDetail.db,
        table: 'test_table',
        names: ['name', 'age', 'float', 'avatar'],
        types: ['TEXT', 'INTEGER', 'REAL', 'BLOB'],
      },
    })
  }
  testGetCallback = async () => {
    const { dispatch, projectDetail } = this.props
    const { data, success } = await dispatch({
      type: 'projectDetail/getPrivderCallback',
      payload: {
        db: projectDetail.db,
        provider: 'github',
      },
    })
    alert(JSON.stringify(data))
  }
  updateOAuth = ({ provider, client_id, client_secret, enabled }) => {
    const { dispatch, projectDetail } = this.props

    return new Promise(async (resolve, reject) => {
      const { data, success } = await dispatch({
        type: 'projectDetail/updateOAuthConfig',
        payload: {
          db: projectDetail.db,
          provider,
          client_id,
          client_secret,
          enabled,
        },
      })

      await dispatch({ type: 'projectDetail/query' })

      resolve({ data, success })
    })
  }
  prepareOAuthTableData = () => {
    let data = []
    const backend_oauth = _get(this.props.projectDetail, 'config.oauth', [])
    const oauth = DEFAULT_OAUTH.map(defaultConfig => {
      let index = backend_oauth.findIndex(
        config => config.provider === defaultConfig.provider
      )
      if (index > -1) {
        return backend_oauth[index]
      } else {
        return defaultConfig
      }
    })

    if (oauth) {
      oauth.map((d, idx) => {
        data.push({
          key: idx.toString(),
          provider: d.provider,
          enabled: d.config.enabled,
          client_id: d.config.client_id,
          client_secret: d.config.client_secret,
        })
      })
    }

    return data
  }
  render() {
    const { projectDetail } = this.props
    const { config, userList } = projectDetail

    return (
      <Page inner>
        <div className={styles.content}>
          <OAuthTable
            data={this.prepareOAuthTableData()}
            update={this.updateOAuth}
          />
        </div>
      </Page>
    )
  }
}

Auth.propTypes = {
  projectDetail: PropTypes.object,
}

export default Auth
