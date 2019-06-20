import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withI18n, Trans } from '@lingui/react'
import { Form, Modal, Input, Icon, Button, Select } from 'antd'
import { DATA_TYPES } from 'utils/constant'

class ColumnInput extends React.Component {
  constructor(props) {
    super(props)

    const value = props.value || {}
    this.state = {
      name: value.name || '',
      type: value.type || DATA_TYPES[0],
    }
  }

  handleNameChange = e => {
    const name = e.target.value
    this.setState({ name })
    this.triggerChange({ name })
  }

  handleTypeChange = type => {
    this.setState({ type })
    this.triggerChange({ type })
  }

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue))
    }
  }

  render() {
    const { size } = this.props
    const state = this.state
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={state.name}
          onChange={this.handleNameChange}
          placeholder={'Table Column'}
          style={{ width: '55%', marginRight: '2%' }}
        />
        <Select
          value={state.type}
          size={size}
          style={{ width: '32%', marginRight: '1%' }}
          onChange={this.handleTypeChange}
        >
          {DATA_TYPES.map(t => (
            <Select.Option key={t} value={t}>
              {t}
            </Select.Option>
          ))}
        </Select>
      </span>
    )
  }
}

export default ColumnInput
