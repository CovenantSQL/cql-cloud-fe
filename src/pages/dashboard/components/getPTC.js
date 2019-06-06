import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Card, Spin, Modal, Tag } from 'antd'
import { Trans, withI18n } from '@lingui/react'

import { Color, toPTC } from 'utils'
import styles from './getPTC.less'

@withI18n()
@connect(({ loading, dashboard }) => ({ loading, dashboard }))
class GetPTC extends PureComponent {
  state = {
    loading: false,
  }
  getPTC = async () => {
    const { dispatch, i18n } = this.props
    this.setState({ loading: true })

    const { data, success } = await dispatch({
      type: 'dashboard/getPTC',
    })

    if (success) {
      this.setState({ loading: false })

      Modal.success({
        title: i18n.t`领取 PTC 成功！即将到账。`,
        content: (
          <div>
            <p>
              <Trans>即将收取 PTC：</Trans>
              <Tag color="blue">{toPTC(data.amount)}</Tag>
              <Trans>，会在几分钟内到账。</Trans>
            </p>
            <p>
              <div>
                <Trans>详情见 Task ID: </Trans>
                {data.task_id}
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
      <Spin spinning={this.state.loading}>
        <Card
          bordered={false}
          className={styles.card}
          bodyStyle={{
            padding: 0,
            height: 160,
            background: Color.blue,
          }}
        >
          <div onClick={this.getPTC} className={styles.main}>
            <Trans>领取 PTC</Trans>
          </div>
        </Card>
      </Spin>
    )
  }
}

GetPTC.propTypes = {}
export default GetPTC
