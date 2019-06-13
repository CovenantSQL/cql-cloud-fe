import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'

@connect(({ projectDetail }) => ({ projectDetail }))
class ProjectDetail extends PureComponent {
  render() {
    const { projectDetail } = this.props
    const { config, rules } = projectDetail

    return (
      <Page inner>
        <div className={styles.content}>
          <pre>{JSON.stringify(config, null, 2)}</pre>
          <pre>{JSON.stringify(rules, null, 2)}</pre>
        </div>
      </Page>
    )
  }
}

ProjectDetail.propTypes = {
  projectDetail: PropTypes.object,
}

export default ProjectDetail
