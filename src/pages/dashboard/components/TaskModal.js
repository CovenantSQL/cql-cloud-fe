import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Input, Tag, Button, Modal, Tooltip, Icon } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { toPTC } from 'utils'
import { WalletAvatar } from 'components'
import styles from './TaskModal.less'

const ApplyToken = ({ data }) => {
  return (
    <div>
      <Tag color="cyan">ID: {data.id}</Tag>
      <Tag color="orange">{data.state}</Tag>
      <div>
        Created at: {moment(data.created).format('YYYY-MM-DD HH:mm:ss')}
      </div>
      <div>
        <WalletAvatar seed={data.args.account} cutoff={28} />
        Got:
        <Tag color="blue">{toPTC(data.args.amount)} PTC</Tag>
      </div>
      <div>
        id: {data.result.id}
        <div>
          tx:
          <Tag color="green">{data.result.tx}</Tag>
        </div>
      </div>
    </div>
  )
}

@withI18n()
@connect(({ loading, wallets }) => ({ loading, wallets }))
class TaskModal extends PureComponent {
  renderType = () => {
    const { data } = this.props
    const { type } = data
    switch (type) {
      case 'ApplyToken':
        return <ApplyToken data={data} />
    }
  }
  render() {
    const { data, close } = this.props
    const { type } = this.props.data
    return (
      <Modal
        visible={true}
        title={type}
        onCancel={close}
        footer={[
          <Button type="primary" onClick={close}>
            <Trans>好的</Trans>
          </Button>,
        ]}
      >
        <div className={styles.main}>{this.renderType()}</div>
      </Modal>
    )
  }
}

TaskModal.propTypes = {
  data: PropTypes.object.isRequired,
  close: PropTypes.func,
}
TaskModal.defaultProps = {}
export default TaskModal
