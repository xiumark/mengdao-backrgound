import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, Radio, DatePicker, TimePicker, Popconfirm  } from 'antd';
import './index.less';
import { getServiceList, getYxList, createActivity,removeActivity,getAllActivityIds, getCurActiveActivities,createActivityAllServers,removeActivityAllServers } from '../../api/service';
import { formatTimeByType,TIME_FORMAT_TYPE } from '../../api/lib';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { isNotExpired, setActivityManageData } from '../../utils/cache';

class ActivityManage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            allActivityIdsItemsData: [                                  //todo 添加一个是否已经开启的标识开启的标识
                // {
                //     "activityId": 1001,            // 活动的id
                //     "activityName":"活动名称" ,    // 活动名称
                //     "isConfigured":false,                                           //TODO 是否已经配置到活动中
                // }
            ],

            curActiveActivitiesItemsData: [
                // {
                //     "activityId": 1001,            // 活动的id
                //     "activityName":"活动名称" ,    // 活动名称
                //     "startTime":"2016-06-20 05:00:00" ,    // 活动开启时间
                //     "endTime":"2016-06-20 04:59:59" ,    // 活动结束时间
                // },
            ],

            activityToAdd:
            {
                // "activityId": 1001,            // 活动的id
                // "activityName":"活动名称" ,    // 活动名称
                // "startTime":"2016-06-20 05:00:00" ,    // 活动开启时间
                // "endTime":"2016-06-20 04:59:59" ,    // 活动结束时间
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
            serverId:'',
            timeModeState:1,    //默认时间和自定义时间，默认是默认时间
            isAllServer:0,  //是否是全服活动，默认是单服操作（0）
            timeMode2:1,
            successList:[
                // {
                //     "yx":"aa",
                //     "serverId":1,
                //     "succ":true
                // }
    
            ],//操作成功的列表
            errorList:[
                // {
                //     "yx":"aa",
                //     "serverId":1,
                //     "succ":true
                // }
    
            ],  //操作失败的列表
            isCreate:true,   //是否是删除操作
            editMethod:1,    //1,添加活动，0 删除活动
            
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

        this.columnsResult = [
            {
                title: '渠道',
                dataIndex: 'yx',
                key: 'yx',
            },
            {
                title: '区服',
                dataIndex: 'serverId',
                key: 'serverId',
            },
        ];
        this.columnsResultError = [
            {
                title: '渠道',
                dataIndex: 'yx',
                key: 'yx',
            },
            {
                title: '区服',
                dataIndex: 'serverId',
                key: 'serverId',
            },
            {
                title: '原因',
                dataIndex: 'msg',
                key: 'msg',
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
        this.checkChange = this.checkChange.bind(this);
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
        if(this.state.isAllServer==1){   //全服活动
            return (
                // <div><button onClick ={(event) => this.chooseActivity(event, tableItem, column)}>选择活动</button></div>
                <Button type="primary" onClick ={(event) => this.chooseActivity(event, tableItem, column)} >选择活动</Button>
            );
        }else{
            return (
                // <div><button onClick ={(event) => this.chooseActivity(event, tableItem, column)}>选择活动</button></div>
                <Button type="primary" onClick ={(event) => this.chooseActivity(event, tableItem, column)} disabled={tableItem.isConfigured?true:false}>{tableItem.isConfigured?'已经配置':'选择活动'}</Button>
            );
        }
        
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

        this.props.form.setFieldsValue({
            timeMode:'1'
          });
    }

    checkChange(e){
        this.props.form.setFieldsValue({
            timeMode:e.target.value
          });
        this.setState({timeModeState:e.target.value});   //时间模式
    }

    checkAllServer=(e)=>{
        if(this.state.yx!=''){
            this.props.form.setFieldsValue({
                isAllServer:e.target.value
              });
            this.setState({isAllServer:e.target.value},()=>{
                if(this.state.isAllServer==1){
                    this.getAllActivityIds(this.state.yx,0);
                }
            });   //是否是全服更新
        }else{
            this.props.form.setFieldsValue({
                isAllServer:e.target.value
              });
            this.setState({isAllServer:e.target.value},()=>{
            message.info('请选择渠道');
        });   //是否是全服更新
        }
    }

    checkEditActMethod=(e)=>{
        this.setState({editMethod:e.target.value,successList:[],errorList:[]});
    }

    setInputValue=(yx, serverId)=>{
        let expireTime2 =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime2)){
            yx&&this.props.form.setFieldsValue({yx: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId: `${serverId}`});
            if(yx&&serverId){
                this.getAllAndCurActiveActivityIds(yx,serverId);  //获取可配置和已配置的活动信息
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
        if(this.state.isAllServer==1){
            this.getAllActivityIds(value,0);
        }
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
        this.getAllAndCurActiveActivityIds(yx,serverId);  //获取可配置和已配置的活动信息
    })
    }

    onStartTimeChange=(date)=>{
        let startTimeStr = this.formatStartTime(date);
        setTimeout(()=>this.props.form.setFieldsValue({startTime: moment(startTimeStr)}),100);
    }

    onEndTimeChange=(date)=>{
        let endTimeStr = this.formatEndTime(date);
        setTimeout(()=>this.props.form.setFieldsValue({endTime: moment(endTimeStr)}),100);
    }

    onStartTimeChange2=(date)=>{
        let startTimeStr = this.formatStartTime(date);
        setTimeout(()=>this.props.form.setFieldsValue({minOpenTime: moment(startTimeStr)}),100);
    }

    onEndTimeChange2=(date)=>{
        let endTimeStr = this.formatEndTime(date);
        setTimeout(()=>this.props.form.setFieldsValue({maxOpenTime: moment(endTimeStr)}),100);
    }


 //格式化到：05:00:00
    formatStartTime=(startTime)=>{
        return formatTimeByType(startTime,TIME_FORMAT_TYPE.FIVE,this.state.timeModeState);
    }

