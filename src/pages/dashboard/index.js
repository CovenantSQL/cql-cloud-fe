import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Icon, Switch } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { Color } from 'utils'
import { Page, ScrollBar } from 'components'
import ScanSVG from './components/covenantscan.svg'
import {
  // NumberCard,
  Quote,
  // Sales,
  Weather,
  RecentSales,
  Comments,
  Completed,
  Browser,
  Cpu,
  User,
} from './components_bck'
import { GetPTC, TaskList } from './components'
import styles from './index.less'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

@connect(({ app, dashboard, loading }) => ({
  avatar: app.user.avatar,
  username: app.user.username,
  dashboard,
  loading,
}))
class Dashboard extends PureComponent {
  state = {
    show: false,
  }
  render() {
    const { avatar, username, dashboard, loading } = this.props
    const {
      tasks,
      weather,
      sales,
      quote,
      numbers,
      recentSales,
      comments,
      completed,
      browser,
      cpu,
      user,
    } = dashboard

    const numberCards = numbers.map((item, key) => (
      <Col key={key} lg={6} md={12} />
    ))

    return (
      <Page className={styles.dashboard}>
        <Row gutter={24}>
          <Row className={styles.section} gutter={24}>
            <div className={styles.sectionTitle}>
              <Trans>Utilities</Trans>
            </div>
            <Col lg={6} md={6}>
              <GetPTC
                {...weather}
                loading={loading.effects['dashboard/queryWeather']}
              />
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
            <Col lg={6} md={6}>
              <Card
                bordered={false}
                bodyStyle={{
                  padding: 10,
                  height: 160,
                  color: '#fefefe',
                  fontSize: '24px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: Color.blue,
                }}
              >
                <span style={{ marginRight: '6px' }}>
                  <Icon type="plus-circle" theme="filled" />
                </span>
                <span style={{ fontWeight: '600' }}>
                  <Trans>Create Project</Trans>
                </span>
              </Card>
            </Col>
          </Row>

          <Row className={styles.section} gutter={24}>
            <div className={styles.sectionTitle}>
              <Trans>Tasks</Trans>
            </div>
            <Col lg={14} md={16} sm={24}>
              <Card
                title="All Tasks"
                bordered={false}
                bodyStyle={{
                  paddingTop: '0',
                }}
              >
                <TaskList data={tasks} />
              </Card>
            </Col>
          </Row>

          <div style={{ float: 'right' }}>
            <Switch
              size="small"
              onChange={checked => {
                this.setState({ show: checked })
              }}
            />
          </div>

          <div style={{ display: this.state.show ? 'inherit' : 'none' }}>
            <Col lg={6} md={24}>
              <Row gutter={24}>
                <Col lg={24} md={12}>
                  <Card
                    bordered={false}
                    className={styles.quote}
                    bodyStyle={{
                      padding: 0,
                      height: 204,
                      background: Color.peach,
                    }}
                  >
                    <ScrollBar>
                      <Quote {...quote} />
                    </ScrollBar>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col lg={12} md={24}>
              <Card bordered={false} {...bodyStyle}>
                <RecentSales data={recentSales} />
              </Card>
            </Col>
            <Col lg={12} md={24}>
              <Card bordered={false} {...bodyStyle}>
                <ScrollBar>
                  <Comments data={comments} />
                </ScrollBar>
              </Card>
            </Col>
            <Col lg={24} md={24}>
              <Card
                bordered={false}
                bodyStyle={{
                  padding: '24px 36px 24px 0',
                }}
              >
                <Completed data={completed} />
              </Card>
            </Col>
            <Col lg={8} md={24}>
              <Card bordered={false} {...bodyStyle}>
                <Browser data={browser} />
              </Card>
            </Col>
            <Col lg={8} md={24}>
              <Card bordered={false} {...bodyStyle}>
                <ScrollBar>
                  <Cpu {...cpu} />
                </ScrollBar>
              </Card>
            </Col>
            <Col lg={8} md={24}>
              <Card
                bordered={false}
                bodyStyle={{ ...bodyStyle.bodyStyle, padding: 0 }}
              >
                <User {...user} avatar={avatar} username={username} />
              </Card>
            </Col>
          </div>
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
