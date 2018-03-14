import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
/**
 * 测试用
 */
class SendEmail extends React.Component {
    state = {
    }
    componentWillMount() {
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { mailType, serverId, playerName, attachmenet, mailContent, duration, title } = values;
                let querystring = `mailType=${mailType}&serverId=${serverId}&playerName=${playerName}&attachmenet=${attachmenet}&mailContent=${mailContent}&duration=${duration}&title=${title}`
                let url = "/root/sendMail.action"
                let method = 'POST'
                let successmsg = '发送邮件成功'
                apiFetch(url, method, querystring, successmsg, (res) => {

                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 20 },
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
            <Card title="发送邮件" style={{}}>
                {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                <Form onSubmit={this.handleSubmit} id="email">
                    <Row>
                        <Col sm={12} md={12} xs={24}>
                            <FormItem {...formItemLayout} label="邮件类型" >
                                {getFieldDecorator('mailType', {
                                    rules: [
                                        { required: true, message: '请选择邮件类型' },
                                    ],
                                })(
                                    <Select placeholder="请选择邮件类型">
                                        <Option value="1">个人邮件</Option>
                                        <Option value="2">单服邮件</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"服务器Id"} >
                                {getFieldDecorator('serverId', {
                                    rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="请输入服务器Id" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"目标用户名"} >
                                {getFieldDecorator('playerName', {
                                    // rules: [{ required: true, message: '请输入目标用户名' }],
                                })(
                                    <Input placeholder="请输入目标用户名（单服邮件可不填）" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"附件内容"} >
                                {getFieldDecorator('attachmenet', {
                                    rules: [{ required: true, message: '请输入附件内容' }],
                                })(
                                    <Input placeholder="请输入附件内容" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"有效时间"} >
                                {getFieldDecorator('duration', {
                                    rules: [{ required: true, message: '请输入有效时间!' }],
                                })(
                                    <Input placeholder="请输入有效时间（分钟）" />
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={12} md={12} xs={24}>
                            <FormItem {...formItemLayout} label={"邮件名称"} >
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: '请输入邮件名称!' }],
                                })(
                                    <Input placeholder="请输入邮件名称" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"邮件正文"} >
                                {getFieldDecorator('mailContent', {
                                    // rules: [{ required: true, message: '请输入滚动次数' }],
                                })(
                                    <textarea style={{ minHeight: 200, width: "100%" }} placeholder="请输入邮件正文" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...tailFormItemLayout} >
                        <Button type="primary" htmlType="submit">发送邮件</Button>
                    </FormItem>
                </Form>
            </Card>
        </div >;
    }
}

export default Form.create()(SendEmail);
