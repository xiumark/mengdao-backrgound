import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch, apiFetchNomsg } from '../../api/api'
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
        isBlocked:false,
        reason:'',
        endTime:''
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
            let { playerName, serverId, reason='', duration='' } = values;
            let querystring = `playerName=${playerName}&serverId=${serverId}&reason=${reason}&duration=${duration}`
            let url = "/root/banUser.action"
            let method = 'POST'
            // let successmsg = '封禁角色成功'
            let successmsg = (reason!==''&&duration!=='')?'封禁成功':'请填写原因和期限'
            apiFetch(url, method, querystring, successmsg, (res) => {
                this.queryState(e);
            })
        })
    }

    queryState=(e,successmsg)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { serverId, playerName} = values;
            let querystring = `serverId=${serverId}&playerName=${playerName}`
            let url = "/root/playerInfo.action"
            let method = 'POST'
            // let successmsg = '查询成功'
            apiFetchNomsg(url, method, querystring, successmsg, (res) => {
                console.log("state:", res);
                let blockInfo = res.data.blockInfo;
                console.log("blockInfo:", blockInfo);
                this.setState({isBlocked:blockInfo.isBlocked, reason:blockInfo.reason, endTime:blockInfo.endTime}, ()=>{console.log("33333333")});
            });
        })
    }

    /**
     * 解禁玩家
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { playerName, serverId ,reason, duration} = values;
                //serverId可不填
                let querystring = `playerName=${playerName}&serverId=${serverId}`
                let url = "/root/unbanUser.action"
                let method = 'POST'
                let successmsg ='解除封禁成功'
                apiFetch(url, method, querystring, successmsg, (res) => {
                    this.queryState(e);
                })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { serviceList, isBlocked,reason,endTime } = this.state;
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
                    <Card >
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form onSubmit={this.handleSubmit}>

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
                            <FormItem {...formItemLayout} label={"角色名"} >
                                {getFieldDecorator('playerName', {
                                    rules: [{ required: true, message: '请输入角色名' }],
                                })(
                                    <Input placeholder="请输入角色名" />
                                )}
                            </FormItem>
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
                            {/* <FormItem {...formItemLayout} label={"服务器Id"}>
                                {getFieldDecorator('serverId', {
                                    rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="请输入服务器Id" />
                                )}
                            </FormItem> */}
                            <Row>
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" onClick={this.queryState}>查询状态</Button>
                                    </FormItem>
                                </Col>  
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" disabled={!isBlocked} htmlType="submit">解除封禁</Button>
                                    </FormItem>
                                </Col>
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" disabled={isBlocked} onClick={this.handleButtonClick}>封禁</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col className="gutter-row" md={12}>
                    <Card title='角色状态:'>
                        <FormItem {...formItemLayout}>
                                {getFieldDecorator('mailContent', {
                                    // rules: [{ required: true, message: '请输入滚动次数' }],
                                })(
                                    <div style={{ minHeight:230, width: "100%" }} placeholder="显示角色状态" >
                                        <div>
                                            <label>是否被禁：<span>{isBlocked?"被禁":"未被禁"}</span></label>
                                        </div>
                                        <div>
                                            <label>被禁原因：<span>{`${reason}`}</span></label>
                                        </div>
                                        <div>
                                            <label>截止时间：<span>{endTime}</span></label>
                                        </div>
                                    </div>
                                )}
                        </FormItem>
                    </Card>
                </Col>
            </Row>
        </div >;
    }
}
export default Form.create()(BanAndLift);
