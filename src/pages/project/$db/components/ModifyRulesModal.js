import React, { PureComponent } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { withI18n, Trans } from '@lingui/react'
import { Form, Modal, Select, Tag, Switch, message, notification } from 'antd'
import CodeMirror from 'react-codemirror'
import * as ENABLED_RULES from 'utils/rules'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

const initCode = JSON.stringify(
  ENABLED_RULES['PUBLIC_VIEW_PUBLIC_MODIFY_RULE'],
  null,
  2
)

@withI18n()
@Form.create()
@connect(({ projectDetail }) => ({ projectDetail }))
class ModifyRulesModal extends React.Component {
  state = {
    proMode: false,
    rules: initCode,
  }

  componentDidMount() {
    const currentRules = this.getCurrentRules()
    if (currentRules) {
      this.setState({
        rules: JSON.stringify(currentRules, null, 2),
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { dispatch, table } = this.props
    const { proMode, rules } = this.state

    if (proMode) {
      try {
        const rules = JSON.parse(this.state.rules)
        this.callModifyAPI({ table, rules })
      } catch (e) {
        notification.error({
          message: 'JSON Parse Error',
          description: e.message,
          duration: 10,
        })
      }
    } else {
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const { rules_name } = values
          const rules = ENABLED_RULES[rules_name]

          this.callModifyAPI({ table, rules })
        }
      })

      this.props.form.resetFields()
    }
  }

  callModifyAPI = async ({ table, rules }) => {
    const { success } = await this.props.dispatch({
      type: 'projectDetail/modifyTableRules',
      payload: {
        table,
        rules,
      },
    })

    if (success) {
      this.props.close()
      this.props.query()
      message.success(this.props.i18n.t`Modify rules success`)
    }
  }

  getCurrentRules = () => {
    const { table } = this.props
    const { tables } = this.props.projectDetail

    return _get(tables, [table, 'rules'])
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

  onCodeMirrorChange = v => {
    this.setState({
      rules: v,
    })
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
            <Switch
              onChange={checked => this.setState({ proMode: checked })}
              defaultChecked={this.state.proMode}
              size="small"
            />
          </div>
          {this.state.proMode ? (
            <div style={{ margin: '10px 0' }}>
              <CodeMirror
                value={this.state.rules}
                onChange={this.onCodeMirrorChange}
                options={{
                  lineNumbers: true,
                  matchBrackets: true,
                  autoCloseBrackets: true,
                  mode: 'application/ld+json',
                  lineWrapping: true,
                  theme: 'monokai',
                }}
              />
            </div>
          ) : (
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
          )}
          <div>
            Current Rules:
            <div
              style={{
                maxHeight: '200px',
                overflow: 'scroll',
                background: '#eee',
                borderRadius: '5px',
                marginTop: '10px',
                padding: '5px',
                fontSize: '10px',
              }}
            >
              <pre>{JSON.stringify(this.getCurrentRules(), null, 2)}</pre>
            </div>
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
