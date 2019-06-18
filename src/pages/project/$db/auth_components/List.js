import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Modal, Avatar, Icon, Tag } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
import styles from './List.less'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      console.log('......edit', record)
      onEditItem(record)
    }
  }

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: <Trans>Avatar</Trans>,
        dataIndex: 'extra.avatar_url',
        key: 'extra.avatar_url',
        width: 72,
        fixed: 'left',
        render: text => <Avatar style={{ marginLeft: 8 }} src={text} />,
      },
      {
        title: <Trans>Provider</Trans>,
        dataIndex: 'provider',
        key: 'provider',
        render: text => <Tag color="blue">{text}</Tag>,
      },
      {
        title: <Trans>Name</Trans>,
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
      },
      {
        title: <Trans>State</Trans>,
        dataIndex: 'state',
        key: 'state',
        render: text => (
          <Tag color={text === 'Disabled' ? 'red' : 'green'}>{text}</Tag>
        ),
      },
      {
        title: <Trans>Last Login</Trans>,
        dataIndex: 'last_login',
        key: 'last_login',
        render: text => <Tag>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>,
      },
      {
        title: <Trans>Website</Trans>,
        dataIndex: 'extra.html_url',
        key: 'extra.html_url',
        render: text => (
          <a href={text} target="_blank">
            <Icon type="link" />
          </a>
        ),
      },
      {
        title: <Trans>Email</Trans>,
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: <Trans>Loaction</Trans>,
        dataIndex: 'extra.location',
        key: 'extra.location',
      },
      {
        title: <Trans>Create Time</Trans>,
        dataIndex: 'extra.created_at',
        key: 'extra.created_at',
        render: text => <Tag>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>,
      },
      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[{ key: '1', name: i18n.t`Update` }]}
            />
          )
        },
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
