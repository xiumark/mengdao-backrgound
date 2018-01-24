import React from 'react';
import './index.less';
import { Card, Table, Dropdown, Button, Menu, Row, Col, Form, Input, Select } from 'antd';
// import { Card, Form, Tooltip, Cascader, Select, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 测试用
 */
class GiftCode extends React.PureComponent {

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8 },
    }
    const buttonItemLayout = {
      wrapperCol: { span: 14, offset: 16 }
    }
    return <div>
          <Card title='申请礼品码'>
            <Form>
              <Row>
                <Col span={12} offset={0}>
                  <FormItem {...formItemLayout} label="title"><Input placeholder="请输入礼包名称" /></FormItem>
                  <FormItem {...formItemLayout} label="serverId"><Input placeholder="请输入serverId" /></FormItem>
                  <FormItem {...formItemLayout} label="playerName"><Input placeholder="请输入playerName" /></FormItem>
                  <FormItem {...formItemLayout} label="yx"><Input placeholder="请输入yx" /></FormItem>
                </Col>
                <Col span={12} offset={0}>
                  <FormItem label="GiftType" labelCol={{ span: 6 }} wrapperCol={{ span: 8 }}>
                        <Select
                          placeholder="请选择礼物类型"
                          onChange={this.handleSelectChange}
                        >
                          {/* <Option value="type">请选择礼物类型</Option> */}
                          <Option value="type1">type1</Option>
                          <Option value="type2">type2</Option>
                        </Select>
                  </FormItem>
                  <FormItem label="GiftContent" labelCol={{ span: 6 }} wrapperCol={{ span: 8 }}>
                        <Select
                          placeholder="请选择礼物内容"
                          onChange={this.handleSelectChange}
                        >
                          {/* <Option value="type">请选择礼物类型</Option> */}
                          <Option value="type1">金币</Option>
                          <Option value="type2">银币</Option>
                        </Select>
                  </FormItem>
                  <FormItem {...formItemLayout} label="duration"><Input placeholder="请输入持续时间" /></FormItem>
                  <FormItem {...formItemLayout} label="num"><Input placeholder="请输入num,最多50个" /></FormItem>
                </Col>
              </Row>
              <FormItem {...buttonItemLayout}>
                <Button onClick={this.handleButtonClick} type="primary">请求礼品码</Button>
              </FormItem>
            </Form>
          </Card>
          <Card title="礼品码" style = {{marginTop:15}} >
            <p>giftCode：<span>FDQ1BT2EMHU;8YBCVY61QRY</span></p>
          </Card>
      </div>;
  }

}

export default GiftCode;
