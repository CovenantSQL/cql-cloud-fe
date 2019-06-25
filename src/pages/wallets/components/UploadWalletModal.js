import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Input, Tag, Button, Modal, Switch, Form } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { WalletAvatar } from 'components'

import styles from './UploadWalletModal.less'

@withI18n()
@connect(({ loading, wallets }) => ({ loading, wallets }))
@Form.create()
class UploadWalletModal extends PureComponent {
  state = {
    checked: true,
    loading: false,
    password: '',
    cqlKey: '',
    account: '',
  }
  onSwitchChanged = checked => {
    this.setState({ checked })
    if (!checked) {
      this.setState({ password: '' })
    }
  }
  handleCQLKeyInput = e => {
    this.setState({
      cqlKey: e.target.value,
    })
  }
  handlePasswordInput = e => {
    this.setState({
      password: e.target.value,
    })
  }
  onUploadWalletClick = () => {
    const { dispatch, account, form } = this.props
    const { validateFieldsAndScroll } = form

    validateFieldsAndScroll(async (errors, values) => {
      if (errors) {
        return
      }

      this.setState({ loading: true })
      const { dispatch } = this.props
      const { account, success } = await dispatch({
        type: 'wallets/uploadCQLWallet',
        payload: {
          key: this.state.cqlKey,
          password: this.state.password,
        },
      })

      this.setState({ loading: false })
      if (success) {
        //show WalletNKeyModal
        this.setState({ account })
        this._renderSuccess()
      } else {
        this._renderError()
      }
    })
  }
  _renderSuccess = () => {
    const { close, i18n } = this.props
    const { account } = this.state
    Modal.success({
      title: i18n.t`上传成功!`,
      content: (
        <div>
          <p>
            <Trans>你现在即可用下面的钱包来使用 CQL Cloud 服务</Trans>
          </p>
          <WalletAvatar seed={account} cutoff={20} />
        </div>
      ),
      okText: i18n.t`好的`,
      onOk: close,
    })
  }
  _renderError = () => {
    const { i18n } = this.props
    Modal.error({
      title: i18n.t`上传失败`,
      content: (
        <div>
          <p>
            <Trans>
              请确认你上传的私钥格式正确，如私钥有加密，请确认输入的加密密码正确
            </Trans>
          </p>
        </div>
      ),
      okType: 'danger',
      okText: i18n.t`好的`,
    })
  }
  render() {
    const { wallets, form, i18n, account, visible, close } = this.props
    const { getFieldDecorator } = form

    return (
      <>
        <Modal
          visible={visible}
          title="上传 CovenantSQL 钱包"
          cancelText="取消"
          onCancel={close}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={this.state.loading}
              onClick={this.onUploadWalletClick}
            >
              上传
            </Button>,
          ]}
        >
          <p className={styles.instru}>
            <Trans>
              上传钱包至 Covenant
              Cloud，方便你的使用。你也可以随时移除暂存的钱包。
            </Trans>
          </p>
          <div className={styles.main}>
            <div>
              <label>
                <Trans>钱包私钥</Trans>
              </label>
              <Form.Item hasFeedback>
                {getFieldDecorator(i18n.t`cqlKey`, {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Input.TextArea
                    autoComplete="off"
                    onInput={this.handleCQLKeyInput}
                    placeholder={i18n.t`cqlKey`}
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </Form.Item>
            </div>
            <div className={styles.key}>
              <label>
                <span style={{ paddingRight: '5px' }}>
                  <Trans>是否有加密</Trans>
                </span>
                <Switch
                  onChange={this.onSwitchChanged}
                  size="small"
                  defaultChecked
                />
              </label>
              <Input.Password
                placeholder="私钥加密密码"
                autoComplete="off"
                value={this.state.password}
                onInput={this.handlePasswordInput}
                disabled={!this.state.checked}
              />
            </div>
          </div>
        </Modal>
      </>
    )
  }
}

UploadWalletModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
}
export default UploadWalletModal
