import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Form, Input, Button, Modal, Icon, message } from 'antd'
import { Trans, withI18n } from '@lingui/react'

@withI18n()
@Form.create()
@connect(({ loading, dashboard }) => ({ loading, dashboard }))
class UpdateAliasModal extends PureComponent {
  submitAlias = () => {
    const { db, alias, dispatch, form, close } = this.props

    form.validateFields(async (err, values) => {
      if (err) {
        return
      }
      console.log('Received values of form: ', values)

      const { alias } = values
      const { data, success } = await dispatch({
        type: 'dashboard/updateProjectMisc',
        payload: { db, alias },
      })

      if (success) {
        dispatch({ type: 'app/getProjectList' })
        message.success('Update project alias success')
        close()
      }
    })
  }
  render() {
    const { close, form } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal
        visible={true}
        title={'请输入希望修改的别名:'}
        onCancel={close}
        footer={[
          <Button type="primary" onClick={this.submitAlias}>
            <Trans>OK</Trans>
          </Button>,
        ]}
      >
        <Form>
          <Form.Item label="alias">
            {getFieldDecorator('alias', {
              rules: [
                {
                  required: true,
                  message: 'Please input the new alias',
                },
                {
                  max: 16,
                  message: 'Max length of alias is 16 characters',
                },
              ],
              initialValue: this.props.alias,
            })(<Input placeholder="Please input the new alias" />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

UpdateAliasModal.propTypes = {
  alias: PropTypes.string.isRequired,
  close: PropTypes.func,
}
UpdateAliasModal.defaultProps = {}
export default UpdateAliasModal
