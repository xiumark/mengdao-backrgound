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
const TreeNode = Tree.TreeNode;
/**
 * 测试用
 */
class Announcements extends React.Component {
    state = {
        value1: 1,
        value2: 1,

    }

    handleButtonClick = (e) => { //获取权限列表
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { content } = values;
            console.log("content:", content)
        })
        console.log("e:", e)
        message.info('更新公告内容');
        let querystring = `content=${content.value}`
        console.log("queryString:", content.value)
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        fetch(`/root/setUpdateNotice.action`, {
            credentials: 'include', //发送本地缓存数据
            method: 'POST',
            headers: {
                headers
            },
            body: querystring
        }).then(res => {
            console.log("更新content后的res:", res)

        })
    }

    handleMenuClick = (e) => {
        // message.info('Click on menu item.');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        message.info('发送系统公告');
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('从表单中获取的数据是: ', values);
                let { noticeType, serverId, content, duration, times } = values;
                //serverId可不填

                const querystring = `noticeType=${noticeType}&serverId=${serverId}&content=${content}&duration=${duration}&times=${times}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/sendNotice.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    console.log('res:', res)
                    if (res.status !== 200) {
                        throw new Error('添加失败')
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
                        //console.log(res)
                    })
                    .catch(err => {
                        //console.log(err)
                        message.info('添加失败')
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
            <Card title="发送系统公告">
                <Row>

                    <Col className="gutter-row" md={11}>
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form onSubmit={this.handleSubmit}>
                            {/* <FormItem {...formItemLayout} label={"公告类型"} >
                                {getFieldDecorator('noticeType', {
                                    // rules: [{ required: true, message: '请输入公告类型（默认为1）' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="公告类型" />
                                    )}
                            </FormItem> */}
                            <FormItem {...formItemLayout} label="公告类型" hasFeedback>
                                {getFieldDecorator('noticeType', {
                                    rules: [
                                        // { required: true, message: 'Please Select your giftType!' },
                                    ],
                                })(
                                    <Select placeholder="请选择公告类型">
                                        <Option value="1">1</Option>
                                    </Select>
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"服务器Id"}>
                                {getFieldDecorator('serverId', {
                                    // rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="服务器Id" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"公告持续时间"}>
                                {getFieldDecorator('duration', {
                                    // rules: [{ required: true, message: '请输入公告持续时间（分钟）' }],
                                })(
                                    <Input placeholder="公告持续时间" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"滚动次数"}>
                                {getFieldDecorator('times', {
                                    // rules: [{ required: true, message: '请输入滚动次数' }],
                                })(
                                    <Input placeholder="滚动次数" />
                                    )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">发送</Button>
                            </FormItem>
                        </Form>
                    </Col>

                    <Col className="gutter-row" md={1}>
                        {/* <span>创建用户名：</span> */}
                    </Col>

                    <Col className="gutter-row" md={12}>
                        <FormItem {...formItemLayout} >
                            {getFieldDecorator('content', {
                                // rules: [{ required: true, message: '请输入滚动次数' }],
                            })(
                                <textarea style={{ width: "140%", height: 190 }} placeholder="更新公告内容" />
                                )}
                        </FormItem>
                        {/* <textarea name="a" style={{ width: 400 ,height:180 }} placeholder="在这里输入待更新公告内容"></textarea> */}
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" onClick={this.handleButtonClick}>更新</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Card>
        </div >;
    }
}

export default Form.create()(Announcements);
