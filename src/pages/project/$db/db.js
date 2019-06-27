import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import _get from 'lodash/get'
import _zipObject from 'lodash/zipObject'
import { Modal, Empty, Table, Tag, Icon, message } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { Page, DropOption } from 'components'
import { AddTable, AddFieldModal, ModifyRulesModal } from './components'
import styles from './db.less'

const initState = () =>
  Object.assign(
    {},
    {
      targetTable: '',
      modifyRulesModalVisible: false,
      addFieldModalVisible: false,
    }
  )

@withI18n()
@connect(({ projectDetail }) => ({ projectDetail }))
class DatabaseDetail extends PureComponent {
  state = initState()

  createTable = async ({ table, names, types }) => {
    const { dispatch } = this.props
    const { data, success } = await dispatch({
      type: 'projectDetail/createTable',
      payload: {
        table,
        names,
        types,
      },
    })

    this.getLatestTables()

    return { data, success }
  }

  getLatestTables = () => {
    const { dispatch } = this.props
    dispatch({ type: 'projectDetail/getProjectTables' })
  }

  handleMenuClick = (tableName, e) => {
    if (e.key === '0') {
      this.setState({
        targetTable: tableName,
        modifyRulesModalVisible: true,
      })
    } else if (e.key === '1') {
      this.setState({
        targetTable: tableName,
        addFieldModalVisible: true,
      })
    } else if (e.key === '2') {
      this.confirmDropTable(tableName)
    }
  }

  confirmDropTable = async table => {
    const { dispatch } = this.props

    Modal.confirm({
      title: (
        <div>
          Are you sure to drop table: <Tag>{table}</Tag>
        </div>
      ),
      content: (
        <Trans>
          DROP TABLE cannot be undone, please make sure your decision.
        </Trans>
      ),
      okText: <Trans>Confirm Drop Table</Trans>,
      okType: 'danger',
      cancelText: <Trans>Cancel</Trans>,
      onOk: async () => {
        const success = await dispatch({
          type: 'projectDetail/dropTable',
          payload: { table },
        })
        if (success) {
          this.getLatestTables()
          message.success(`Successfully dropped table: ${table}`)
        }
      },
      onCancel() {
        console.log('Cancel drop')
      },
    })
  }

  getTableColumns = name => {
    const { tables } = this.props.projectDetail
    let tableDetail = tables[name]

    if (tableDetail) {
      let cols = tableDetail.columns.map(c => ({
        title: c,
        dataIndex: c,
        key: c,
      }))

      cols.push({
        title: <Trans>Operation</Trans>,
        key: 'operation',
        render: (text, record, idx) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(name, e, record)}
              menuOptions={[
                {
                  key: '0',
                  name: (
                    <span>
                      <Icon type="security-scan" theme="twoTone" /> Set Table
                      Rules
                    </span>
                  ),
                },
                {
                  key: '1',
                  name: (
                    <span>
                      <Icon type="file-add" theme="twoTone" /> Add Field
                    </span>
                  ),
                },
                {
                  key: '2',
                  name: (
                    <span>
                      <Icon type="delete" theme="twoTone" /> Drop Table
                    </span>
                  ),
                },
              ]}
            />
          )
        },
      })

      return cols
    } else {
      return []
    }
  }

  getTableData = name => {
    const { tables } = this.props.projectDetail
    let tableDetail = tables[name]

    if (tableDetail) {
      let { columns, types } = tableDetail
      let row = [_zipObject(columns, types)]
      row['key'] = name
      return row
    } else {
      return []
    }
  }

  closeModal = () => this.setState(initState())

  render() {
    const { projectDetail } = this.props
    const { table_names, tables } = projectDetail

    const number_of_tables =
      (Object.keys(tables) && Object.keys(tables).length) || 0

    return (
      <Page inner>
        <div className={styles.tables}>
          <div className={styles.title}>
            <Trans>Table Details:</Trans>
          </div>
          {number_of_tables !== 0 ? (
            table_names.map(name => (
              <div key={name} className={styles.table}>
                <div className={styles.tableName}>
                  <Tag color="green">{name}</Tag>
                  <Tag>
                    Created:{' '}
                    {moment(_get(tables, [name, 'created'])).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                  </Tag>
                </div>
                <div>
                  <Table
                    dataSource={this.getTableData(name)}
                    columns={this.getTableColumns(name)}
                    pagination={false}
                    bordered
                  />
                </div>
              </div>
            ))
          ) : (
            <Empty
              description={
                <span>
                  <Trans>No Tables</Trans>
                </span>
              }
            />
          )}
        </div>
        {this.state.addFieldModalVisible && (
          <AddFieldModal
            table={this.state.targetTable}
            visible={this.state.addFieldModalVisible}
            query={this.getLatestTables}
            close={this.closeModal}
          />
        )}
        {this.state.modifyRulesModalVisible && (
          <ModifyRulesModal
            table={this.state.targetTable}
            visible={this.state.modifyRulesModalVisible}
            query={this.getLatestTables}
            close={this.closeModal}
          />
        )}
        <div className={styles.create}>
          <div className={styles.title}>
            <Trans>Create Table:</Trans>
          </div>
          <AddTable createTable={this.createTable} />
        </div>
        <div className="debug">
          <pre>{JSON.stringify(tables, null, 2)}</pre>
        </div>
      </Page>
    )
  }
}

DatabaseDetail.propTypes = {
  projectDetail: PropTypes.object,
}

export default DatabaseDetail
