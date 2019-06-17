import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withI18n, Trans } from '@lingui/react'
import { connect } from 'dva'
import {
  Modal,
  Button,
  Input,
  InputNumber,
  Form,
  Select,
  Tag,
  message,
} from 'antd'
import styles from './UpdateUser.less'

const USER_STATES = ['PreRegistered', 'SignedUp', 'Enabled', 'Disabled']
@Form.create()
@connect(({ projectDetail }) => ({ projectDetail }))
class UpdateUser extends PureComponent {
  state = {
    loading: false,
  }

  submitUpdate = () => {
    const { user, dispatch, form } = this.props

    form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      console.log('Received values of form: ', values)
      const provider = user.provider
      const payload = {
        // fields disable update
        id: user.id,
        provider: user.provider,
        // fields could update
        name: values.name,
        email: values.email,
        state: values.state,
      }

      this.setState({ loading: true })
      const { data, success } = await dispatch({
        type: 'projectDetail/updateUser',
        payload,
      })
      this.setState({ loading: false })

      if (success) {
        message.success(`User info udpated`)
        // get the latest user list of current pagination
        dispatch({ type: 'projectDetail/getProjectUserList' })
        this.props.close()
      }
    })
  }

  render() {
    const { user, visible, close } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    return (
      <Modal
        visible={visible}
        title="Update User Info"
        cancelText="Cancel"
        onCancel={close}
        footer={[
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            loading={this.state.loading}
            onClick={this.submitUpdate}
          >
            Update
          </Button>,
        ]}
      >
        <div className={styles.header}>
          <Trans>Update user:</Trans>
          <Tag>{user.name}</Tag>
        </div>
        <div className={styles.form}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="Name">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your name',
                  },
                ],
                initialValue: user.name,
              })(<Input placeholder="Please input your name" />)}
            </Form.Item>
            <Form.Item label="Email">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ],
                initialValue: user.email,
              })(<Input placeholder="Please input email" />)}
            </Form.Item>
            <Form.Item label="State" hasFeedback>
              {getFieldDecorator('state', {
                rules: [
                  { required: true, message: 'Please select the user state!' },
                ],
                initialValue: user.state,
              })(
                <Select placeholder="Please select the user state">
                  {USER_STATES.map(s => (
                    <Select.Option value={s} key={s}>
                      {s}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    )
  }
}

UpdateUser.propTypes = {
  visible: PropTypes.bool,
  user: PropTypes.object,
  close: PropTypes.func,
}
export default UpdateUser
