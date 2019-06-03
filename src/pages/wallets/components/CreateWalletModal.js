import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Input, Tag, Button, Modal } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { WalletAvatar } from 'components'
import styles from './CreateWalletModal.less'

// const { confirm } = Modal

@withI18n()
@connect(({ loading, wallets }) => ({ loading, wallets }))
class CreateWalletModal extends PureComponent {
  render() {
    const { wallets, visible, close } = this.props
    const { createdAccount } = wallets

    return (
      <>
        <Modal
          visible={visible}
          title="生成 CovenantSQL 钱包"
          okText="私钥已存妥"
          okType="danger"
          cancelText="取消"
          onOk={close}
          onCancel={close}
        >
          <p className={styles.instru}>
            <Trans>
              你的 CovenantSQL 钱包已成功生成，为方便使用，你的钱包会暂存在
              Covenant Cloud 上, 并绑定你的 Github 账户。你可以随时在 Covenant
              Cloud 下载并加密，或移除你的钱包。
            </Trans>
          </p>
          <div className={styles.walletNkey}>
            <div>
              <label>Wallet:</label>
              <WalletAvatar seed={createdAccount.account} cutoff={28} />
            </div>
            <div className={styles.key}>
              <label>Private Key:</label>
              <Tag color="volcano">{createdAccount.key}</Tag>
            </div>
          </div>
        </Modal>
      </>
    )
  }
}

CreateWalletModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
}
export default CreateWalletModal
