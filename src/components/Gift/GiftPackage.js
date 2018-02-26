import React from 'react';
import { Card, Form, Tooltip, Cascader, Select, Checkbox, Button, message, Icon } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { Row, Col } from 'antd';
import { Input } from 'antd';
import { Table } from 'antd';

class GiftPackage extends React.Component {
    state = {
        key: 1,
        giftPackageItemsData: [
            { key: '0', type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
            { key: '1', type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
            { key: '2', type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
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
    componentWillMount() {
        this.getPackageItemList(
            (res) => {
                //获取数据，处理，并放入state中，以待显示
                // console.log("获取的pckage数据为:", res)
            }
        );
    }
    // getPackageItem=()=>{
    //     this.getPackageItemList(
    //         (res)=>{
    //             console.log("回调函数:", res)
    //     })
    // }
    getPackageItemList = () => { //获取权限列表
        message.info('从这里获取权限列表');
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
                        throw new Error('error')
                    }
                    return res.json()
                })
                    .then(res => {
                        console.log("获取的pckage数据为:", res)
                        let { giftPackageItemsData, key } = this.state;
                        giftPackageItemsData = [];
                        let items = res.items;
                        console.log("获取的pckage数据为:", items);
                        for (let i = 0; i < items.length; i++) {
                            let data = items[i]
                            let tableItem = Object.assign(data, { key: key });
                            giftPackageItemsData.push(tableItem);
                            key = key + 1;
                        }
                        console.log("giftPackageItemsData:", giftPackageItemsData);
                        this.setState({ giftPackageItemsData: giftPackageItemsData, key: key + 1 }, () => {
                            console.log("herere:")
                        })
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
    }

    handleSubmit = (e) => {
        console.log("e:", e.target.id)
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let { giftType, serverId, playerName, giftContent, duration, title } = values;
                const querystring = `giftType=${giftType}&serverId=${serverId}&playerName=${playerName}&giftContent=${giftContent}&duration=${duration}&title=${title}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/sendGift.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    console.log('res:', res)
                    if (res.status !== 200) {
                        throw new Error('失败')
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
                    })
                    .catch(err => {
                        message.info('失败')
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
                                    // rules: [{ required: true, message: '目标用户名!' }],
                                })(
                                    <Input placeholder="目标用户名" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" md={12}>
                            <FormItem {...formItemLayout} label={"礼品内容"} >
                                {getFieldDecorator('giftContent', {
                                    // rules: [{ required: true, message: '礼品内容!' }],
                                })(
                                    <Input placeholder="礼品内容" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"有效时间"} >
                                {getFieldDecorator('duration', {
                                    // rules: [{ required: true, message: '有效时间!' }],
                                })(
                                    <Input placeholder="有效时间" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"礼包的名称"} >
                                {getFieldDecorator('title', {
                                    // rules: [{ required: true, message: '礼包的名称!' }],
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
