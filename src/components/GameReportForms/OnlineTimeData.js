import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
import { isNotExpired, setOnlineTimeData } from '../../utils/cache';
import moment from 'moment';
/**
 * 查询指定区服指定日期的在线时长统计
 */
class OnlineTimeData extends React.Component {
    state = {
        yxList:[{key:'1',yx:'渠道1'},{key:'2',yx:'渠道2'}],
        serviceList:[
            {yx: "aa", serverId: 10000, serverName: "sg_banshu1", serverState: 0},
            {yx: "ab", serverId: 20000, serverName: "sg_banshu2", serverState: 1},
            {yx: "ab", serverId: 30000, serverName: "sg_banshu3", serverState: 0},
        ],
        onlineTimeReports:[],  //运营日报数据
        serverId:'',
        yx:''
    }
    componentWillMount() {
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res});
        })

        let {onlineTimeYx, onlineTimeServerId, onlineTimeStartDayStr, onlineTimeEndDayStr}=localStorage;
        let yx, serverId, startDayStr, endDayStr;
        yx=onlineTimeYx; 
        serverId=onlineTimeServerId; 
        startDayStr=onlineTimeStartDayStr;
        endDayStr=onlineTimeEndDayStr;
        this.setInputValue(yx, serverId, startDayStr, endDayStr);
    }

    //自动填充表单值
    setInputValue=(yx, serverId, startDayStr, endDayStr)=>{
        let expireTime =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime)){//localSorate信息没有过期，为表单填充已经存在的值
            yx&&this.props.form.setFieldsValue({yx: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId: `${serverId}`});
            startDayStr&&this.props.form.setFieldsValue({startDayStr: moment(`${startDayStr}`)});
            endDayStr&&this.props.form.setFieldsValue({endDayStr: moment(`${endDayStr}`)});

            if(yx&&serverId&&startDayStr&&endDayStr){
                this.requestSearch(yx, serverId,startDayStr, endDayStr);
            }
        }
    }
 
    getYxList=(data)=>{//获取渠道列表
        getYxList(data,(yxList)=>{
         this.setState({yxList:yxList});
        });
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
                let { yx, serverId, startTime, endTime, dayStr} = values;
                startTime=startTime.format('YYYY-MM-DD');
                endTime=endTime.format('YYYY-MM-DD');
                this.requestSearch(yx, serverId, startTime, endTime);
            }
        });
    }

    requestSearch=(yx, serverId,startDayStr, endDayStr)=>{
        let { onlineTimeReports } = this.state;
        let querystring = `yx=${yx}&serverId=${serverId}&startTime=${startDayStr}&endTime=${endDayStr}`;
        let url = "/root/getOnlineTimeData.action";
        let method = 'POST';
        let successmsg = '查询成功';
        apiFetch(url, method, querystring, successmsg, (res) => {
            let onlineTimeReports = res.data.onlineTimeReports;
            this.setState({onlineTimeReports:onlineTimeReports});
            //请求成功后设置localStorage
            setOnlineTimeData(yx, serverId,startDayStr, endDayStr);
        });
    }

    onServerChange=(value)=>{
        this.setState({serverId:value})
    }

    onYxChange=(value)=>{
        this.setState({yx:value})
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { serviceList, yxList, onlineTimeReports } = this.state;
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

        const columns = [
            {
                title: ' 日期',
                dataIndex: 'dayStr',
            },
            {
                title: '登陆人数',
                dataIndex: 'count',
            },
            {
                title: '总在线时长(秒)',
                dataIndex: 'onlineTime',
            },
            {
                title: '总在线时长',
                dataIndex: 'countTimeStr',
            },
            {
                title: '平均在线时长(秒)',
                dataIndex: 'eachOnlineTime',
            },
            {
                title: '平均在线时长',
                dataIndex: 'eachOnlineTimeStr',
            },
        ];

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
                                    <DatePicker showTime format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="终止时间"
                                >
                                {getFieldDecorator('endTime', {
                                    rules: [{ type: 'object', required: true, message: '请选择终止时间!' }]})(
                                    <DatePicker showTime format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">查询</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
            <Card title="运营日报列表" id="onlineTimeReports" style={{ minHeight: 680 }} >
                <Table rowKey="dayStr" columns={columns} dataSource={onlineTimeReports} size="small" />
            </Card>
        </div >;
    }
}

export default Form.create()(OnlineTimeData);
