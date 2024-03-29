import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Link from 'umi/link'
import _get from 'lodash/get'
import moment from 'moment'
import makeBlockie from 'ethereum-blockies-base64'
import PropTypes from 'prop-types'
import {
  Card,
  Button,
  Modal,
  Col,
  Tag,
  Avatar,
  Input,
  InputNumber,
  Icon,
} from 'antd'
import { addLangPrefix, toPTC, fromPTC } from 'utils'
import { Trans, withI18n } from '@lingui/react'
import UpdateAliasModal from './UpdateAliasModal'
import styles from './Projects.less'

@withI18n()
@connect(({ loading, dashboard, app }) => ({ loading, dashboard, app }))
class Projects extends PureComponent {
  state = {
    amount: 0.1,
    alias: '',
    updateAlias: false,
  }
  confirmAmount = db => {
    const { i18n } = this.props
    let local = this

    Modal.confirm({
      title: i18n.t`请输入充值的金额：`,
      content: (
        <div>
          <div>
            <Trans>
              可以根据项目数据库的运行状况进行充值，费用主要
              TPS，副本数，运行时间决定。
            </Trans>
          </div>
          <div>
            <Trans>充值：</Trans>
            <InputNumber
              min={0.1}
              step={0.1}
              max={10}
              defaultValue={0.1}
              onChange={v => {
                local.setState({ amount: v })
              }}
            />
          </div>
        </div>
      ),
      okText: i18n.t`好的`,
      onOk: () => {
        this.topup(db)
      },
    })
  }
  confirmEditAlias = (project, e) => {
    e.preventDefault()
    e.stopPropagation()

    this.setState({
      alias: project.alias,
      db: project.project,
      updateAlias: true,
    })
  }
  closeUpdateAliasModal = () => this.setState({ alias: '', updateAlias: false })
  topup = async db => {
    const { dispatch, i18n } = this.props
    const { amount } = this.state
    const { data, success } = await dispatch({
      type: 'dashboard/topupProjectDB',
      payload: { db, amount: fromPTC(amount) },
    })

    if (success) {
      Modal.success({
        title: i18n.t`充值已提交，请耐心等待`,
        content: (
          <div>
            <p>
              <div>
                <Trans>详情见 Task：</Trans>
                <Tag color="green">ID {data.task_id}</Tag>
              </div>
            </p>
          </div>
        ),
        okText: i18n.t`好的`,
      })
    }
  }
  _renderProjectCard = p => {
    const route = `/project/${p.project}/auth`
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
                <Trans>Balance:</Trans>{' '}
                {toPTC(_get(p, ['balance', 'advance_payment']))} PTC
              </Tag>
              <Button
                onClick={() => this.confirmAmount(p.project)}
                type="primary"
                size="small"
                shape="circle"
              >
                $
              </Button>
            </div>
          </div>
          <Link to={addLangPrefix(route)}>
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
              <Button
                onClick={e => this.confirmEditAlias(p, e)}
                className={styles.editBtn}
                size="small"
              >
                <Icon type="edit" theme="twoTone" />
              </Button>
            </div>
          </Link>
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
              <Col xl={6} lg={8} md={12} key={p.project}>
                {this._renderProjectCard(p)}
              </Col>
            ))}
        {this.state.updateAlias && (
          <UpdateAliasModal
            db={this.state.db}
            alias={this.state.alias}
            close={this.closeUpdateAliasModal}
          />
        )}
      </>
    )
  }
}

Projects.propTypes = {}
export default Projects
