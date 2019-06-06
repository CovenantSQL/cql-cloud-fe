import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { Color } from 'utils'
import styles from './taskList.less'

const states = {
  Waiting: {
    color: Color.blue,
    text: 'Waiting',
  },
  Running: {
    color: Color.yellow,
    text: 'Running',
  },
  Failed: {
    color: Color.red,
    text: 'Failed',
  },
  Success: {
    color: Color.green,
    text: 'Success',
  },
}

function TaskList({ data }) {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      render: text => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'STATUS',
      dataIndex: 'state',
      render: text => <Tag color={states[text].color}>{states[text].text}</Tag>,
    },
    {
      title: 'CREATED',
      dataIndex: 'created',
      render: text => moment(text).format('MM-DD HH:mm:ss'),
    },
    {
      title: 'FINISHED',
      dataIndex: 'finished',
      render: text =>
        moment(text)
          .startOf('second')
          .fromNow(),
    },
  ]
  return (
    <div className={styles.main}>
      <Table
        pagination={true}
        columns={columns}
        rowKey={(record, key) => key}
        dataSource={data}
      />
    </div>
  )
}

TaskList.propTypes = {
  data: PropTypes.array,
}

export default TaskList
