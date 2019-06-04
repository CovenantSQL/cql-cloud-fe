import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Button,
  Tag,
  Divider,
  Row,
  Form,
  Icon,
  Input,
  Radio,
  Empty,
  Modal,
  message,
} from 'antd'
import { red, blue } from '@ant-design/colors'
import { GlobalFooter } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { router, setLocale, toPTC } from 'utils'
import config from 'utils/config'

import { WalletAvatar } from 'components'
import WalletNKeyModal from './components/WalletNKeyModal'
import DownloadWalletModal from './components/DownloadWalletModal'
import UploadWalletModal from './components/UploadWalletModal'

import styles from './index.less'

@withI18n()
@connect(({ loading, wallets }) => ({ loading, wallets }))
class Wallets extends PureComponent {
  state = {
    createWalletVisible: false,
    upWalletVisible: false,
    downloadWalletVisible: false,
    targetWalletToDownload: '',
  }

  handleOk = () => {}

  createWallet = () => {
    const { dispatch } = this.props
    dispatch({ type: 'wallets/createCQLWallet' })

    this.setState({
      createWalletVisible: true,
    })
  }

  deleteWallet = (account, e) => {
    e.preventDefault()
    const { dispatch } = this.props

    Modal.confirm({
      title: <Trans>确定要在 Covenant Cloud 上移除此钱包么？</Trans>,
      content: `${account}`,
      okText: <Trans>确认移除</Trans>,
      okType: 'danger',
      cancelText: <Trans>取消</Trans>,
      async onOk() {
        const success = await dispatch({
          type: 'wallets/deleteCQLWallet',
          payload: { account },
        })
        if (success) {
          message.success(`Delete wallet ${account.slice(0, 16)}.. success`)
        }
      },
      onCancel() {
        console.log('Cancel delete')
      },
    })
  }

  onUploadWalletClick = () => {
    this.setState({
      upWalletVisible: true,
    })
  }

  downloadWalletHandler = (account, e) => {
    e.preventDefault()
    this.setState({
      downloadWalletVisible: true,
      targetWalletToDownload: account,
    })
  }

  hideModal = key => {
    this.setState({
      [key]: false,
    })
  }

  setMainWallet = async () => {
    const { dispatch, i18n } = this.props
    const success = await dispatch({ type: 'wallets/setMainWallet' })
    if (success) {
      message.success(i18n.t`钱包设置成功，正在转向至管理页面...`)
      // redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      message.error(i18n.t`钱包设置失败，请重试`)
    }
  }

  handleWalletSelect = e => {
    const { dispatch } = this.props
    dispatch({
      type: 'wallets/udpateSelectedMainWallet',
      payload: e.target.value,
    })
  }

  _renderWalletsRadioGroup = () => {
    const { selectedMainWallet, keypairs } = this.props.wallets
    return (
      <Radio.Group
        onChange={this.handleWalletSelect}
        value={selectedMainWallet}
      >
        {keypairs.map(k => (
          <Radio
            key={k.account}
            value={k.account}
            style={{
              display: 'block',
              height: '50px',
              lineHeight: '30px',
            }}
          >
            <WalletAvatar seed={k.account} />
            <span className={styles.balance}>
              <Tag color="blue">{toPTC(k.balance)} PTC</Tag>
            </span>
            <span>
              <Tag
                color={blue.primary}
                onClick={e => this.downloadWalletHandler(k.account, e)}
                style={{ fontSize: '10px', cursor: 'pointer' }}
              >
                <Icon type="download" />
                <Trans>下载</Trans>
              </Tag>
              <Tag
                color={red.primary}
                onClick={e => this.deleteWallet(k.account, e)}
                style={{ fontSize: '10px', cursor: 'pointer' }}
              >
                <Icon type="delete" />
                <Trans>移除</Trans>
              </Tag>
            </span>
          </Radio>
        ))}
      </Radio.Group>
    )
  }

  render() {
    const { loading, wallets } = this.props

    let footerLinks = [
      {
        key: 'github',
        title: <Icon type="github" />,
        href: 'https://github.com/covenantsql/covenantsql',
        blankTarget: true,
      },
    ]

    if (config.i18n) {
      footerLinks = footerLinks.concat(
        config.i18n.languages.map(item => ({
          key: item.key,
          title: (
            <span onClick={setLocale.bind(null, item.key)}>{item.title}</span>
          ),
        }))
      )
    }

    return (
      <Fragment>
        <div className={styles.form}>
          <div className={styles.logo}>
            <img alt="logo" src={config.logoPath} />
            <span>Wallets Setup</span>
          </div>
          <form>
            <Row className={styles.actions}>
              <Button
                type="primary"
                onClick={this.createWallet}
                loading={loading.effects.login}
              >
                <Trans>生成钱包</Trans>
              </Button>
              <Button
                type="primary"
                onClick={this.onUploadWalletClick}
                loading={loading.effects.login}
              >
                <Trans>上传钱包</Trans>
              </Button>
            </Row>
            <Divider>
              <Trans>Cloud Wallets</Trans>
            </Divider>
            {wallets.keypairs ? (
              <Row>
                <div className={styles.wallets}>
                  {this._renderWalletsRadioGroup()}
                </div>
                <div className={styles.setMainBtnWrapper}>
                  <Button
                    type="primary"
                    onClick={this.setMainWallet}
                    loading={loading.effects.login}
                  >
                    <Trans>使用此钱包 🌟</Trans>
                  </Button>
                </div>
              </Row>
            ) : (
              <Empty
                description={
                  <span>
                    <Trans>No Wallet</Trans>
                  </span>
                }
              />
            )}
          </form>
          <DownloadWalletModal
            visible={this.state.downloadWalletVisible}
            account={this.state.targetWalletToDownload}
            close={() => this.hideModal('downloadWalletVisible')}
          />
          <UploadWalletModal
            visible={this.state.upWalletVisible}
            close={() => this.hideModal('upWalletVisible')}
          />
          <WalletNKeyModal
            visible={this.state.createWalletVisible}
            close={() => this.hideModal('createWalletVisible')}
            isNewCreated
          />
        </div>
        <div className={styles.footer}>
          <GlobalFooter links={footerLinks} copyright={config.copyright} />
        </div>
      </Fragment>
    )
  }
}

Wallets.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Wallets
