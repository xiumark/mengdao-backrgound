import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
/**
 * 测试用
 */
class Rrecharge extends React.Component {
    state = {
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('从表单中获取的数据是: ', values);
                let { serverId, playerName, orderId } = values;
                //serverId可不填
                const querystring = `serverId=${serverId}&playerName=${playerName}&orderId=${orderId}`
                let url = "/root/repay.action"
                let method = 'POST'
                let successmsg = '补单成功'
                apiFetch(url, method, querystring, successmsg, (res) => {

                })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        return <div>
            <Card title="补单">
                <Row>
                    <Col className="gutter-row" md={11}>
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label={"服务器Id"} >
                                {getFieldDecorator('serverId', {
                                    rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="请输入服务器Id" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"角色名"}>
                                {getFieldDecorator('playerName', {
                                    rules: [{ required: true, message: '请输入角色名' }],
                                })(
                                    <Input placeholder="请输入角色名" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"订单号"}>
                                {getFieldDecorator('orderId', {
                                    // rules: [{ required: true, message: '请输入订单号' }],
                                })(
                                    <Input placeholder="请输入补单的订单号" />
                                    )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">补单</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div >
    }
}

export default Form.create()(Rrecharge);
