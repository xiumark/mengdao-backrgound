import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, Radio, DatePicker, TimePicker, Popconfirm  } from 'antd';
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { isNotExpired, setGiftCreateData, setActivityManageData } from '../../utils/cache';

const buttonStyle = {
    margin: '10px',
    marginLeft:'0px',
    width: '40px',
};
const buttonAddStyle = {
    margin: '10px',
    marginLeft:'0px',
    width: '80px',
};
const pStyle={
    paddingTop: '6px',
};
const flex = {
    display:"flex",
};

class ActivityManage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            optionValue:'0',
            isPersonal:false,
            key1: 1,
            key2: 1,
            allActivityIdsItemsData: [
                {
                    "activityId": 1001,            // 活动的id
                    "activityName":"活动名称" ,    // 活动名称
                }
            ],

            curActiveActivitiesItemsData: [
                {
                    "activityId": 1001,            // 活动的id
                    "activityName":"活动名称" ,    // 活动名称
                    "startTime":"2016-06-20 00:00:00" ,    // 活动开启时间
                    "endTime":"2016-06-20 23:59:59" ,    // 活动结束时间
                },
            ],

            activityToAdd:
            {
                "activityId": 1001,            // 活动的id
                "activityName":"活动名称" ,    // 活动名称
                "startTime":"2016-06-20 00:00:00" ,    // 活动开启时间
                "endTime":"2016-06-20 23:59:59" ,    // 活动结束时间
            },

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
                // {yx:'渠道1' ,key:1},
                // {yx:'渠道2' ,key:1},
            ],
            yx:'',
            serverId:''
        };
        this.columnsAll = [
            {
                title: 'ID',
                dataIndex: 'activityId',
                key: 'activityId',
            },
            {
                title: '活动名称',
                dataIndex: 'activityName',
                key: 'activityName',
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key:'handle',
                width: '15%',
                render: (textValue, tableItem) => this.renderColumns(textValue, tableItem, 'handle'),
            },
        ];
        this.columnsCur = [
            {
                title: 'ID',
                dataIndex: 'activityId',
                key: 'activityId',
            },
            {
                title: '活动名称',
                dataIndex: 'activityName',
                key: 'activityName',
            },
            {
                title: '活动开启时间',
                dataIndex: 'startTime',
                key: 'startTime',
            },
            {
                title: '活动结束时间',
                dataIndex: 'endTime',
                key: 'endTime',
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key:'handle',
                width: '15%',
                // render: (textValue, tableItem) => this.renderColumnsDelete(textValue, tableItem, 'handle'),
                render: (textValue, tableItem) => {
                    return (
                        <Popconfirm title="删除这项活动?" onConfirm={() => this.renderColumnsDelete(textValue, tableItem, 'handle')}>
                          <a href="javascript:;">删除活动</a>
                        </Popconfirm>
                    );
                  },
            },
        ];
        this.renderColumns = this.renderColumns.bind(this);
        this.renderColumnsDelete = this.renderColumnsDelete.bind(this);
        this.chooseActivity = this.chooseActivity.bind(this);
        this.onServerChange = this.onServerChange.bind(this);
        this.deleteActivity = this.deleteActivity.bind(this);
    }

    renderColumnsDelete(text, tableItem, index){
        this.deleteActivity(text, tableItem, index);
        // return (
        //     <div><button onClick ={(event) => this.deleteActivity(event, tableItem, index)}>删除活动</button></div>
        // );
    }

    deleteActivity(event, tableItem, index){
        let yx = this.state.yx;
        let serverId = this.state.serverId;
        let activityId = tableItem.activityId;
        this.removeActivity(yx, serverId, activityId)
    }

    renderColumns(textValue, tableItem, column) {
        return (
            <div><button onClick ={(event) => this.chooseActivity(event, tableItem, column)}>选择活动</button></div>
        );
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        })
        //根据缓存，填充表单数据
        let {activityManageYx, activityManageServerId}=localStorage;
        let yx, serverId;
        yx=activityManageYx; 
        serverId=activityManageServerId;
        this.setInputValue(yx, serverId);
    }

    setInputValue=(yx, serverId)=>{
        let expireTime2 =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime2)){
            yx&&this.props.form.setFieldsValue({yx: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId: `${serverId}`});
            if(yx&&serverId){
                this.getAllActivityIds(yx,serverId);  //获取可配置的活动信息
                this.getCurActiveActivities(yx,serverId);  //获取已配置的活动信息
                this.setState({yx:yx,serverId:serverId}); 
            }
        }
    }

    onYxChange=(value)=>{//渠道列表变换引起服务列表更新
        const{serviceList} = this.state;
        let filteredServiceList = serviceList.filter((item, index)=>{
            return item.yx===value;
        });
        this.setState({filteredServiceList:filteredServiceList, yx:value});
    }

    getYxList=(data)=>{//获取渠道列表
        getYxList(data,(yxList)=>{
         this.setState({yxList:yxList});
        });
     }

    chooseActivity(event, tableItem, column){
        this.setState({activityToAdd:tableItem},()=>{
            this.props.form.setFieldsValue({activityName:`${tableItem.activityName}`})
        });
    }

    onServerChange(serverId){
        let {yx} = this.state;
        this.setState({serverId:serverId},()=>{
        this.getAllActivityIds(yx,serverId);
        this.getCurActiveActivities(yx,serverId);
    })
    }

    onStartTimeChange=(date)=>{
        let dd =  date.format('YYYY-MM-DD HH:mm:ss')
        const { startTime } = this.props.form;
        // debugger
        let startTimeStr = this.formatStartTime(date);
        setTimeout(()=>this.props.form.setFieldsValue({startTime: moment(startTimeStr)}),100);
    }

    onEndTimeChange=(date)=>{
        // debugger;
        const { endTime } = this.props.form;
        let endTimeStr = this.formatEndTime(date);
        setTimeout(()=>this.props.form.setFieldsValue({endTime: moment(endTimeStr)}),100);
    }


 //格式化到：00:00:00
    formatStartTime=(startTime)=>{
        let timeStart = (new Date(startTime)).getTime();
        let timeStartF = parseInt(timeStart/86400000)*86400000-8*3600*1000   //00:00:00
        let startTimeResult = new Date(timeStartF)
        let startTimeR=moment(startTimeResult).format('YYYY-MM-DD HH:mm:ss');  
        return startTimeR;
    }

