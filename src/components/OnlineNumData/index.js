import React, { Component } from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
import LineArea from './Components/LineArea';
import './index.less';
import { isNotExpired, setOlineStorage } from '../../utils/cache';
import moment from 'moment';

class OnlineNumData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onlineNumList:[
                // {
                //     "time": "2018-04-19 00:05:00",   // 时间标识
                //     "onlineNum":1	             // 在线人数
                // },
            ],
            yxList:[{key:'1',yx:'渠道1'},{key:'2',yx:'渠道2'}],
            serviceList:[
                {yx: "aa", serverId: 10000, serverName: "sg_banshu1", serverState: 0},
                {yx: "ab", serverId: 20000, serverName: "sg_banshu2", serverState: 1},
                {yx: "ab", serverId: 30000, serverName: "sg_banshu3", serverState: 0},
            ],
            serverId:'',
            yx:''
        }
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res});
        })

        let {olineYx, olineServerId, olineStartTime, olineEndTime}=localStorage;
        let yx, serverId, startTime, endTime;
        yx=olineYx; serverId=olineServerId; startTime=olineStartTime; endTime=olineEndTime;
        this.setInputValue(yx, serverId, startTime, endTime);
    }
     
    //自动填充表单值
    setInputValue=(yx, serverId, startTime, endTime)=>{
        let expireTime =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime)){//localSorate信息没有过期，为表单填充已经存在的值
            yx&&this.props.form.setFieldsValue({yx: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId: `${serverId}`});
            startTime&&this.props.form.setFieldsValue({startTime: moment(`${startTime}`)});
            endTime&&this.props.form.setFieldsValue({endTime: moment(`${endTime}`)});

            //设置成功后，如果数据是全的，请求后台数据一次
            if(yx&&serverId&&startTime&&endTime){
                this.requestSearch(yx, serverId, startTime, endTime)
            }
        }
    }

    getYxList=(data)=>{//获取渠道列表
        getYxList(data,(yxList)=>{
         this.setState({yxList:yxList});
        });
    }

    onServerChange=(value)=>{
        this.setState({serverId:value})
    }

    onYxChange=(value)=>{
        this.setState({yx:value})
    }

    onClick = (item)=>{
        this.setState({vidname:item.name,giftVid:item.vid});
        this.props.form.setFieldsValue({
            vidname: item.name,
          });
    }

    /**
     * 查询指定时间段的运营日报
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { yx, serverId, startTime, endTime} = values;
                startTime=startTime.format('YYYY-MM-DD HH:mm:ss');
                endTime=endTime.format('YYYY-MM-DD HH:mm:ss');
                this.requestSearch(yx, serverId, startTime, endTime);
            }
        });
    }

    requestSearch=(yx, serverId, startTime, endTime)=>{
        let { onlineNumList } = this.state;
            let querystring = `yx=${yx}&serverId=${serverId}&startTime=${startTime}&endTime=${endTime}`;
            let url = "/root/getOnlineNumData.action";
            let method = 'POST';
            let successmsg = '查询成功';
            apiFetch(url, method, querystring, successmsg, (res) => {
                let onlineNumList = res.data.onlineNumList;
                this.setState({onlineNumList:onlineNumList});

            //请求成功后设置localStorage
            setOlineStorage(yx, serverId, startTime, endTime);
            });
    }

    render() {
        let { yxList, serviceList, onlineNumList } = this.state
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
            <Card title="">
                <Row>
                    <Col className="gutter-row" md={12} sm={24}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label="渠道" >
                                {getFieldDecorator('yx', {
                                    rules: [
                                        { required: true, message: '请选择渠道' },
                                    ],
                                })(
                                    <Select placeholder="请选择渠道" onChange = {(value)=>this.onYxChange(value)}>
                                        {yxList.map((item, index) => {
                                            return <Option key={item.key} value={`${item.yx}`}>{item.yx}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="服务器" >
                                {getFieldDecorator('serverId', {
                                    rules: [
                                        { required: true, message: '请选择服务器' },
                                    ],
                                })(
                                    <Select placeholder="请选择服务器" onChange = {(value)=>this.onServerChange(value)}>
                                        {serviceList.map((item, index) => {
                                            return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="起始时间"
                                >
                                {getFieldDecorator('startTime', {
                                    rules: [{ type: 'object', required: true, message: '请选择起始时间!' }]})(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="终止时间"
                                >
                                {getFieldDecorator('endTime', {
                                    rules: [{ type: 'object', required: true, message: '请选择终止时间!' }]})(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">查询</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
            <Card title="在线人数" style={{ minHeight: 380,height:500 }} >
                {/*  class="lampEnergyBox" */}
                <LineArea id="onlineNumData" data={onlineNumList} />    
            </Card>
        </div>
    }

}

export default Form.create()(OnlineNumData);

