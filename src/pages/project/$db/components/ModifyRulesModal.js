import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { withI18n, Trans } from '@lingui/react'
import { Form, Modal, Select, Tag, Switch, message } from 'antd'
import * as ENABLED_RULES from 'utils/rules'

@withI18n()
@Form.create()
@connect(({ projectDetail }) => ({ projectDetail }))
class ModifyRulesModal extends React.Component {
  state = {
    proMode: false,
    userEnteredRules: null,
  }
  handleSubmit = e => {
    e.preventDefault()
    const { i18n, dispatch, table } = this.props

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const { rules_name } = values

        const { success } = await dispatch({
          type: 'projectDetail/modifyTableRules',
          payload: {
            table,
            rules: ENABLED_RULES[rules_name],
          },
        })

        if (success) {
          this.props.close()
          this.props.query()
          message.success(i18n.t`Modify rules success`)
        }
      }
    })

    this.props.form.resetFields()
  }

  _renderRules = () => {
    const { table } = this.props
    const { tables } = this.props.projectDetail

    return (
      <div
        style={{
          maxHeight: '200px',
          overflow: 'scroll',
          background: '#eee',
          borderRadius: '5px',
          padding: '5px',
          fontSize: '10px',
        }}
      >
        <pre>{JSON.stringify(_get(tables, [table, 'rules']), null, 2)}</pre>
      </div>
    )
  }

  getRuleOption = rule => {
    switch (rule) {
      case 'PUBLIC_VIEW_PUBLIC_MODIFY_RULE':
        return 'Public Table (View and modify by anyone)'
      case 'PUBLIC_VIEW_USER_MODIFY_RULE':
        return 'User Edit Table (View by anyone, modify by user of that $user_id)'
      case 'LOGIN_VIEW_USER_MODIFY_RULE':
        return 'User Edit Logined Table (View by logined ones, modify by user of that $user_id)'
      case 'USER_VIEW_USER_MODIFY_RULE':
        return 'Private Table (View and modify by user of that $user_id)'
      default:
        return '--'
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
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

    return (
      <Modal
        visible={this.props.visible}
        width={680}
        title=<div>
          Modify table rules for <Tag>{this.props.table}</Tag>
        </div>
        onCancel={this.props.close}
        onOk={this.handleSubmit}
      >
        <div>
          <div style={{ textAlign: 'right' }}>
            Pro Mode:
            <Switch defaultChecked={this.state.proMode} size="small" />
          </div>
          <Form {...formItemLayout}>
            <Form.Item label="Table Rule">
              {getFieldDecorator('rules_name', {
                rules: [
                  {
                    required: true,
                    message: 'Please select the target table rule',
                  },
                ],
              })(
                <Select placeholder="Select a table rule">
                  {Object.keys(ENABLED_RULES).map(r => (
                    <Select.Option value={r} key={r}>
                      {this.getRuleOption(r)}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Form>
          <div>
            Current Rules:
            {this._renderRules()}
          </div>
        </div>
      </Modal>
    )
  }
}

ModifyRulesModal.propTypes = {
  table: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  query: PropTypes.func,
  close: PropTypes.func,
}
export default ModifyRulesModal
