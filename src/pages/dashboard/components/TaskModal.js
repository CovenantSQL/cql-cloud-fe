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
      <label>
        <WalletAvatar seed={data.args.account} cutoff={28} />
      </label>
      <div>
        <Tag color="cyan">ID: {data.id}</Tag>
        <Tag color="orange">{data.state}</Tag>
      </div>
      <div>
        <label>Created at:</label>
        <div>{moment(data.created).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
      <div>
        <label>Recieved:</label>
        <div>
          <Tag color="blue">{toPTC(data.args.amount)} PTC</Tag>
        </div>
      </div>
      <div>
        <label>id:</label>
        <div>{data.result.id}</div>
      </div>
      <div>
        <label>tx:</label>
        <div>{data.result.tx}</div>
      </div>
    </div>
  )
}

const CreateProject = ({ data }) => {
  return (
    <div>
      <div>
        <Tag color="cyan">ID: {data.id}</Tag>
        <Tag color="orange">{data.state}</Tag>
      </div>
      <div>
        <label>Created at:</label>
        <div>{moment(data.created).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
      <div>
        <label>Finished at:</label>
        <div>{moment(data.finished).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
      <div>
        <label>Node #:</label>
        <div>
          <Tag color="blue">{data.args.node_count} Nodes</Tag>
        </div>
      </div>
      <div>
        <label>result:</label>
        <div>
          <pre className="json">{JSON.stringify(data.result, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

const TopupProject = ({ data }) => {
  return (
    <div>
      <div>
        <Tag color="cyan">ID: {data.id}</Tag>
        <Tag color="orange">{data.state}</Tag>
      </div>
      <div>
        <label>Created at:</label>
        <div>{moment(data.created).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
      <div>
        <label>Finished at:</label>
        <div>{moment(data.finished).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
      <div>
        <label>Target Project & topup PTC:</label>
        <div>
          <Tag>{data.args.db}</Tag>
          <Tag color="blue">{toPTC(data.args.amount)} PTC</Tag>
        </div>
      </div>
      <div>
        <label>result:</label>
        <div>
          <pre className="json">{JSON.stringify(data.result, null, 2)}</pre>
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
      case 'CreateProject':
        return <CreateProject data={data} />
      case 'TopUp':
        return <TopupProject data={data} />
      default:
        return <div>WIP</div>
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
