import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
/**
 * 测试用
 */
class WordsBlock extends React.Component {
    state = {
        value1: 1,
        value2: 1,

    }

    /**
     * 禁言玩家
     */
    handleButtonClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { serverId, playerName, reason, duration } = values;
            let querystring = `serverId=${serverId}&playerName=${playerName}&reason=${reason}&duration=${duration}`
            let url = "/root/banChat.action"
            let method = 'POST'
            let successmsg = '禁言成功'
            apiFetch(url, method, querystring, successmsg, (res) => {

            })
        })
    }


    /**
     * 解除禁言
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { serverId, playerName, reason, duration } = values;
                let querystring = `serverId=${serverId}&playerName=${playerName}`
                let url = "/root/unbanChat.action"
                let method = 'POST'
                let successmsg = '解除禁言成功'
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
            <Row>
                <Col className="gutter-row" md={12}>
                    <Card title="解除禁言">
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label={"用户名"} >
                                {getFieldDecorator('playerName', {
                                    rules: [{ required: true, message: '请输入用户名' }],
                                })(
                                    <Input placeholder="请输入用户名" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"服务器Id"}>
                                {getFieldDecorator('serverId', {
                                    rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="请输入服务器Id" />
                                    )}
                            </FormItem>

                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">解除禁言</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </Col>

                <Col className="gutter-row" md={12}>
                    <Card title="禁言">
                        <FormItem {...formItemLayout} label={"封禁原因"}>
                            {getFieldDecorator('reason', {
                                // rules: [{ required: true, message: '请输入公告持续时间（分钟）' }],
                            })(
                                <Input placeholder="请输入封禁原因" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label={"封禁时间"}>
                            {getFieldDecorator('duration', {
                                // rules: [{ required: true, message: '请输入滚动次数' }],
                            })(
                                <Input placeholder="请输入封禁时间（分钟）" />
                                )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" onClick={this.handleButtonClick}>禁言</Button>
                        </FormItem>
                    </Card>
                </Col>
            </Row>
        </div >;
    }
}
export default Form.create()(WordsBlock);
