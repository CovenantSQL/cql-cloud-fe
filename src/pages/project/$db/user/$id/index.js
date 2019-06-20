import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'

@connect(({ userDetail }) => ({ userDetail }))
class UserDetail extends PureComponent {
  render() {
    const { userDetail } = this.props
    const { data } = userDetail
    const content = []
    for (let key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{String(data[key])}</div>
          </div>
        )
      }
    }
    return (
      <Page inner>
        <section className={styles.section}>
          <div className={styles.title}>Raw Info:</div>
          <div className={styles.content}>{content}</div>
        </section>
      </Page>
    )
  }
}

UserDetail.propTypes = {
  userDetail: PropTypes.object,
}

export default UserDetail
