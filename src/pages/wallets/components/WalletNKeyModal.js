import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Input, Tag, Button, Modal, Tooltip, Icon } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { WalletAvatar } from 'components'
import styles from './WalletNKeyModal.less'

@withI18n()
@connect(({ loading, wallets }) => ({ loading, wallets }))
class WalletNKeyModal extends PureComponent {
  render() {
    const { wallets, visible, close, isNewCreated } = this.props
    const { createdAccount } = wallets

    let { cqlAccount, cqlKey } = this.props
    if (isNewCreated) {
      cqlAccount = createdAccount.account
      cqlKey = createdAccount.key
    }

    return (
      <>
        <Modal
          visible={visible}
          title="你的 CovenantSQL 钱包"
          maskClosable={false}
          keyboard={false}
          closable={false}
          footer={[
            <Button key="submit" type="danger" onClick={close}>
              <Trans>私钥已存妥</Trans>
            </Button>,
          ]}
        >
          <p className={styles.instru}>
            {isNewCreated ? (
              <Trans>
                你的 CovenantSQL 钱包已成功生成，为方便使用，你的钱包会暂存在
                Covenant Cloud 上, 并绑定你的 Github 账户。你可以随时在 Covenant
                Cloud 下载并加密，或移除你的钱包。
              </Trans>
            ) : (
              <Trans>
                你的 CovenantSQL
                钱包私钥已成功生成，请妥善保管，如有设置加密密码，
                此生成私钥仅能通过密码解密后才可使用，故请牢记密码，此密码不可找回。
              </Trans>
            )}
          </p>
          <div className={styles.walletNkey}>
            <div>
              <label>
                <span style={{ marginRight: '5px' }}>
                  <Trans>钱包</Trans>
                </span>
                <Tooltip
                  title=<Trans>
                    钱包是你在 CovenantSQL
                    链上的唯一标识，所有链上交互都由钱包地址发起。
                  </Trans>
                >
                  <Icon type="question-circle" theme="twoTone" />
                </Tooltip>
              </label>
              <WalletAvatar seed={cqlAccount} cutoff={28} />
            </div>
            <div className={styles.key}>
              <label>
                <span style={{ marginRight: '5px' }}>
                  {isNewCreated ? <Trans>明文私钥</Trans> : <Trans>私钥</Trans>}
                </span>
                <Tooltip
                  title=<Trans>
                    私钥代表是你的 CovenantSQL
                    钱包所有权和控制权，如果丢失无法恢复，请谨慎保管
                  </Trans>
                >
                  <Icon type="question-circle" theme="twoTone" />
                </Tooltip>
              </label>
              <Tag color="volcano">{cqlKey}</Tag>
            </div>
          </div>
        </Modal>
      </>
    )
  }
}

WalletNKeyModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  isNewCreated: PropTypes.bool,
  cqlAccount: PropTypes.string,
  cqlKey: PropTypes.string,
}
WalletNKeyModal.defaultProps = {
  isNewCreated: false,
  cqlAccount: '',
  cqlKey: '',
}
export default WalletNKeyModal
