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
class BanAndLift extends React.Component {
    state = {
        value1: 1,
        value2: 1,
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
     * 封禁玩家
     */
    handleButtonClick = (e) => { //获取权限列表
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { playerName, serverId, reason, duration } = values;
            let querystring = `playerName=${playerName}&serverId=${serverId}&reason=${reason}&duration=${duration}`
            let url = "/root/banUser.action"
            let method = 'POST'
            let successmsg = '封禁角色成功'
            apiFetch(url, method, querystring, successmsg, (res) => {

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
                let querystring = `playerName=${playerName}&serverId=${serverId}`
                let url = "/root/unbanUser.action"
                let method = 'POST'
                let successmsg = '解除封禁成功'
                apiFetch(url, method, querystring, successmsg, (res) => {

                })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { serviceList } = this.state;
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
                                    <Input placeholder="请输入服务器Id" />
                                )}
                            </FormItem> */}

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
