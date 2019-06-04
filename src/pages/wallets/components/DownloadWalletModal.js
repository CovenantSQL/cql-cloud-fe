import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Input, Tag, Button, Modal, Switch } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { WalletAvatar } from 'components'
import WalletNKeyModal from './WalletNKeyModal'

import styles from './DownloadWalletModal.less'

@withI18n()
@connect(({ loading, wallets }) => ({ loading, wallets }))
class DownloadWalletModal extends PureComponent {
  state = {
    checked: true,
    loading: false,
    password: '',
    key: '',
    walletModalVisible: false,
  }
  onSwitchChanged = checked => {
    this.setState({ checked })
    if (!checked) {
      this.setState({ password: '' })
    }
  }
  onInput = e => {
    this.setState({
      password: e.target.value,
    })
  }
  onDownloadWalletClick = async () => {
    this.setState({ loading: true })
    const { dispatch, account } = this.props
    const { key, success } = await dispatch({
      type: 'wallets/downloadCQLWallet',
      payload: {
        account,
        password: this.state.password,
      },
    })

    this.setState({ loading: false })
    if (success) {
      //show WalletNKeyModal
      this.setState({
        key,
        walletModalVisible: true,
      })
    }
  }
  closeAllModal = () => {
    const { close } = this.props
    this.setState({ walletModalVisible: false })
    close()
  }
  render() {
    const { wallets, account, visible, close } = this.props

    return (
      <>
        <Modal
          visible={visible}
          title="下载 CovenantSQL 钱包"
          cancelText="取消"
          onCancel={close}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={this.state.loading}
              onClick={this.onDownloadWalletClick}
            >
              下载
            </Button>,
          ]}
        >
          <p className={styles.instru}>
            <Trans>
              此钱包暂存在 Covenant Cloud
              上，你可以设置私钥加密密码来对钱包进行加密，
              或者直接下载明文私钥钱包。
            </Trans>
          </p>
          <div className={styles.main}>
            <div>
              <label>
                <Trans>钱包</Trans>
              </label>
              <WalletAvatar seed={account} cutoff={28} />
            </div>
            <div className={styles.key}>
              <label>
                <span style={{ paddingRight: '5px' }}>
                  <Trans>加密钱包</Trans>
                </span>
                <Switch
                  onChange={this.onSwitchChanged}
                  size="small"
                  defaultChecked
                />
              </label>
              <Input.Password
                placeholder="私钥加密密码"
                value={this.state.password}
                onInput={this.onInput}
                disabled={!this.state.checked}
              />
            </div>
          </div>
          <WalletNKeyModal
            visible={this.state.walletModalVisible}
            cqlAccount={account}
            cqlKey={this.state.key}
            close={this.closeAllModal}
          />
        </Modal>
      </>
    )
  }
}

DownloadWalletModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  account: PropTypes.string,
}
export default DownloadWalletModal
