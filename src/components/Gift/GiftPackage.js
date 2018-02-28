import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'

class GiftPackage extends React.Component {
    state = {
        key: 1,
        giftPackageItemsData: [
            // { key: '0', type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
            // { key: '1', type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
            // { key: '2', type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
        ]
    }
    columns = [
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'wildCard',
            dataIndex: 'wildCard',
            key: 'wildCard',
        },
    ];
    getPackageItemList = () => { //获取礼包信息列表
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { serverId } = values;
                const querystring = `serverId=${serverId}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/getItems.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    if (res.status !== 200) {
                        throw new Error('获取礼包信息失败')
                    }
                    return res.json()
                })
                    .then(res => {
                        let { giftPackageItemsData, key } = this.state;
                        giftPackageItemsData = [];
                        let items = res.items;
                        if (!items) {
                            throw new Error('获取礼包信息失败')
                        }
                        message.info("成功获取礼包信息")
                        for (let i = 0; i < items.length; i++) {
                            let data = items[i]
                            let tableItem = Object.assign(data, { key: key });
                            giftPackageItemsData.push(tableItem);
                            key = key + 1;
                        }
                        this.setState({ giftPackageItemsData: giftPackageItemsData, key: key + 1 }, () => {
                        })
                    }).catch(err => {
                        message.error(err.message ? err.message : '未知错误')

                    })
            }
        })
    }

    handleSubmit = (e) => {//发送礼包
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { giftType, serverId, playerName, giftContent, duration, title } = values;
                const querystring = `giftType=${giftType}&serverId=${serverId}&playerName=${playerName}&giftContent=${giftContent}&duration=${duration}&title=${title}`
                let url = "/root/sendGift.action"
                let method = 'POST'
                let successmsg = '成功发送礼包'
                apiFetch(url, method, querystring, successmsg, (res) => {

                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { giftPackageItemsData } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
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
            <Card title="礼包管理">
                <Form onSubmit={this.handleSubmit} id="add">
                    <Row>
                        <Col className="gutter-row" md={12}>
                            <FormItem {...formItemLayout} label="礼包类型" >
                                {getFieldDecorator('giftType', {
                                    rules: [
                                        // { required: true, message: '请选择礼包类型!' },
                                    ],
                                })(
                                    <Select placeholder="请选择礼包类型">
                                        <Option value="1">1 个人礼包</Option>
                                        <Option value="2">2 单服礼包</Option>
                                    </Select>
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"服务器Id"} >
                                {getFieldDecorator('serverId', {
                                    rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="服务器Id" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"目标用户名"} >
                                {getFieldDecorator('playerName', {
                                    // rules: [{ required: true, message: '请输入目标用户名!' }],
                                })(
                                    <Input placeholder="目标用户名" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" md={12}>
                            <FormItem {...formItemLayout} label={"礼品内容"} >
                                {getFieldDecorator('giftContent', {
                                    // rules: [{ required: true, message: '请输入礼品内容!' }],
                                })(
                                    <Input placeholder="礼品内容" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"有效时间"} >
                                {getFieldDecorator('duration', {
                                    // rules: [{ required: true, message: '请输入有效时间!' }],
                                })(
                                    <Input placeholder="有效时间" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"礼包的名称"} >
                                {getFieldDecorator('title', {
                                    // rules: [{ required: true, message: '请输入礼包的名称!' }],
                                })(
                                    <Input placeholder="礼包的名称" />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" md={12} sm={12}>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="button" onClick={this.getPackageItemList}>获取礼包信息列表</Button>
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" md={12} sm={12}>
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">发送礼包</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Card>
                <Table pagination={{ pageSize: 10 }} columns={this.columns} dataSource={giftPackageItemsData} size={'small'} />
            </Card>
        </div >;
    }
}

export default Form.create()(GiftPackage);
