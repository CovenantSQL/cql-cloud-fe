import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Divider, Row, Form, Icon, Input, Radio, Empty } from 'antd'
import { GlobalFooter } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { setLocale } from 'utils'
import config from 'utils/config'

import styles from './index.less'

@withI18n()
@connect(({ loading, wallets }) => ({ loading, wallets }))
class Wallets extends PureComponent {
  state = {
    createWalletVisible: false,
    selectedWallet: '',
  }

  handleOk = () => {}

  createWallet = () => {
    const { dispatch } = this.props
    dispatch({ type: 'wallets/createCQLWallet' })

    this.setState({
      createWalletVisible: true,
    })
  }

  handleWalletSelect = e => {
    this.setState({
      selectedWallet: e.target.value,
    })
  }

  _renderWalletsRadioGroup = () => {
    const keypairs = this.props.wallets.keypairs
    const radioStyle = {
      display: 'block',
      height: '50px',
      lineHeight: '30px',
    }

    return (
      <Radio.Group
        onChange={this.handleWalletSelect}
        value={this.state.selectedWallet}
      >
        {keypairs.map(k => (
          <Radio key={k.account} value={k.account} style={radioStyle}>
            {k.account}
            <br />
            {k.balance}
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
                    onClick={this.handleOk}
                    loading={loading.effects.login}
                  >
                    <Trans>🌟Set as Mainwallet</Trans>
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
