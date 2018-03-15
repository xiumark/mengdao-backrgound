import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList } from '../../api/service'
/**
 * 测试用
 */
class GiftCode extends React.Component {
    state = {
        giftCode: [],
        cardWidth: '',
        serviceList: [
            { serverId: "1", serverName: "sg_banshu", serverState: 0 },
            { serverId: "2", serverName: "sg_dev", serverState: 0 },
            { serverId: "90002", serverName: "sg_90002", serverState: 0 }
        ],
    }
    componentWillMount() {
        getServiceList((res) => {
            // let serviceIdList = res.map(item => {
            //     return item.serverId
            // })
            // this.setState({ serviceIdList: serviceIdList })
            this.setState({ serviceList: res })
        })
    }
    /**
     * 获取礼品码并且显示
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { giftCodeType, serverId, yx, num, giftContent, duration } = values;
                //serverId可不填
                let querystring = `giftCodeType=${giftCodeType}&serverId=${serverId}&yx=${yx}&num=${num}&giftContent=${giftContent}&duration=${duration}`
                let url = "/root/getGiftCode.action"
                let method = 'POST'
                let successmsg = '礼品码获取成功'
                apiFetch(url, method, querystring, successmsg, (res) => {
                    let { giftCode } = this.state;
                    giftCode = res.data.giftCode.split(";");
                    this.setState({ giftCode: giftCode })
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { giftCode, cardWidth, serviceList } = this.state;
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
                        <Form onSubmit={this.handleSubmit}>

                            <FormItem {...formItemLayout} label="礼品码类型" >
                                {getFieldDecorator('giftCodeType', {
                                    rules: [
                                        { required: true, message: '请选择礼品码类型!' },
                                    ],
                                })(
                                    <Select placeholder="请选择礼品码类型">
                                        <Option value="1">1 新手礼品码 </Option>
                                        <Option value="2">2 个人礼品码 </Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="服务器ID" >
                                {getFieldDecorator('serverId', {
                                    rules: [
                                        { required: true, message: '请选择服务器ID' },
                                    ],
                                })(
                                    <Select placeholder="选择服务器名称">
                                        {serviceList.map((item, index) => {
                                            return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            {/* <FormItem {...formItemLayout} label={"服务器Id"}>
                                {getFieldDecorator('serverId', {
                                    rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="服务器Id" />
                                )}
                            </FormItem> */}
                            <FormItem {...formItemLayout} label={"联运商"}>
                                {getFieldDecorator('yx', {
                                    rules: [{ required: true, message: '请输入联运商名称' }],
                                })(
                                    <Input placeholder="联运商" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"申请礼品码数量"}>
                                {getFieldDecorator('num', {
                                    rules: [{ required: true, message: '请输入申请的礼品码数量' }],
                                })(
                                    <Input placeholder="礼品码数量（最多50个）" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"礼品内容"}>
                                {getFieldDecorator('giftContent', {
                                    rules: [{ required: true, message: '请输入申请的礼品内容' }],
                                })(
                                    <Input placeholder="礼品内容" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"有效时间"}>
                                {getFieldDecorator('duration', {
                                    rules: [{ required: true, message: '请输入有效时间' }],
                                })(
                                    <Input placeholder="有效时间（分钟）" />
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
