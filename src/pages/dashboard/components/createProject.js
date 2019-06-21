import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Card, Icon, Modal, Tag, InputNumber } from 'antd'
import { Trans, withI18n } from '@lingui/react'

import { Color, toPTC } from 'utils'
import styles from './createProject.less'

@withI18n()
@connect(({ loading, dashboard }) => ({ loading, dashboard }))
class CreateProject extends PureComponent {
  state = {
    node: 1,
  }
  confirmNodeNum = () => {
    const { i18n } = this.props
    let local = this

    Modal.confirm({
      title: i18n.t`请选择项目数据库副本数：`,
      content: (
        <div>
          <div>
            <Trans>
              项目数据库副本数会直接对标费用，
              如有高可用行需要，请选择多个副本。
            </Trans>
          </div>
          <div>
            <Trans>副本数：</Trans>
            <InputNumber
              min={1}
              max={5}
              defaultValue={1}
              onChange={v => {
                local.setState({ node: v })
              }}
            />
          </div>
        </div>
      ),
      okText: i18n.t`好的`,
      onOk: () => {
        this.createProject()
      },
    })
  }
  createProject = async () => {
    const { dispatch, i18n } = this.props
    const { node } = this.state

    const { data, success } = await dispatch({
      type: 'dashboard/createProject',
      payload: { node },
    })

    if (success) {
      this.setState({ loading: false })

      Modal.success({
        title: i18n.t`正在开立新项目，请耐心等待`,
        content: (
          <div>
            <p>
              <div>
                <Trans>详情见 Task：</Trans>
                <Tag color="green">ID {data.task_id}</Tag>
              </div>
            </p>
          </div>
        ),
        okText: i18n.t`好的`,
      })
    }
  }
  render() {
    return (
      <Card
        bordered={false}
        bodyStyle={{
          padding: 10,
          height: 160,
          color: '#fefefe',
          fontSize: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: Color.blue,
        }}
      >
        <div className={styles.main} onClick={this.confirmNodeNum}>
          <span style={{ marginRight: '6px' }}>
            <Icon type="plus-circle" theme="filled" />
          </span>
          <span style={{ fontWeight: '600' }}>
            <Trans>Create Project</Trans>
          </span>
        </div>
      </Card>
    )
  }
}

CreateProject.propTypes = {}
export default CreateProject
