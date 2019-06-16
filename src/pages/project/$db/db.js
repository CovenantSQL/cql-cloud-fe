import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import _get from 'lodash/get'
import _zipObject from 'lodash/zipObject'
import { Empty, Table, Tag } from 'antd'
import { Trans, withI18n } from '@lingui/react'

import { Page } from 'components'
import { AddTable } from './components'
import styles from './db.less'

const { Column } = Table

@withI18n()
@connect(({ projectDetail }) => ({ projectDetail }))
class ProjectDetail extends PureComponent {
  createTable = async ({ table, names, types }) => {
    const { dispatch, projectDetail } = this.props
    const { data, success } = await dispatch({
      type: 'projectDetail/createTable',
      payload: {
        table,
        names,
        types,
      },
    })

    return { data, success }
  }
  getColumns = name => {
    const { tables } = this.props.projectDetail
    let tableDetail = tables[name]

    if (tableDetail) {
      return tableDetail.columns.map(c => ({
        title: c,
        dataIndex: c,
        key: c,
      }))
    } else {
      return []
    }
  }
  getDataSource = name => {
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

  render() {
    const { projectDetail } = this.props
    const { table_names, tables } = projectDetail
    console.log('/////////////', table_names)

    return (
      <Page inner>
        <div className={styles.tables}>
          {Object.keys(tables).length !== 0 ? (
            table_names.map(name => (
              <div key={name}>
                <div className={styles.tableName}>
                  {name} (
                  {moment(_get(tables, [name, 'created'])).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                  )
                </div>
                <div>
                  <Table
                    dataSource={this.getDataSource(name)}
                    columns={this.getColumns(name)}
                    pagination={false}
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
        <div className={styles.create}>
          <AddTable createTable={this.createTable} />
        </div>
        <div className={styles.content}>
          <pre>{JSON.stringify(tables, null, 2)}</pre>
        </div>
      </Page>
    )
  }
}

ProjectDetail.propTypes = {
  projectDetail: PropTypes.object,
}

export default ProjectDetail
