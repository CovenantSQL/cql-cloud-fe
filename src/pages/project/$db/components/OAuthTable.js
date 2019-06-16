import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withI18n, Trans } from '@lingui/react'
import {
  Table,
  Modal,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Switch,
  Tag,
} from 'antd'

const EditableContext = React.createContext()

class EditableCell extends React.Component {
  getInput = () => {
    const dataIndex = this.props.dataIndex
    const value = this.props.record[dataIndex]

    if (this.props.inputType === 'switch') {
      return <Switch size="small" />
    }
    return <Input />
  }

  renderCell = ({ getFieldDecorator }) => {
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
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
              valuePropName: inputType === 'switch' ? 'checked' : 'value',
            })(this.getInput())}
          </Form.Item>
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

@withI18n()
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
        render: text => <Tag color="green">{text}</Tag>,
      },
      {
        title: 'Client ID',
        dataIndex: 'client_id',
        width: '30%',
        editable: true,
      },
      {
        title: 'Client Secret',
        dataIndex: 'client_secret',
        width: '35%',
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

  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }

      const data = this.props.data
      const index = data.findIndex(item => key === item.key)
      const config = data[index]

      const newConfig = Object.assign({}, config, row)
      this.updateRowConfig(newConfig)
    })
  }

  updateRowConfig = async config => {
    // config: { provider, client_id, client_secret, enabled }
    const { i18n } = this.props
    const { data, success } = await this.props.update(config)

    if (success) {
      Modal.success({
        title: i18n.t`OAuth 配置已更新`,
        content: '',
        okText: i18n.t`好的`,
      })

      this.setState({ editingKey: '' })
    }
  }

  isEditing = record => record.key === this.state.editingKey

  cancel = () => {
    this.setState({ editingKey: '' })
  }

  edit(key) {
    this.setState({ editingKey: key })
  }

  render() {
    // console.log('//', this.state)

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
  update: PropTypes.func,
}
const EditableOAuthTable = Form.create()(OAuthTable)
export default EditableOAuthTable
