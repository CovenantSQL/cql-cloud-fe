import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Input, InputNumber, Popconfirm, Form, Switch } from 'antd'

const EditableContext = React.createContext()

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'switch') {
      return <Switch onChange={() => {}} size="small" />
    }
    return <Input />
  }

  renderCell = () => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>{this.getInput()}</Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    )
  }
}

class OAuthTable extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      editingKey: '',
    }
    this.columns = [
      {
        title: 'Enable',
        dataIndex: 'enabled',
        width: '5%',
        editable: true,
        render: text => (
          <Switch
            onChange={() => {}}
            size="small"
            defaultChecked={text}
            disabled
          />
        ),
      },
      {
        title: 'Provider',
        dataIndex: 'provider',
        width: '10%',
      },
      {
        title: 'Client ID',
        dataIndex: 'client_id',
        width: '20%',
        editable: true,
      },
      {
        title: 'Client Secret',
        dataIndex: 'client_secret',
        width: '25%',
        editable: true,
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state
          const editable = this.isEditing(record)
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    href="javascript:"
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => this.cancel(record.key)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a
              disabled={editingKey !== ''}
              onClick={() => this.edit(record.key)}
            >
              Edit
            </a>
          )
        },
      },
    ]
  }

  save = () => {}

  isEditing = record => record.key === this.state.editingKey

  cancel = () => {
    this.setState({ editingKey: '' })
  }

  edit(key) {
    this.setState({ editingKey: key })
  }

  render() {
    console.log('//', this.state.data)

    const components = {
      body: {
        cell: EditableCell,
      },
    }

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'enabled' ? 'switch' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      }
    })

    return (
      <div>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.props.data}
            columns={columns}
            rowClassName="editable-row"
            pagination={false}
          />
        </EditableContext.Provider>
      </div>
    )
  }
}

OAuthTable.propTypes = {
  data: PropTypes.array,
  udpate: PropTypes.func,
}
export default OAuthTable
