import React from 'react';
import { Card, Form, Tooltip, Cascader, Select, Checkbox, Button, message } from 'antd';
const FormItem = Form.Item;
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
const TreeNode = Tree.TreeNode;
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
            let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            let querystring = `serverId=${serverId}&playerName=${playerName}&reason=${reason}&duration=${duration}`
            fetch(`/root/banChat.action`, {
                credentials: 'include', //发送本地缓存数据
                method: 'POST',
                headers: {
                    headers
                },
                body: querystring
            }).then(res => {
                if (res.status !== 200) {
                    throw new Error("未知错误")
                }
                return res;
            }).then(res => { return res.json() })
                .then(res => {
                    if (res.state === 1) {
                        message.info("禁言成功")
                    }
                    if (res.state === 0) {
                        throw new Error(res.data.msg)
                    }
                })
                .catch(err => {
                    message.error(err.message ? err.message : "未知错误")
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
                const querystring = `serverId=${serverId}&playerName=${playerName}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/unbanChat.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    console.log('res:', res)
                    if (res.status !== 200) {
                        throw new Error('未知错误')
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.state === 1) {
                            message.info("解除禁言成功")
                        }
                        if (res.state === 0) {
                            throw new Error(res.data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message ? err.message : '未知错误')
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
