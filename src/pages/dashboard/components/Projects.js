import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import makeBlockie from 'ethereum-blockies-base64'
import PropTypes from 'prop-types'
import { Card, Button, Modal, Col, Tag, Avatar } from 'antd'
import { toPTC } from 'utils'
import { Trans, withI18n } from '@lingui/react'
import styles from './Projects.less'

@connect(({ loading, dashboard, app }) => ({ loading, dashboard, app }))
class Projects extends PureComponent {
  state = {}
  componentDidMount() {
    const { dispatch } = this.props
    const projects = this.props.app.projects

    projects.forEach(p => {
      let db = p.project
      dispatch({
        type: 'dashboard/getProjectInfo',
        payload: { db },
      })
    })
  }
  _renderProjectCard = p => {
    return (
      <Card
        bordered={false}
        className={styles.card}
        bodyStyle={{
          padding: 10,
          height: 160,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className={styles.project}>
          <div className={styles.top}>
            <div className={styles.id}># {p.id}</div>
            <div className={styles.info}>
              <Tag color="blue">
                <Trans>Balance:</Trans> {toPTC(p.balance.deposit)} PTC
              </Tag>
              <Button type="primary" size="small" shape="circle">
                $
              </Button>
            </div>
          </div>
          <div className={styles.name}>
            {p.project && (
              <Avatar
                className={styles.avatar}
                shape={'round'}
                size={48}
                src={makeBlockie(p.project)}
              />
            )}
            <div className={styles.alias}>{p.alias}</div>
          </div>
        </div>
      </Card>
    )
  }
  render() {
    const projects = this.props.app.projects

    return (
      <>
        {projects.length === 0
          ? null
          : projects.map(p => (
              <Col lg={6} md={6}>
                {this._renderProjectCard(p)}
              </Col>
            ))}
      </>
    )
  }
}

Projects.propTypes = {}
export default Projects
