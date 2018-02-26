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
class BanAndLift extends React.Component {
    state = {
        value1: 1,
        value2: 1,

    }


    /**
     * 封禁玩家
     */
    handleButtonClick = (e) => { //获取权限列表
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { playerName, serverId, reason, duration } = values;
            const querystring = `playerName=${playerName}&serverId=${serverId}&reason=${reason}&duration=${duration}`
            let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            fetch(`/root/banUser.action`, {
                credentials: 'include', //发送本地缓存数据
                method: 'POST',
                headers: {
                    headers
                },
                body: querystring
            }).then(res => {
                if (res.status !== 200) {
                    throw new Error({ message: '封禁角色失败' })
                }
                return res;
            })
                .then(res => res.json())
                .then(res => {
                    if (res.state === 1) {
                        message.info("封禁角色成功")
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
     * 解禁玩家
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { playerName, serverId } = values;
                //serverId可不填
                const querystring = `playerName=${playerName}&serverId=${serverId}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/unbanUser.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    if (res.status !== 200) {
                        throw new Error({ message: '解除封禁失败' })
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.state === 1) {
                            message.info("解除封禁成功")
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
                    <Card title="解禁角色">
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
                                <Button type="primary" htmlType="submit">解禁</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </Col>

                <Col className="gutter-row" md={12}>
                    <Card title="封禁角色">
                        <FormItem {...formItemLayout} label={"封禁原因"}>
                            {getFieldDecorator('reason', {
                                // rules: [{ required: true, message: '请输入封禁原因' }],
                            })(
                                <Input placeholder="请输入封禁原因" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label={"封禁时间"}>
                            {getFieldDecorator('duration', {
                                // rules: [{ required: true, message: '请输入封禁时间' }],
                            })(
                                <Input placeholder="请输入封禁时间（分钟）" />
                                )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" onClick={this.handleButtonClick}>封禁</Button>
                        </FormItem>
                    </Card>
                </Col>
            </Row>
        </div >;
    }
}
export default Form.create()(BanAndLift);
