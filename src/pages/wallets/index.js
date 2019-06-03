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
  message,
} from 'antd'
import { GlobalFooter } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { router, setLocale } from 'utils'
import config from 'utils/config'

import { WalletAvatar } from 'components'
import CreateWalletModal from './components/CreateWalletModal'

import styles from './index.less'

@withI18n()
@connect(({ loading, wallets }) => ({ loading, wallets }))
class Wallets extends PureComponent {
  state = {
    createWalletVisible: false,
  }

  handleOk = () => {}

  createWallet = () => {
    const { dispatch } = this.props
    dispatch({ type: 'wallets/createCQLWallet' })

    this.setState({
      createWalletVisible: true,
    })
  }

  hideCreateWalletModal = () => {
    this.setState({
      createWalletVisible: false,
    })
  }

  setMainWallet = () => {
    const { dispatch } = this.props
    const success = dispatch({ type: 'wallets/setMainWallet' })
    if (success) {
      message.success(
        'Set main wallet success, redirecting you to control panel...'
      )
      // redirect to dashboard
      setTimeout(() => {
        // router.push('/dashboard')
      }, 2000)
    } else {
      message.error('Set main wallet error, please try again later')
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
    const radioStyle = {
      display: 'block',
      height: '50px',
      lineHeight: '30px',
    }

    return (
      <Radio.Group
        onChange={this.handleWalletSelect}
        value={selectedMainWallet}
      >
        {keypairs.map(k => (
          <Radio key={k.account} value={k.account} style={radioStyle}>
            <WalletAvatar seed={k.account} />
            <span className={styles.balance}>
              <Tag color="blue">{k.balance} PTC</Tag>
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
                <Trans>Create Wallet</Trans>
              </Button>
              <Button
                type="primary"
                onClick={this.handleOk}
                loading={loading.effects.login}
              >
                <Trans>Upload Wallet</Trans>
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
                    <Trans>🌟 Goto Control Panel</Trans>
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
          <CreateWalletModal
            visible={this.state.createWalletVisible}
            close={this.hideCreateWalletModal}
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
