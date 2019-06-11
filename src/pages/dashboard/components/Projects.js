import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import makeBlockie from 'ethereum-blockies-base64'
import PropTypes from 'prop-types'
import { Card, Modal, Col, Tag, Avatar } from 'antd'
import { Color } from 'utils'
import styles from './Projects.less'

@connect(({ loading, dashboard, app }) => ({ loading, dashboard, app }))
class Projects extends PureComponent {
  state = {}
  render() {
    const projects = this.props.app.projects

    return (
      <>
        {projects.length === 0
          ? null
          : projects.map(p => (
              <Col lg={6} md={6}>
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
                    <div className={styles.id}># {p.id}</div>
                    <div className={styles.avatar}>
                      {p.project && (
                        <Avatar
                          shape={'round'}
                          size={48}
                          src={makeBlockie(p.project)}
                        />
                      )}
                      <div className={styles.alias}>{p.alias}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
      </>
    )
  }
}

Projects.propTypes = {}
export default Projects