//格式化到：59:59:59
    formatEndTime=(endTime)=>{
        let timeEnd = (new Date(endTime)).getTime();
        let timeEndF = parseInt(timeEnd/86400000+1)*86400000-8*3600*1000-1000   //59:59:59
        let endTimeResult = new Date(timeEndF)
        let endTimeR=moment(endTimeResult).format('YYYY-MM-DD HH:mm:ss'); 
        return endTimeR;
    }
    /**
     * 获取可配置的活动列表
     */
    getAllActivityIds = (yx,serverId)=>{ 
        const querystring = `serverId=${serverId}&yx=${yx}`
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        fetch(`/root/getAllActivityIds.action`, {
            credentials: 'include', //发送本地缓存数据
            method: 'POST',
            headers: {
                headers
            },
            body: querystring
        }).then(res => {
            if (res.status !== 200) {
                throw new Error('获取可配置的活动信息失败')
            }
            return res.json()
        })
            .then(res => {
                let { allActivityIdsItemsData } = this.state;
                allActivityIdsItemsData = [];
                let items = res.data.activityIds;
                if (!items) {
                    throw new Error('获取可配置的活动信息失败')
                }
                message.info("成功获取可配置的活动信息")
                for (let i = 0; i < items.length; i++) {
                    let data = items[i]
                    let tableItem = Object.assign(data, { key: i});
                    allActivityIdsItemsData.push(tableItem);
                }
                this.setState({ allActivityIdsItemsData: allActivityIdsItemsData }, () => {
                })
            }).catch(err => {
                message.error(err.message ? err.message : '未知错误');
                this.setState({ allActivityIdsItemsData:[]});
            })
    }    

    /**
     * 获取已配置的活动列表
     */
    getCurActiveActivities = (yx,serverId) => { 
                const querystring = `serverId=${serverId}&yx=${yx}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/curActiveActivities.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    if (res.status !== 200) {
                        throw new Error('获取已配置的活动信息失败')
                    }
                    return res.json()
                })
                    .then(res => {
                        let activities = res.data.activities;
                        if (!activities) {
                            if(activities.length==0){
                                throw new Error('尚无已配置的活动')
                            }else{
                                throw new Error('获取已配置活动信息失败')
                            }
                        }
                        message.info("成功获取已配置的活动信息")
                        this.setState({ curActiveActivitiesItemsData: activities }, () => {
                        })
                    }).catch(err => {
                        message.error(err.message ? err.message : '未知错误');
                        this.setState({ curActiveActivitiesItemsData:[]});
                    })
    }

    openActivity = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {yx, serverId, startTime, endTime} = values;
                // debugger

                // let timeStart = (new Date(startTime)).getTime();
                // let timeStartF = parseInt(timeStart/86400000)*86400000-8*3600*1000   //00:00:00
                // let startTimeResult = new Date(timeStartF)
                // startTime=moment(startTimeResult).format('YYYY-MM-DD HH:mm:ss');  


                // let timeEnd = (new Date(endTime)).getTime();
                // endTime=moment(new Date((timeEnd%86400000+1)*86400000-1));


                // let timeEnd = (new Date(endTime)).getTime();
                // let timeEndF = parseInt(timeEnd/86400000+1)*86400000-8*3600*1000-1000   //59:59:59
                // let endTimeResult = new Date(timeEndF)
                // endTime=moment(endTimeResult).format('YYYY-MM-DD HH:mm:ss');  


                let activityId = this.state.activityToAdd.activityId;
                startTime=startTime.format('YYYY-MM-DD HH:mm:ss');  
                endTime=endTime.format('YYYY-MM-DD HH:mm:ss');  
                this.createActivity(yx, serverId, startTime, endTime, activityId);  //请求开启活动
            }
        });
    }

    /**
     * 开启活动开启活动
     */
    createActivity=(yx, serverId, startTime, endTime, activityId)=>{   
        const querystring = `yx=${yx}&serverId=${serverId}&startTime=${startTime}&endTime=${endTime}&activityId=${activityId}`
        let url = "/root/createActivity.action"
        let method = 'POST'
        let successmsg = '成功开启活动'
        apiFetch(url, method, querystring, successmsg, (res) => {
            //如果请求成功，1.再次请求已配置数据；2.设置缓存
            this.getCurActiveActivities(yx, serverId);
            setActivityManageData(yx, serverId);
        })
    }

    /**
     * 刪除活动  
     */
    removeActivity = (yx, serverId, activityId)=>{   
        const querystring = `yx=${yx}&serverId=${serverId}&activityId=${activityId}`
        let url = "/root/removeActivity.action"
        let method = 'POST'
        let successmsg = '成功删除活动'
        apiFetch(url, method, querystring, successmsg, (res) => {
            //重新请求后台数据,更新已配置活动数据
            this.getCurActiveActivities(yx, serverId);
        })
    }

    render() {
        const {filteredServiceList, yxList, allActivityIdsItemsData, curActiveActivitiesItemsData} = this.state;
        const { getFieldDecorator } = this.props.form;
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
            <Row>
                <Col className="gutter-row" md={12}>
                    <Card title="活动开启">
                        <Form id="createActivity">
                            <Row>
                                <Col className="gutter-row">
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
                                            <Select placeholder="请选择服务器名称" onChange={(value)=>this.onServerChange(value)}>
                                                {filteredServiceList.map((item, index) => {
                                                    return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label={"活动名称"} >
                                        {getFieldDecorator('activityName', {
                                            rules: [{ required: true, message: '请从右边列表选择活动' }],
                                        })(
                                            <Input placeholder="请从右边列表选择活动" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="开始时间"
                                        onChange = {(value)=>this.onStartTimeChange(value)}
                                        >
                                        {getFieldDecorator('startTime', {
                                            rules: [{ type: 'object', required: true, message: '请选择活动开启时间!' }]})(
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange = {this.onStartTimeChange} />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="结束时间"
                                        >
                                        {getFieldDecorator('endTime', {
                                            rules: [{ type: 'object', required: true, message: '请选择活动过期时间!' }]})(
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange = {this.onEndTimeChange} />
                                        )}
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <FormItem {...tailFormItemLayout} >
                                    <Button type="primary" htmlType="submit" onClick = {this.openActivity}>开启活动</Button>
                                </FormItem>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card title="可配置的活动信息列表">
                        <Table pagination={{ pageSize: 10 }} columns={this.columnsAll} dataSource={allActivityIdsItemsData} size={'small'} />
                    </Card>
                </Col>
            </Row>
            <Card title="已配置的活动">
                <Table pagination={{ pageSize: 10 }} columns={this.columnsCur} dataSource={curActiveActivitiesItemsData} size={'small'} />
            </Card>
        </div>;
    }
}
export default Form.create()(ActivityManage);
