import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Table, Tag, Button } from 'antd'
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

@connect(({ loading, dashboard }) => ({ loading, dashboard }))
class TaskList extends PureComponent {
  state = {
    showDetailModal: false,
    taskData: {},
  }
  detailClickHandler = async id => {
    const { dispatch } = this.props
    const { data, success } = await dispatch({
      type: 'dashboard/getTaskInfo',
      payload: { id },
    })

    if (success) {
      this.setState({
        showDetailModal: true,
        taskData: data.task,
      })

      alert(JSON.stringify(data, null, 2))
    }
  }
  render() {
    const { data } = this.props
    console.log('loading', this.props.loading)
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        render: text => <Tag color="blue">{text}</Tag>,
      },
      {
        title: 'Status',
        dataIndex: 'state',
        render: text => (
          <Tag color={states[text].color}>{states[text].text}</Tag>
        ),
      },
      {
        title: 'Created',
        dataIndex: 'created',
        render: text => moment(text).format('MM-DD HH:mm:ss'),
      },
      {
        title: 'Finished',
        dataIndex: 'finished',
        render: text =>
          moment(text)
            .startOf('second')
            .fromNow(),
      },
      {
        title: 'Details',
        dataIndex: 'id',
        key: 'detials',
        fixed: 'right',
        width: 100,
        render: id => (
          <Button
            shape="circle"
            icon="profile"
            onClick={() => this.detailClickHandler(id)}
          />
        ),
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
}

TaskList.propTypes = {
  data: PropTypes.array,
}

export default TaskList
