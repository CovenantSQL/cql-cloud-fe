import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Icon, Switch } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { Color } from 'utils'
import { Page, ScrollBar } from 'components'
import ScanSVG from './components/covenantscan.svg'
import { User, GetPTC, CreateProject, TaskList, Projects } from './components'
import styles from './index.less'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

@connect(({ app, dashboard, loading }) => ({
  user: app.user,
  projects: app.projects,
  mainwallet: app.mainwallet,
  dashboard,
  loading,
}))
class Dashboard extends PureComponent {
  render() {
    const { user, dashboard, loading } = this.props
    const { tasks } = dashboard

    return (
      <Page className={styles.dashboard}>
        <Row gutter={24}>
          <Row className={styles.section} gutter={24}>
            <div className={styles.sectionTitle}>
              <Trans>Utilities</Trans>
            </div>
            <Col lg={6} md={6}>
              <GetPTC />
            </Col>
            <Col lg={6} md={6}>
              <Card
                bordered={false}
                className={styles.scanner}
                bodyStyle={{
                  padding: 10,
                  height: 160,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'white',
                }}
              >
                <a
                  className={styles.content}
                  href="http://scan.covenantsql.io"
                  target="_blank"
                >
                  <img src={ScanSVG} alt="covenant-scan" />
                  <div className={styles.sub}>
                    <span>测试网浏览器</span>
                    <Icon type="link" />
                  </div>
                </a>
              </Card>
            </Col>
          </Row>

          <Row className={styles.section} gutter={24}>
            <div className={styles.sectionTitle}>
              <Trans>Projects</Trans>
            </div>
            <Col xl={6} lg={8} md={12}>
              <CreateProject />
            </Col>
            {this.props.projects.length > 0 && <Projects />}
          </Row>

          <Row className={styles.section} gutter={24}>
            <div className={styles.sectionTitle}>
              <Trans>Tasks</Trans>
            </div>

            <Col lg={16} md={16} sm={24}>
              <Card
                title="All Tasks"
                bordered={false}
                bodyStyle={{
                  paddingTop: '1px',
                }}
              >
                <TaskList data={tasks} />
              </Card>
            </Col>

            <Col lg={8} md={24}>
              <Card
                bordered={false}
                bodyStyle={{ ...bodyStyle.bodyStyle, padding: 0 }}
              >
                <User
                  {...user}
                  projectNum={this.props.projects.length}
                  ptc={this.props.mainwallet.balance}
                />
              </Card>
            </Col>
          </Row>
        </Row>
      </Page>
    )
  }
}

Dashboard.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default Dashboard
