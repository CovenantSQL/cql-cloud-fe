import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import qs from 'query-string'
import { connect } from 'dva'
import { GlobalFooter } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { setLocale } from 'utils'
import config from 'utils/config'

import styles from './index.less'

@withI18n()
@connect(({ loading }) => ({ loading }))
class GithubCallback extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props
    const params = qs.parse(this.props.location.search)
    const { code, state } = params

    dispatch({ type: 'callback/token', payload: { code, state } })
  }

  render() {
    const { loading } = this.props

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
        <div className={styles.form}>Github login...</div>
        <div className={styles.footer}>
          <GlobalFooter links={footerLinks} copyright={config.copyright} />
        </div>
      </Fragment>
    )
  }
}

GithubCallback.propTypes = {
  loading: PropTypes.object,
}

export default GithubCallback
