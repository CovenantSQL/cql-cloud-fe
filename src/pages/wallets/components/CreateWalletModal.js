import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Input, Tag, Button, Modal } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './CreateWalletModal.less'

// const { confirm } = Modal

@withI18n()
@connect(({ loading, wallets }) => ({ loading, wallets }))
class CreateWalletModal extends PureComponent {
  render() {
    const { i18n } = this.props

    return (
      <>
        <Modal
          title="生成 CovenantSQL 钱包"
          okText="私钥已存妥"
          okType="danger"
          cancelText="取消"
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <p className={styles.label}>
            <Trans>私钥加密密码:</Trans>
          </p>
          <div className={styles.action}>
            <Input.Password
              placeholder="input password"
              value={this.state.password}
              onInput={this.inputPassword}
            />
            <Button
              className={styles.createBtn}
              loading={this.state.loading}
              onClick={this.createWallet}
              type="primary"
            >
              <Trans>创建</Trans>
            </Button>
          </div>
          {this.state.account && (
            <div className={styles.walletNkey}>
              <div>
                Wallet: <Tag color="green">{this.state.account}</Tag>
              </div>
              <div>
                Private Key: <Tag color="volcano">{this.state.key}</Tag>
              </div>
            </div>
          )}
        </Modal>
      </>
    )
  }
}

CreateWalletModal.propTypes = {}

export default CreateWalletModal
