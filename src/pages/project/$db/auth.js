import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Icon, Modal, Tag, InputNumber } from 'antd'
import { Page } from 'components'
import styles from './index.less'

@connect(({ projectDetail }) => ({ projectDetail }))
class ProjectDetail extends PureComponent {
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

    console.log('//////////auth', data)
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
  render() {
    const { projectDetail } = this.props
    const { config, userList } = projectDetail

    return (
      <Page inner>
        <div className={styles.content}>
          <pre>{JSON.stringify(config, null, 2)}</pre>
          <pre>{JSON.stringify(userList, null, 2)}</pre>

          <div>
            <Button onClick={this.testUpdateOAuth}>update oauth</Button>
            <Button onClick={this.testGetCallback}>get oauth callback</Button>
            <Button onClick={this.testCreateTable}>create table</Button>
          </div>
        </div>
      </Page>
    )
  }
}

ProjectDetail.propTypes = {
  projectDetail: PropTypes.object,
}

export default ProjectDetail
