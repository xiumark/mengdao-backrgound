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
class GiftCode extends React.Component {
    state = {
        giftCode: [],
        cardWidth: ''
    }

    /**
     * 获取礼品码并且显示
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('从表单中获取的数据是: ', values);
                let { giftCodeType, serverId, yx, num, giftContent, duration } = values;
                //serverId可不填
                const querystring = `giftCodeType=${giftCodeType}&serverId=${serverId}&yx=${yx}&num=${num}&giftContent=${giftContent}&duration=${duration}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/getGiftCode.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    // console.log('获取的礼品码是:', res.json())
                    if (res.status !== 200) {
                        throw new Error('添加失败')
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
                        let { giftCode } = this.state;
                        giftCode = res.data.giftCode.split(";");
                        this.setState({ giftCode: giftCode })
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
        const { giftCode, cardWidth } = this.state;
        let middle = Math.ceil(giftCode.length / 2);
        // Math.ceil(5/2)
        let leftContent = [];
        let rightContent = [];
        for (let i = 0; i < middle; i++) {
            leftContent.push(giftCode[i]);
        }
        for (let i = middle; i < giftCode.length; i++) {
            rightContent.push(giftCode[i])
        }
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
            <Card title="获取礼品码">
                <Row>
                    <Col className="gutter-row" md={12} sm={24}>
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form onSubmit={this.handleSubmit}>
                            {/* <FormItem {...formItemLayout} label={"礼品码类型"} >
                                {getFieldDecorator('giftCodeType', {
                                    // rules: [{ required: true, message: '请输入公告类型（默认为1）' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="礼品码类型" />
                                    )}
                            </FormItem> */}
                            <FormItem {...formItemLayout} label="礼品码类型" >
                                {getFieldDecorator('giftCodeType', {
                                    rules: [
                                        // { required: true, message: 'Please Select your giftType!' },
                                    ],
                                })(
                                    <Select placeholder="请选择礼品码类型">
                                        <Option value="1">1（新手礼品码）</Option>
                                        <Option value="2">2（个人礼品码）</Option>
                                    </Select>
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"服务器Id"}>
                                {getFieldDecorator('serverId', {
                                    // rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="服务器Id" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"联运商"}>
                                {getFieldDecorator('yx', {
                                    // rules: [{ required: true, message: '请输入公告持续时间（分钟）' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="联运商" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"申请礼品码数量"}>
                                {getFieldDecorator('num', {
                                    // rules: [{ required: true, message: '请输入滚动次数' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="礼品码数量" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"礼品内容"}>
                                {getFieldDecorator('giftContent', {
                                    // rules: [{ required: true, message: '请输入滚动次数' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="礼品内容" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"有效时间"}>
                                {getFieldDecorator('duration', {
                                    // rules: [{ required: true, message: '请输入滚动次数' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="有效时间（分钟）" />
                                    )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">获取</Button>
                            </FormItem>
                        </Form>
                    </Col>

                    <Col className="gutter-row" md={1}>
                        {/* <span>创建用户名：</span> */}
                    </Col>

                    <Col className="gutter-row" md={11} sm={24}>
                        <Card title="获取的礼品码列表" id="liCard" style={{ minHeight: 380 }}>
                            <Row>
                                <Col xs={12} sm={12}>
                                    {<ul>
                                        {leftContent.map((item, index) => {
                                            return (<li key={index}>{item}</li>)
                                        })}

                                    </ul>}
                                </Col>
                                <Col xs={12} sm={12}>
                                    {<ul>
                                        {rightContent.map((item, index) => {
                                            return (<li key={index}>{item}</li>)
                                        })}
                                    </ul>}
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div >;
    }
}

export default Form.create()(GiftCode);
