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
class WordsBlock extends React.Component {
    state = {
        value1: 1,
        value2: 1,
        serviceList: [
            { serverId: "1", serverName: "sg_banshu", serverState: 0 },
            { serverId: "2", serverName: "sg_dev", serverState: 0 },
            { serverId: "90002", serverName: "sg_90002", serverState: 0 }
        ],
        // silenceInfo:{
        isSilenced:false,
        reason:'',
        endTime:''
        // },
    }

    /**
     * 禁言玩家
     */
    handleButtonClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { serverId, playerName, reason, duration } = values;
            let querystring = `serverId=${serverId}&playerName=${playerName}&reason=${reason}&duration=${duration}`
            let url = "/root/banChat.action"
            let method = 'POST'
            // let successmsg = '禁言成功'
            let successmsg = reason!==undefined&&duration!==undefined?'封禁成功':'请填写原因和期限'
            apiFetch(url, method, querystring, successmsg, (res) => {
                this.queryState(e,successmsg);
            })
        })
    }

    queryState=(e,successmsg)=>{
        // e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { serverId, playerName} = values;
            let querystring = `serverId=${serverId}&playerName=${playerName}`
            let url = "/root/playerInfo.action"
            let method = 'POST'
            // let successmsg = '查询成功'
            apiFetch(url, method, querystring, successmsg, (res) => {
                console.log("state:", res);
                let silenceInfo = res.data.silenceInfo;
                console.log("silenceInfo:", silenceInfo);
                
                // const {isSilenced, reason, endTime} = this.state.silenceInfo;
                this.setState({isSilenced:silenceInfo.isSilenced, reason:silenceInfo.reason, endTime:silenceInfo.endTime}, ()=>{console.log("33333333")});
            });
        })

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
     * 解除禁言
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { serverId, playerName, reason, duration } = values;
                let querystring = `serverId=${serverId}&playerName=${playerName}`
                let url = "/root/unbanChat.action"
                let method = 'POST'
                let successmsg = '解除禁言成功'
                apiFetch(url, method, querystring, successmsg, (res) => {
                    this.queryState(e,successmsg);
                })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { serviceList, isSilenced,reason,endTime } = this.state;
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
                        <Form onSubmit={this.handleSubmit} style={{ minHeight:302, width: "100%" }}>

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
                                        <Button type="primary" htmlType="submit"  onClick={this.queryState}>查询状态</Button>
                                    </FormItem>
                                </Col>  
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" disabled={!isSilenced} htmlType="submit">解除禁言</Button>
                                    </FormItem>
                                </Col>
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" disabled={isSilenced} onClick={this.handleButtonClick}>禁言</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            {/* <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">解除禁言</Button>
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" onClick={this.handleButtonClick}>禁言</Button>
                            </FormItem> */}
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
                                            <label>是否被禁：<span>{isSilenced?"被禁":"未被禁"}</span></label>
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
export default Form.create()(WordsBlock);
