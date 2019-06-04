import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Card, Spin, Modal } from 'antd'
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
        title: i18n.t`领取 PTC 成功!`,
        content: (
          <div>
            <p>
              <Trans>收取 PTC：</Trans>
              {toPTC(data.amount)}
            </p>
            <p>
              <Trans>id: </Trans>
              {data.id}
            </p>
            <p>
              <Trans>tx：</Trans>
              {data.tx}
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
            height: 180,
            background: Color.blue,
          }}
        >
          <div onClick={this.getPTC} className={styles.main}>
            GET PTC
          </div>
        </Card>
      </Spin>
    )
  }
}

GetPTC.propTypes = {}
export default GetPTC
