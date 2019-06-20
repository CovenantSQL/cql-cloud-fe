import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { connect } from 'dva'
import { Trans, withI18n } from '@lingui/react'
import { Page } from 'components'
import { OAuthTable, List, UpdateUser } from './auth_components'
import { DEFAULT_OAUTH } from 'utils/constant'
import styles from './auth.less'

@connect(({ projectDetail, loading }) => ({ projectDetail, loading }))
class Auth extends PureComponent {
  state = {
    updateUserVisible: false,
    userToUpdate: {},
  }
  getCallbackURL = async provider => {
    const { dispatch, projectDetail } = this.props
    const { data, success } = await dispatch({
      type: 'projectDetail/getPrivderCallback',
      payload: {
        db: projectDetail.db,
        provider,
      },
    })
    return { data, success }
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
    const backend_oauth = _get(this.props.projectDetail, 'config.oauth') || []
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
      oauth.forEach((d, idx) => {
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
  closeUpdateUserModal = () =>
    this.setState({ updateUserVisible: false, userToUpdate: {} })
  render() {
    const { projectDetail, loading } = this.props
    const { userList, pagination } = projectDetail

    const authTableProps = {
      loading: loading.effects['projectDetail/query'],
    }

    const listProps = {
      dataSource: userList,
      loading: loading.effects['projectDetail/getProjectUserList'],
      pagination,
      onChange(page) {
        console.log('changed page', page)
      },
      onDeleteItem(id) {
        console.log('delete', id)
      },
      onEditItem: item => {
        console.log('edit item', item)
        this.setState({
          updateUserVisible: true,
          userToUpdate: item,
        })
      },
    }

    return (
      <Page inner>
        <section className={styles.authTable} id="oauth">
          <div className={styles.title}>
            <Trans>OAuth Config:</Trans>
          </div>
          <OAuthTable
            {...authTableProps}
            data={this.prepareOAuthTableData()}
            update={this.updateOAuth}
            getCallbackURL={this.getCallbackURL}
          />
        </section>
        <section className={styles.users} id="users">
          <div className={styles.title}>
            <Trans>Users:</Trans>
          </div>
          <List {...listProps} />
          <UpdateUser
            visible={this.state.updateUserVisible}
            user={this.state.userToUpdate}
            close={this.closeUpdateUserModal}
          />
        </section>

        <div className="debug">
          <pre>{JSON.stringify(userList, null, 2)}</pre>
        </div>
      </Page>
    )
  }
}

Auth.propTypes = {
  projectDetail: PropTypes.object,
}

export default Auth
