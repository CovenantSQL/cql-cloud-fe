import React from 'react'
import { request } from 'utils'
import { connect } from 'dva'
import _get from 'lodash/get'
import {
  Row,
  Col,
  Select,
  Input,
  Button,
  List,
  Tag,
  Form,
  Icon,
  Checkbox,
} from 'antd'
import classnames from 'classnames'
import CodeMirror from 'react-codemirror'
import { Trans } from '@lingui/react'
import { CLIENT_API } from 'utils/constant'
import api from '@/services/api'
import { Page } from 'components'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

import styles from './request.less'

const { Option } = Select
const InputGroup = Input.Group
const methods = ['POST', 'GET', 'PUT', 'PATCH', 'DELETE']

const methodTagColor = {
  GET: 'green',
  POST: 'orange',
  DELETE: 'red',
  PUT: 'geekblue',
}

// for local test
const apiPrefix = '/v3'

const requests = Object.values(CLIENT_API).map(item => {
  let url = apiPrefix + item
  let method = 'GET'
  const paramsArray = item.split(' ')
  if (paramsArray.length === 2) {
    method = paramsArray[0]
    url = apiPrefix + paramsArray[1]
  }
  return {
    method,
    url,
  }
})

let uuid = 2
@Form.create()
@connect(({ projectDetail }) => ({ config: projectDetail.config }))
class RequestPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      method: 'GET',
      url: apiPrefix + CLIENT_API.find,
      keys: [1],
      result: null,
      visible: true,
    }
  }

  constructAPIDomain = () => {
    const alias = _get(this.props.config, ['misc', 'alias'], '')
    console.log('...l..', this.props.config)
    return '//' + alias + '.stg-api.covenantsql.io:15153'
  }

  constructTableSelection = () => {
    const tables = _get(this.props.config, ['misc', 'tables'], [])
    return tables.map(t => ({}))
    return (
      <Select placeholder="Please select a country">
        {tables.map(t => {
          if (!t.config.is_deleted) {
            return (
              <Select.Option key={t.table} value={t.table}>
                {t.table}
              </Select.Option>
            )
          }
        })}
      </Select>
    )
  }

  handleRequest = () => {
    const { method } = this.state

    // prefix the this.constructAPIDomain()
    let url = this.constructAPIDomain() + this.state.url

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {}
        console.log('.///', values)
        if (values.key) {
          values.key.forEach((item, index) => {
            if (item && values.check[index]) {
              params[item] = values.value[index]
            }
          })

          if (values.value.data) {
            console.log('parsing, ', values.value.data)
            params.data = JSON.parse(values.value.data)
          }
        }

        console.log(params)

        request({ method, url, data: params }).then(data => {
          this.setState({
            result: JSON.stringify(data),
          })
        })
      }
    })
  }

  handleClickListItem = ({ method, url }) => {
    this.setState({
      method,
      url,
      keys: [uuid++],
      result: null,
    })
  }

  handleInputChange = e => {
    this.setState({
      url: e.target.value,
    })
  }

  handleSelectChange = method => {
    this.setState({
      method,
    })
  }

  handleAddField = () => {
    const { keys } = this.state
    const nextKeys = keys.concat(uuid)
    uuid++
    this.setState({
      keys: nextKeys,
    })
  }

  handleRemoveField = key => {
    const { keys } = this.state
    this.setState({
      keys: keys.filter(item => item !== key),
    })
  }

  handleVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  render() {
    const { result, url, method, keys, visible } = this.state
    const { getFieldDecorator } = this.props.form
    console.log('///////////', this.state)

    return (
      <Page inner>
        <div style={{ padding: '10px 10px 20px' }}>
          Client API domain:{' '}
          <Tag color="geekblue">{this.constructAPIDomain()}</Tag>
        </div>
        <Row>
          <Col lg={8} md={24}>
            <List
              className={styles.requestList}
              dataSource={requests}
              renderItem={item => (
                <List.Item
                  className={classnames(styles.listItem, {
                    [styles.lstItemActive]:
                      item.method === method && item.url === url,
                  })}
                  onClick={this.handleClickListItem.bind(this, item)}
                >
                  <span style={{ width: 72 }}>
                    <Tag
                      style={{ marginRight: 8 }}
                      color={methodTagColor[item.method]}
                    >
                      {item.method}
                    </Tag>
                  </span>
                  {item.url}
                </List.Item>
              )}
            />
          </Col>
          <Col lg={16} md={24}>
            <Row type="flex" justify="space-between">
              <InputGroup compact size="large" style={{ flex: 1 }}>
                <Select
                  size="large"
                  value={method}
                  style={{ width: 100 }}
                  onChange={this.handleSelectChange}
                >
                  {methods.map(item => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
                <Input
                  value={url}
                  onChange={this.handleInputChange}
                  style={{ width: 'calc(100% - 200px)' }}
                />
                <Button
                  ghost={visible}
                  type={visible ? 'primary' : ''}
                  onClick={this.handleVisible}
                  size="large"
                >
                  <Trans>Params</Trans>
                </Button>
              </InputGroup>

              <Button
                size="large"
                type="primary"
                style={{ width: 100 }}
                onClick={this.handleRequest}
              >
                <Trans>Send</Trans>
              </Button>
            </Row>

            <div
              className={classnames(styles.paramsBlock, {
                [styles.hideParams]: !visible || url.indexOf(':table') > -1,
              })}
            >
              {keys.map((key, index) => (
                <Row
                  gutter={8}
                  type="flex"
                  justify="start"
                  align="middle"
                  key={key}
                >
                  <Col style={{ marginTop: 8 }}>
                    {getFieldDecorator(`check[${key}]`, {
                      initialValue: true,
                    })(<Checkbox defaultChecked />)}
                  </Col>
                  <Col style={{ marginTop: 8 }}>
                    {getFieldDecorator(`key[${key}]`)(
                      <Input placeholder="Key" />
                    )}
                  </Col>
                  <Col style={{ marginTop: 8 }}>
                    {getFieldDecorator(`value[${key}]`)(
                      <Input placeholder="Value" />
                    )}
                  </Col>
                  <Col style={{ marginTop: 8 }}>
                    <Icon
                      onClick={this.handleRemoveField.bind(this, key)}
                      style={{ cursor: 'pointer' }}
                      type="close"
                      theme="outlined"
                    />
                  </Col>
                </Row>
              ))}

              <Row style={{ marginTop: 8 }}>
                <Button onClick={this.handleAddField}>
                  <Trans>Add Param</Trans>
                </Button>
              </Row>
            </div>

            {url.indexOf(':table') > -1 && (
              <div>
                <Row gutter={8} type="flex" justify="start" align="middle">
                  <Col style={{ marginTop: 8 }}>
                    {getFieldDecorator(`check[table]`, {
                      initialValue: true,
                    })(<Checkbox defaultChecked disabled />)}
                  </Col>
                  <Col style={{ marginTop: 8 }}>
                    {getFieldDecorator(`key[table]`)(
                      <Input placeholder="table" value={'table'} disabled />
                    )}
                  </Col>
                  <Col style={{ marginTop: 8 }}>
                    {getFieldDecorator(`value[table]`)(
                      <Input placeholder="Value" />
                    )}
                  </Col>
                </Row>
                <Row gutter={8}>
                  <div style={{ padding: '15px 10px 5px', fontWeight: '600' }}>
                    Data:
                  </div>
                  {getFieldDecorator('value[data]', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input table data',
                        type: 'json',
                      },
                    ],
                  })(
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
                  )}
                </Row>
              </div>
            )}

            <div className={styles.result}>
              <pre>{JSON.stringify(JSON.parse(result), null, 2)}</pre>
            </div>
          </Col>
        </Row>
      </Page>
    )
  }
}

export default RequestPage
