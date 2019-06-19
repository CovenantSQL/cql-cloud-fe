import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withI18n, Trans } from '@lingui/react'
import { Form, Modal, Input, Icon, Button, Select } from 'antd'
import ColumnInput from './ColumnInput'

let id = 0
@withI18n()
class DynamicAddTableForm extends React.Component {
  componentDidMount() {
    this.add()
  }

  reset = () => {
    const { form } = this.props
    form.resetFields([])
    // this.add()
  }

  remove = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  add = () => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(id++)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { i18n } = this.props

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { keys, columns } = values
        console.log('Received values of form: ', values)
        console.log('Merged values:', keys.map(key => columns[key]))

        const table = values.table_name
        const names = values.columns.map(c => c.name)
        const types = values.columns.map(c => c.type)

        // return
        const { data, success } = await this.props.createTable({
          table,
          names,
          types,
        })

        if (success) {
          Modal.success({
            title: i18n.t`Create Table Success!`,
            content: (
              <div>
                <div>{data.table} created</div>
              </div>
            ),
            okText: i18n.t`好的`,
          })

          // reset form
          this.reset()
        }
      }
    })
  }

  checkColumnName = (rule, value, callback) => {
    if (value.name !== '') {
      callback()
      return
    }
    callback('Column name cannot be empty')
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    }

    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? 'Table Columns' : ''}
        required={true}
        key={k}
      >
        {getFieldDecorator(`columns[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{ validator: this.checkColumnName }],
        })(<ColumnInput />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ))

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label={'Table Name'} required={true}>
          {getFieldDecorator(`table_name`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input table's name.",
              },
            ],
          })(
            <Input
              placeholder="Table Name"
              style={{ width: '55%', marginRight: 8 }}
            />
          )}
        </Form.Item>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '55%' }}>
            <Icon type="plus" /> Add Table Column
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            Create Table
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

DynamicAddTableForm.propTypes = {
  createTable: PropTypes.func,
}
const AddTable = Form.create({ name: 'dynamic_add_table_form' })(
  DynamicAddTableForm
)
export default AddTable