//格式化到：04:59:59
    formatEndTime=(endTime)=>{
        return formatTimeByType(endTime,TIME_FORMAT_TYPE.BEFORE_FIVE,this.state.timeModeState);
    }

    /**
     * 获取全部活动和已经激活的活动
     */
    getAllActivityIds = (yx,serverId)=>{ 
        getAllActivityIds(yx,serverId,(allList)=>{
            //todo 过滤已经获得的全部活动数据
            let formatedList = this.getFormatedAllActList(allList);
            this.setState({ allActivityIdsItemsData: formatedList });
        });
    }    

    getFormatedAllActList=(allList)=>{
        let curList = this.state.curActiveActivitiesItemsData;  //当前活动数据
        let rtnList = [];
        for(let i=0; i<allList.length; i++){
            let allItem = allList[i];
            let isConfigured = false;
            for(let j=0;j<curList.length;j++){
                let curItem = curList[j];
                if(allItem.activityId==curItem.activityId){
                    isConfigured = true;
                    break;                
                }
            }
            allItem.isConfigured = isConfigured;
            rtnList.push(allItem)
        }
        return allList;
    }

    /**
     * 获取已配置的活动列表
     */
    getAllAndCurActiveActivityIds = (yx,serverId) => { 
        getCurActiveActivities(yx,serverId,(list)=>{
            let newList = [];
            for (let i=0;i<list.length;i++){
                let item = list[i];
                item.startTime = new Date(parseInt(item.startTime)).toLocaleString().substr(0,17);
                item.endTime = new Date(parseInt(item.endTime)).toLocaleString().substr(0,17);
                newList.push(item);
            }
            this.setState({ curActiveActivitiesItemsData: newList });
            this.getAllActivityIds(yx,serverId);
        })
    }

    openActivity = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {yx, serverId, startTime, endTime,minOpenTime,maxOpenTime} = values;
                let activityId = this.state.activityToAdd.activityId;
                startTime&&(startTime = startTime.format('YYYY-MM-DD HH:mm:ss'));  
                endTime&&(endTime = endTime.format('YYYY-MM-DD HH:mm:ss'));  
                minOpenTime&&(minOpenTime=minOpenTime.format('YYYY-MM-DD HH:mm:ss'));  
                maxOpenTime&&(maxOpenTime=maxOpenTime.format('YYYY-MM-DD HH:mm:ss'));  
                if(this.state.isAllServer==1){ //全服活动
                    if(yx&&activityId&&startTime&&endTime&&minOpenTime&&maxOpenTime){
                        this.createActivityAllServers(yx,activityId,startTime,endTime,minOpenTime,maxOpenTime)
                    }else{
                        message.info('参数不足')
                    }
                }else{                         //单服活动
                    if(yx&&serverId&&startTime&&endTime&&activityId){
                        this.createActivity(yx, serverId, startTime, endTime, activityId);  //请求开启活动
                    }else{
                        message.info('请设置渠道，区服，开始，结束时间，以及活动名称')
                    }
                }
            }
        });
    }


    createActivityAllServers=(yx,activityId,startTime,endTime,minOpenTime,maxOpenTime)=>{
        createActivityAllServers(yx,activityId,startTime,endTime,minOpenTime,maxOpenTime,(list)=>{
            //
            let successList = [];
            let errorList = [];
            list.map((item,index)=>{
                if(item.succ){   //成功
                    successList.push(item);
                }else{    //失败
                    errorList.push(item);
                }
                this.setState({successList:successList,errorList:errorList,isCreate:true},()=>{    //成功列表和失败列表

                });
            })
        })
    }


    //删除全服活动
    deletAllActivity=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {yx,minOpenTime,maxOpenTime} = values;
                let activityId = this.state.activityToAdd.activityId;
                minOpenTime=minOpenTime.format('YYYY-MM-DD HH:mm:ss');  
                maxOpenTime=maxOpenTime.format('YYYY-MM-DD HH:mm:ss');  
                this.removeActivityAllServers(yx,activityId,minOpenTime,maxOpenTime)
            }
        });

    }
    removeActivityAllServers=(yx,activityId,minOpenTime,maxOpenTime)=>{
        removeActivityAllServers(yx,activityId,minOpenTime,maxOpenTime,(list)=>{
            let successList = [];
            let errorList = [];
            list.map((item,index)=>{
                if(item.succ){   //成功
                    successList.push(item);
                }else{    //失败
                    errorList.push(item);
                }
                this.setState({successList:successList,errorList:errorList,isCreate:false},()=>{    //成功列表和失败列表

                });
            })
        })
    }

    /**
     * 开启活动
     */
    createActivity=(yx, serverId, startTime, endTime, activityId)=>{   
        createActivity(yx, serverId, startTime, endTime, activityId,()=>{
            this.getAllAndCurActiveActivityIds(yx, serverId);
            setActivityManageData(yx, serverId);
        })
    }

    /**
     * 刪除活动  
     */
    removeActivity = (yx, serverId, activityId)=>{   
        removeActivity(yx, serverId, activityId,()=>{
            // this.getCurActiveActivities(yx, serverId);
            // setActivityManageData(yx, serverId);
            //重新请求后台数据,更新已配置活动数据
            this.getAllAndCurActiveActivityIds(yx, serverId);
        })
    }

    render() {
        const {filteredServiceList, yxList, allActivityIdsItemsData, curActiveActivitiesItemsData,successList,errorList,isAllServer,editMethod} = this.state;
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

        return <div>
            <Row>
                <Col className="gutter-row" md={8} sm={8} xs={24}>
                    <Card title="活动配置">
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
                                    <FormItem
                                        {...formItemLayout}
                                        label="操作方式"
                                        >
                                        {getFieldDecorator('editMethod', {
                                            rules: [
                                                { required: true, message: '请选择操作方式' },
                                            ],
                                        })(
                                            <RadioGroup onChange = {this.checkEditActMethod}>
                                            <Radio value="1">配置活动</Radio>
                                            <Radio value="0">删除活动</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="服务器设置"
                                        >
                                        {getFieldDecorator('isAllServer', {
                                            rules: [
                                                { required: true, message: '请先做服务器设置' },
                                            ],
                                        })(
                                            <RadioGroup onChange = {this.checkAllServer}>
                                            <Radio value="0">单服</Radio>
                                            <Radio value="1">批量</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                    {(isAllServer==0)&&<FormItem {...formItemLayout} label="服务器名称" >
                                        {getFieldDecorator('serverId', {
                                            rules: [
                                                { required: false, message: '请选择服务器名称' },
                                            ],
                                        })(
                                            <Select placeholder="请选择服务器名称" onChange={(value)=>this.onServerChange(value)} >
                                                {filteredServiceList.map((item, index) => {
                                                    return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>}
                                    <FormItem {...formItemLayout} label={"活动名称"} >
                                        {getFieldDecorator('activityName', {
                                            rules: [{ required: true, message: '请从下方列表选择活动' }],
                                        })(
                                            <Input placeholder="请从下方列表选择活动" />
                                        )}
                                    </FormItem>
                                    {(editMethod==1)&&<FormItem
                                        {...formItemLayout}
                                        label="开始时间"
                                        onChange = {(value)=>this.onStartTimeChange(value)}
                                        >
                                        {getFieldDecorator('startTime', {
                                            rules: [{ type: 'object', required: false, message: '请选择活动开启时间!' }]})(
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange = {this.onStartTimeChange} />
                                        )}
                                    </FormItem>}
                                    {(editMethod==1)&&<FormItem
                                        {...formItemLayout}
                                        label="结束时间"
                                        >
                                        {getFieldDecorator('endTime', {
                                            rules: [{ type: 'object', required: false, message: '请选择活动过期时间!' }]})(
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange = {this.onEndTimeChange} />
                                        )}
                                    </FormItem>}
                                    {(isAllServer==1)&&<FormItem
                                        {...formItemLayout}
                                        label="最早开服时间"
                                        onChange = {(value)=>this.onStartTimeChange(value)}
                                        >
                                        {getFieldDecorator('minOpenTime', {
                                            rules: [{ type: 'object', required: false, message: '最早开服时间!' }]})(
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange = {this.onStartTimeChange2} disabled={isAllServer==1?false:true}/>
                                        )}
                                    </FormItem>}
                                    {(isAllServer==1)&&<FormItem
                                        {...formItemLayout}
                                        label="最晚开服时间"
                                        >
                                        {getFieldDecorator('maxOpenTime', {
                                            rules: [{ type: 'object', required: false, message: '最晚开服时间!' }]})(
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange = {this.onEndTimeChange2} disabled={isAllServer==1?false:true}/>
                                        )}
                                    </FormItem>}
                                    
                                    <FormItem
                                        {...formItemLayout}
                                        label="时间模式"
                                        >
                                        {getFieldDecorator('timeMode')(
                                            <RadioGroup onChange={this.checkChange}>
                                            <Radio value="1">默认</Radio>
                                            <Radio value="0">自定义</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <FormItem >
                                    <Col md={12} sm={12} xs={24}>
                                        <Button type="primary" htmlType="submit" onClick = {this.openActivity} disabled={editMethod==1?false:true}>配置活动</Button>
                                    </Col>
                                    <Col md={12} sm={12} xs={24}>
                                        <Button type="primary" htmlType="submit" onClick = {this.deletAllActivity} style={{marginLeft:30}} disabled={isAllServer==1&&(editMethod==0)?false:true}>批量删除</Button>
                                    </Col>
                                </FormItem>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col md={8} sm={8} xs={24}>
                    <Card style={{minHeight:637}} title={editMethod==1?"配置成功的":"删除成功的"}>
                        <Table pagination={{ pageSize: 10 }} columns={this.columnsResult} dataSource={successList} size={'small'} />
                    </Card>
                </Col>
                <Col md={8} sm={8} xs={24}>
                    <Card style={{ color: "red",minHeight:637}} title={editMethod==1?"!!!配置失败的!!!":"!!!删除失败的!!!"}>
                        <Table pagination={{ pageSize: 10 }} style={{ color: "red"}} columns={this.columnsResultError} dataSource={errorList} size={'small'} />
                    </Card>
                </Col>
            </Row>
            <Card title="已配置的活动">
                <Table pagination={{ pageSize: 10 }} columns={this.columnsCur} dataSource={this.state.isAllServer==1?[]:curActiveActivitiesItemsData} size={'small'} />
            </Card>
            <Card title={this.state.isAllServer==0?"单服可配置的全部活动信息列表":"全服可配置的全部活动信息列表"}>
                <Table pagination={{ pageSize: 12 }} columns={this.columnsAll} dataSource={allActivityIdsItemsData} size={'small'} />
            </Card>
        </div>;
    }
}
export default Form.create()(ActivityManage);
