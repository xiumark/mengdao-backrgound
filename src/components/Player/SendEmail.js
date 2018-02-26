import React from 'react';
import { Card, Form, Tooltip, Cascader, Select, Checkbox, Button, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';

//单选框
import { Radio } from 'antd';
const RadioGroup = Radio.Group;
//下拉菜单
import { Menu, Dropdown, Icon } from 'antd';
import { Row, Col } from 'antd';
const SubMenu = Menu.SubMenu;

import { Input } from 'antd';

import { Tree } from 'antd';
import { resolve } from 'path';
const TreeNode = Tree.TreeNode;
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
                const querystring = `mailType=${mailType}&serverId=${serverId}&playerName=${playerName}&attachmenet=${attachmenet}&mailContent=${mailContent}&duration=${duration}&title=${title}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/sendMail.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    if (res.status !== 200) {
                        throw new Error('请求失败')
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
                        message.info('发送邮件成功')
                    })
                    .catch(err => {
                        message.info('发送邮件失败')
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
                            {/* <FormItem {...formItemLayout} label={"邮件类型"}>
                                {getFieldDecorator('mailType', {
                                    // rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="邮件类型" />
                                    )}
                            </FormItem> */}
                            <FormItem {...formItemLayout} label="邮件类型" >
                                {getFieldDecorator('mailType', {
                                    rules: [
                                        { required: true, message: '请选择邮件类型' },
                                    ],
                                })(
                                    <Select placeholder="请选择邮件类型">
                                        <Option value="1">1（个人邮件）</Option>
                                        <Option value="2">2（单服邮件）</Option>
                                    </Select>
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"服务器Id"} >
                                {getFieldDecorator('serverId', {
                                    rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入服务器Id" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"目标用户名"} >
                                {getFieldDecorator('playerName', {
                                    rules: [{ required: true, message: '请输入目标用户名' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入目标用户名" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"附件内容"} >
                                {getFieldDecorator('attachmenet', {
                                    rules: [{ required: true, message: '请输入附件内容' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入附件内容" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"有效时间"} >
                                {getFieldDecorator('duration', {
                                    // rules: [{ required: true, message: 'Please input your auth!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入有效时间（分钟）" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col sm={12} md={12} xs={24}>
                            <FormItem {...formItemLayout} label={"邮件名称"} >
                                {getFieldDecorator('title', {
                                    // rules: [{ required: true, message: 'Please input your auth!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入邮件名称" />
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
