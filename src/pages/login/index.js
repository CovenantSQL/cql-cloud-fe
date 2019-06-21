import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Icon, Input } from 'antd'
import { GlobalFooter } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { setLocale } from 'utils'
import config from 'utils/config'

import styles from './index.less'

@withI18n()
@connect(({ loading }) => ({ loading }))
class Login extends PureComponent {
  handleGithubLogin = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'login/loginGithub',
      payload: { client_id: config.loginClientID },
    })
  }

  render() {
    const { loading, i18n } = this.props

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
            <span>{config.siteName}</span>
          </div>
          <form>
            <Row>
              <Button
                type="primary"
                onClick={this.handleGithubLogin}
                loading={loading.effects.login}
                className={styles.githubBtn}
              >
                <span className={styles.icon}>
                  <Icon type="github" />
                </span>
                <Trans>Sign in with Github</Trans>
              </Button>
            </Row>
          </form>
        </div>
        <div className={styles.footer}>
          <GlobalFooter links={footerLinks} copyright={config.copyright} />
        </div>
      </Fragment>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Login
