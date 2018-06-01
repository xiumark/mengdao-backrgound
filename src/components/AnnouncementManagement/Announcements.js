import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
import { isNotExpired, setAnnouncementData } from '../../utils/cache';
/**
 * 测试用
 */
class Announcements extends React.Component {
    state = {
        value1: 1,
        value2: 1,
        serviceList: [
            {yx:'渠道1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
            {yx:'渠道1', serverId: "2", serverName: "sg_dev", serverState: 0 },
            {yx:'渠道2', serverId: "90002", serverName: "sg_90002", serverState: 0 }
        ],

        filteredServiceList: [
            {yx:'渠道1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
            {yx:'渠道1', serverId: "2", serverName: "sg_dev", serverState: 0 },
        ],

        yxList:[
            {yx:'渠道1' ,key:1},
            {yx:'渠道2' ,key:1},
        ],
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        });

        //根据缓存，填充表单数据
        let {announcementYx, announcementServerId, announcementNoticeType, 
            announcementDuration, announcementTimes, announcementContent}=localStorage;
        let yx, serverId, noticeType, duration, times, content;
        yx=announcementYx; 
        serverId=announcementServerId;
        noticeType=announcementNoticeType; 
        duration=announcementDuration;
        times=announcementTimes;
        content=announcementContent;
        this.setInputValue(yx, serverId, noticeType, duration, times, content);
    }

    setInputValue=(yx, serverId, noticeType, duration, times, content)=>{
        let expireTime =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime)){
            yx&&this.props.form.setFieldsValue({yx: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId: `${serverId}`});
            noticeType&&this.props.form.setFieldsValue({noticeType: `${noticeType}`});
            duration&&this.props.form.setFieldsValue({duration: `${duration}`});
            times&&this.props.form.setFieldsValue({times: `${times}`});
            content&&this.props.form.setFieldsValue({content: `${content}`});
        }
    }
     
    onYxChange=(value)=>{//渠道列表变换引起服务列表更新
        const{serviceList} = this.state;
        let filteredServiceList = serviceList.filter((item, index)=>{
            return item.yx===value;
        });
        this.setState({filteredServiceList:filteredServiceList});
    }

    getYxList=(data)=>{//获取渠道列表
       getYxList(data,(yxList)=>{
        this.setState({yxList:yxList});
       });
    }

    
    handleButtonClick = (e) => { //更新公告内容
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let { content } = values;
        })
        let querystring = `content=${content.value}`
        let url = "/root/setUpdateNotice.action"
        let method = 'POST'
        let successmsg = '更新公告内容成功'
        apiFetch(url, method, querystring, successmsg, (res) => {

        })
    }

    handleSubmit = (e) => {//发布公告
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { yx, serverId, noticeType, duration, times, content } = values;
                //serverId可不填
                this.requestSearch(yx, serverId, noticeType, duration, times, content)
            }
        });
    }

    requestSearch=(yx, serverId, noticeType, duration, times, content)=>{
        let querystring = `yx=${yx}&serverId=${serverId}&noticeType=${noticeType}&duration=${duration}&times=${times}&content=${content}`
        let url = "/root/sendNotice.action"
        let method = 'POST'
        let successmsg = '发送公告成功'
        apiFetch(url, method, querystring, successmsg, (res) => {
            //数据请求成功后设置缓存
            setAnnouncementData(yx, serverId, noticeType, duration, times, content);
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {filteredServiceList, yxList} = this.state;
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
            <Card title="发送系统公告">
                <Row>

                    <Col className="gutter-row" md={11}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label="渠道" >
                                {getFieldDecorator('yx', {
                                    rules: [
                                        { required: true, message: '请选择渠道' },
                                    ],
                                })(
                                    <Select placeholder="请选择渠道" onChange = {(value)=>this.onYxChange(value)}>
                                        {yxList.map((item, index) => {
                                            return <Option key={index} value={`${item.yx}`}>{item.yx}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="服务器名称" >
                                {getFieldDecorator('serverId', {
                                    rules: [
                                        { required: true, message: '请选择服务器名称' },
                                    ],
                                })(
                                    <Select placeholder="选择服务器名称">
                                        {filteredServiceList.map((item, index) => {
                                            return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="公告类型">
                                {getFieldDecorator('noticeType', {
                                    rules: [
                                        { required: true, message: '请选择公告类型!' },
                                    ],
                                })(
                                    <Select placeholder="请选择公告类型">
                                        <Option value="1">公告类型1</Option>
                                    </Select>
                                )}
                            </FormItem>

                            {/* <FormItem {...formItemLayout} label={"服务器Id"}>
                                {getFieldDecorator('serverId', {
                                    // rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="服务器Id" />
                                )}
                            </FormItem> */}
                            <FormItem {...formItemLayout} label={"公告持续时间"}>
                                {getFieldDecorator('duration', {
                                    rules: [{ required: true, message: '请输入公告持续时间（分钟）' }],
                                })(
                                    <Input placeholder="公告持续时间（分钟）" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"滚动次数"}>
                                {getFieldDecorator('times', {
                                    rules: [{ required: true, message: '请输入滚动次数' }],
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
                                rules: [{ required: true, message: '请输入公告内容' }],
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
