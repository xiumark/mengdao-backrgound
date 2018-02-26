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
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/repay.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    console.log('res:', res)
                    if (res.status !== 200) {
                        throw new Error('请求失败')
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
                        //console.log(res)
                    })
                    .catch(err => {
                        //console.log(err)
                        message.info('请求失败')
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
