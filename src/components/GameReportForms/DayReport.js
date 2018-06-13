import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
import { isNotExpired,setDayReportStorage } from '../../utils/cache';
import moment from 'moment';
/**
 * 查询指定区服指定日期的运营日报
 */
class DayReport extends React.Component {
    state = {
        yxList:[{key:'1',yx:'渠道1'},{key:'2',yx:'渠道2'}],
        serviceList:[
            {yx: "aa", serverId: 10000, serverName: "sg_banshu1", serverState: 0},
            {yx: "ab", serverId: 20000, serverName: "sg_banshu2", serverState: 1},
            {yx: "ab", serverId: 30000, serverName: "sg_banshu3", serverState: 0},
        ],
        dayReports:[],  //运营日报数据
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
        let {dayReportYx, dayReportServerId, dayReportStartDay, dayReportEndDay}=localStorage;
        let yx, serverId, startDayStr, endDayStr;
        yx=dayReportYx; serverId=dayReportServerId; startDayStr=dayReportStartDay; endDayStr=dayReportEndDay;
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

            //请求后台数据
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


    stringifyData=(data)=>{
        let dataStr = '日期'+'\t'+'注册数'+'\t'+'创角数'+'\t'+'创角率'+'\t'+'活跃玩家数'+'\t'
        +'最高在线人数'+'\t'+'最高在线时刻'+'\t'+'付费次数'+'\t'+'付费人数'+'\t'+'付费总额(元)'+'\t'+'活跃玩家付费率'+'\t'
        +'付费玩家ARPU'+'\t'+'活跃玩家ARPU'+'\t'+'新增付费玩家数'+'\t'+'新增玩家付费总额(元)'+'\t'+'新增玩家付费率'+'\t'+'新增玩家ARPU'+'\t'
        +'老玩家ARPU\n';
        for(let i =0;i<data.length;i++){
            let item = data[i]
            dataStr =dataStr+`${item.dayStr}`+'\t'+`${item.registerNum}`+'\t'+`${item.createRoleNum}`+'\t'
            +`${item.createRoleRatio}`+'\t'+`${item.activeRoleNum}`+'\t'+`${item.maxOnlineNum}`+'\t'
            +`${item.maxOnlineTime}`+'\t'+`${item.payTimes}`+'\t'+`${item.roleNumPayed}`+'\t'+`${item.paySum}`+'\t'
            +`${item.activePayRatio}`+'\t'+`${item.payArpu}`+'\t'+`${item.activeArpu}`+'\t'+`${item.newRoleNumPayed}`+'\t'
            +`${item.newRolePaySum}`+'\t'+`${item.newRolePayRatio}`+'\t'+`${item.newRoleArpu}`+'\t'+`${item.oldRoleArpu}\n`
        }
        return dataStr;
    }

    copyClick=(e)=>{
        let {dayReports} = this.state;
        this.stringifyData(dayReports);

        let tableStr =this.stringifyData(dayReports);
        
        let input = document.getElementById("input");
        input.value = tableStr; // 修改文本框的内容
        input.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
        message.info("表格内容已复制");
    }




    /**
     * 查询指定时间段的运营日报
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { yx, serverId, startDayStr, endDayStr, dayStr} = values;
                startDayStr=startDayStr.format('YYYY-MM-DD');
                endDayStr=endDayStr.format('YYYY-MM-DD');
                this.requestSearch(yx, serverId,startDayStr, endDayStr);
            }
        });
    }

    requestSearch=(yx, serverId,startDayStr, endDayStr)=>{
        let { dayReports } = this.state;
        let querystring = `yx=${yx}&serverId=${serverId}&startDayStr=${startDayStr}&endDayStr=${endDayStr}`;
        let url = "/root/getDayReport.action";
        let method = 'POST';
        let successmsg = '查询成功';
        apiFetch(url, method, querystring, successmsg, (res) => {
            let dayReports = res.data.dayReports;
            this.setState({dayReports:dayReports});
             //请求成功后设置localStorage
             setDayReportStorage(yx, serverId,startDayStr, endDayStr);
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
        const { serviceList, yxList, dayReports } = this.state;
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
            },{
                title: '注册数',
                dataIndex: 'registerNum',
            },{
                title: '创角数',
                dataIndex: 'createRoleNum',
            },{
                title: '创角率',
                dataIndex: 'createRoleRatio',
            },{
                title: '活跃玩家数',
                dataIndex: 'activeRoleNum',
            },{
                title: '最高在线人数',
                dataIndex: 'maxOnlineNum',
            },{
                title: '最高在线时刻',
                dataIndex: 'maxOnlineTime',
            },{
                title: '付费次数',
                dataIndex: 'payTimes',
            },{
                title: '付费人数',
                dataIndex: 'roleNumPayed',
            },{
                title: '付费总额(元)',
                dataIndex: 'paySum',
            },{
                title: '活跃玩家付费率',
                dataIndex: 'activePayRatio',
            },{
                title: '付费玩家ARPU',
                dataIndex: 'payArpu',
            },{
                title: '活跃玩家ARPU',
                dataIndex: 'activeArpu',
            },{
                title: '新增付费玩家数',
                dataIndex: 'newRoleNumPayed',
            },{
                title: '新增玩家付费总额(元)',
                dataIndex: 'newRolePaySum',
            },{
                title: '新增玩家付费率',
                dataIndex: 'newRolePayRatio',
            },{
                title: '新增玩家ARPU',
                dataIndex: 'newRoleArpu',
            },{
                title: '老玩家ARPU',
                dataIndex: 'oldRoleArpu',
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
                                {getFieldDecorator('startDayStr', {
                                    rules: [{ type: 'object', required: true, message: '请选择起始时间!' }]})(
                                    <DatePicker showTime format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="终止时间"
                                >
                                {getFieldDecorator('endDayStr', {
                                    rules: [{ type: 'object', required: true, message: '请选择终止时间!' }]})(
                                    <DatePicker showTime format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button type="primary" id='copyButton' style={{ marginLeft: 40 }} onClick = {this.copyClick}>复制</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
            <Card title="运营日报列表" id="dayReports" style={{ minHeight: 380 }} >
                <Table rowKey="dayStr" columns={columns} dataSource={dayReports} size="small" />
                <textarea id="input" value='' style={{ position: 'absolute',top: '0',left: '0',opacity: '0',zIndex: '-10'}}>这是幕后黑手</textarea>
            </Card>
        </div >;
    }
}

export default Form.create()(DayReport);
