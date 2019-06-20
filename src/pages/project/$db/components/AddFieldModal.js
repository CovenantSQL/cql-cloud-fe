import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { withI18n, Trans } from '@lingui/react'
import { Form, Modal, Input, Tag, message } from 'antd'
import { DATA_TYPES } from 'utils/constant'
import ColumnInput from './ColumnInput'

@withI18n()
@Form.create()
@connect(({ projectDetail }) => ({ projectDetail }))
class AddFieldModal extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    const { i18n, dispatch, table } = this.props

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const { name, type } = values['column']

        const { data, success } = await dispatch({
          type: 'projectDetail/addTableField',
          payload: {
            table,
            name,
            type,
          },
        })

        if (success) {
          this.props.close()
          this.props.query()
          message.success(i18n.t`Add field success`)
        }
      }
    })

    this.props.form.resetFields()
  }

  checkColumnName = (rule, value, callback) => {
    if (value.name !== '') {
      callback()
      return
    }
    callback('Column name cannot be empty')
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Modal
        visible={this.props.visible}
        title=<div>
          Add Field to Table <Tag>{this.props.table}</Tag>
        </div>
        onCancel={this.props.close}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item label={'Column To Add'} required={true}>
            {getFieldDecorator(`column`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: { name: '', type: DATA_TYPES[0] },
              rules: [{ validator: this.checkColumnName }],
            })(<ColumnInput />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

AddFieldModal.propTypes = {
  table: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  close: PropTypes.func,
}
export default AddFieldModal
