import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch, apiFetchNomsg } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service'
/**
 * 测试用
 */
class WordsBlock extends React.Component {
    state = {
        value1: 1,
        value2: 1,
        serviceList: [
            {yx:'版署1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
            {yx:'版署1', serverId: "2", serverName: "sg_dev", serverState: 0 },
            {yx:'版署2', serverId: "90002", serverName: "sg_90002", serverState: 0 }
        ],

        filteredServiceList: [
            {yx:'版署1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
            {yx:'版署1', serverId: "2", serverName: "sg_dev", serverState: 0 },
        ],

        yxList:[
            {yx:'版署1' ,key:1},
            {yx:'版署2' ,key:1},
        ],
        isSilenced:false,
        reason:'',
        endTime:''
    }

    /**
     * 禁言玩家
     */
    silence = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { serverId, playerName, reason='', duration='' } = values;
            let querystring = `serverId=${serverId}&playerName=${playerName}&reason=${reason}&duration=${duration}`
            let url = "/root/banChat.action"
            let method = 'POST';
            let successmsg = (reason!==''&&duration!=='')?'禁言成功':'请填写原因和期限';
            apiFetch(url, method, querystring, successmsg, (res) => {
                this.queryState(e);
            })
        })
    }

    queryState=(e)=>{
        // e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { serverId, playerName} = values;
            let querystring = `serverId=${serverId}&playerName=${playerName}`
            let url = "/root/playerInfo.action"
            let method = 'POST'
            let successmsg = undefined
            apiFetchNomsg(url, method, querystring, successmsg, (res) => {
                let silenceInfo = res.data.silenceInfo;
                this.setState({isSilenced:silenceInfo.isSilenced, reason:silenceInfo.reason, endTime:silenceInfo.endTime});
            });
        })

    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        })
    }

    onYxChange=(value)=>{//版署列表变换引起服务列表更新
        const{serviceList} = this.state;
        let filteredServiceList = serviceList.filter((item, index)=>{
            return item.yx===value;
        });
        this.setState({filteredServiceList:filteredServiceList});
    }

    getYxList=(data)=>{//获取版署列表
       getYxList(data,(yxList)=>{
        this.setState({yxList:yxList});
       });
    }

    /**
     * 解除禁言
     */
    unSilence = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { serverId, playerName, reason='', duration='' } = values;
                let querystring = `serverId=${serverId}&playerName=${playerName}`
                let url = "/root/unbanChat.action"
                let method = 'POST'
                let successmsg = '解除禁言成功'
                apiFetch(url, method, querystring, successmsg, (res) => {
                    this.queryState(e);
                })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {filteredServiceList, yxList} = this.state;
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
                        {/* <Form layout="inline" onSubmit={this.unSilence}> */}
                        <Form  style={{ minHeight:302, width: "100%" }}>
                            <FormItem {...formItemLayout} label="版署" >
                                {getFieldDecorator('yx', {
                                    rules: [
                                        { required: true, message: '请选择版署' },
                                    ],
                                })(
                                    <Select placeholder="请选择版署" onChange = {(value)=>this.onYxChange(value)}>
                                        {yxList.map((item, index) => {
                                            return <Option key={index} value={`${item.yx}`}>{item.yx}</Option>
                                        })}
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
                                        {filteredServiceList.map((item, index) => {
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
                            <Row>
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit"  onClick={this.queryState}>查询状态</Button>
                                    </FormItem>
                                </Col>  
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" disabled={!isSilenced} htmlType="submit" onClick={this.unSilence} >解除禁言</Button>
                                    </FormItem>
                                </Col>
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" disabled={isSilenced} onClick={this.silence}>禁言</Button>
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
