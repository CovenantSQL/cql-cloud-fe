import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
// import styles from './index.less'

@connect(({ projectDetail }) => ({ projectDetail }))
class Auth extends PureComponent {
  render() {
    const { projectDetail } = this.props
    const { config } = projectDetail

    return (
      <Page inner>
        <div>
          🚧 WIP 🚧
          <div className="debug">
            <pre>{JSON.stringify(config, null, 2)}</pre>
          </div>
        </div>
      </Page>
    )
  }
}

Auth.propTypes = {}

export default Auth
