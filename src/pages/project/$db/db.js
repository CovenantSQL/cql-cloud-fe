import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import _zipObject from 'lodash/zipObject'
import { Empty, Table, Tag } from 'antd'
import { Trans, withI18n } from '@lingui/react'

import { Page } from 'components'
import styles from './db.less'

const { Column } = Table

@withI18n()
@connect(({ projectDetail }) => ({ projectDetail }))
class ProjectDetail extends PureComponent {
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
      return [_zipObject(columns, types)]
    } else {
      return []
    }
  }

  render() {
    const { projectDetail } = this.props
    const { table_names, tables } = projectDetail

    return (
      <Page inner>
        <div className={styles.tables}>
          {table_names.length !== 0 ? (
            table_names.map(name => (
              <div key={name}>
                <div className={styles.tableName}>
                  {name} (
                  {moment(tables[name].created).format('YYYY-MM-DD HH:mm:ss')})
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
        <div className={styles.create} />
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
