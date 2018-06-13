import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, DatePicker, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
import { isNotExpired, setStayReportStorage } from '../../utils/cache';
import moment from 'moment';

/**
 * 查询指定区服指定日期的留存统计
 */
class StayReport extends React.Component {
    state = {
        yxList:[{key:'1',yx:'渠道1'},{key:'2',yx:'渠道2'}],
        serviceList:[
            {yx: "aa", serverId: 10000, serverName: "sg_banshu1", serverState: 0},
            {yx: "ab", serverId: 20000, serverName: "sg_banshu2", serverState: 1},
            {yx: "ab", serverId: 30000, serverName: "sg_banshu3", serverState: 0},
        ],
        stayReports:[],  //运营日报数据
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

        let {stayReportYx, stayReportServerId, stayReportStartDayStr, stayReportEndDayStr, stayReportType}=localStorage;
        let yx, serverId, startDayStr, endDayStr, type;
        yx=stayReportYx; serverId=stayReportServerId; startDayStr=stayReportStartDayStr; endDayStr=stayReportEndDayStr;
        type=stayReportType;
        this.setInputValue(yx, serverId, startDayStr, endDayStr, type);
    }

    //自动填充表单值
    setInputValue=(yx, serverId, startDayStr, endDayStr, type)=>{
        let expireTime =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime)){//localSorate信息没有过期，为表单填充已经存在的值
            yx&&this.props.form.setFieldsValue({yx: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId: `${serverId}`});
            startDayStr&&this.props.form.setFieldsValue({startDayStr: moment(`${startDayStr}`)});
            endDayStr&&this.props.form.setFieldsValue({endDayStr: moment(`${endDayStr}`)});
            type&&this.props.form.setFieldsValue({type: `${type}`});

            if(yx&&serverId&&startDayStr&&endDayStr&&type){
                this.requestSearch(yx, serverId, startDayStr, endDayStr, type);
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
        let dataStr = '日期'+'\t'+'首日数据'+'\t'+'次日数据'+'\t'+'3日数据'+'\t'+'4日数据'+'\t'+'5日数据'+'\t'+'6日数据'+'\t'+'7日数据'+'\t'+'14日数据'+'\t'+'30日数据'+'\t'+'60日数据\n';
        for(let i =0;i<data.length;i++){
            let item = data[i]
            dataStr =dataStr+`${item.dayStr}`+'\t'+`${item.num1}`+'\t'+`${item.num2}`+'\t'+`${item.num3}`+'\t'+`${item.num4}`+'\t'+`${item.num5}`+'\t'+`${item.num6}`+'\t'+`${item.num7}`+'\t'+`${item.num14}`+'\t'+`${item.num30}`+'\t'+`${item.num60}\n`
        }
        return dataStr;
    }

    copyClick=(e)=>{
        let {stayReports} = this.state;
        this.stringifyData(stayReports);

        let tableStr =this.stringifyData(stayReports);
        
        let input = document.getElementById("input");
        input.value = tableStr; // 修改文本框的内容
        input.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
        message.info("表格内容已复制");
    }


    /**
     * 查询指定区服指定日期的留存统计
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { yx, serverId, startDayStr, endDayStr, dayStr, type} = values;
                startDayStr=startDayStr.format('YYYY-MM-DD');
                endDayStr=endDayStr.format('YYYY-MM-DD');
                this.requestSearch(yx, serverId,startDayStr, endDayStr, type);
            }
        });
    }

    requestSearch=(yx, serverId,startDayStr, endDayStr, type)=>{
        let { stayReports } = this.state;
        let querystring = `yx=${yx}&serverId=${serverId}&startDayStr=${startDayStr}&endDayStr=${endDayStr}&type=${type}`;
        let url = "/root/getStayReport.action";
        let method = 'POST';
        let successmsg = '查询成功';
        apiFetch(url, method, querystring, successmsg, (res) => {
            let stayReports = res.data.stayReports;
            this.setState({stayReports:stayReports});
            //请求成功后设置localStorage
            setStayReportStorage(yx, serverId, startDayStr, endDayStr, type);
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
        const { serviceList, yxList, stayReports } = this.state;
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
                title: '日期',
                dataIndex: 'dayStr',
            },{
                title: '首日数据',
                dataIndex: 'num1',
            },{
                title: '次日数据',
                dataIndex: 'num2',
            },{
                title: '3日数据',
                dataIndex: 'num3',
            },{
                title: '4日数据',
                dataIndex: 'num4',
            },{
                title: '5日数据',
                dataIndex: 'num5',
            },{
                title: '6日数据',
                dataIndex: 'num6',
            },{
                title: '7日数据',
                dataIndex: 'num7',
            },{
                title: '14日数据',
                dataIndex: 'num14',
            },{
                title: '30日数据',
                dataIndex: 'num30',
            },{
                title: '60日数据',
                dataIndex: 'num60',
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
                            <FormItem
                                {...formItemLayout}
                                label="订单类型"
                                >
                                {getFieldDecorator('type',{ initialValue: '0' })(
                                    <RadioGroup onChange = {this.onRadioChange}>
                                    <Radio value="0">全部</Radio>
                                    <Radio value="1">非滚服玩家</Radio>
                                    <Radio value="2">滚服玩家</Radio>
                                    </RadioGroup>
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
            <Card title="留存统计列表" id="stayReports" style={{ minHeight: 380 }} >
                <Table rowKey="dayStr" columns={columns} dataSource={stayReports} size="small" />
                <textarea id="input" value='' style={{ position: 'absolute',top: '0',left: '0',opacity: '0',zIndex: '-10'}}>这是幕后黑手</textarea>
            </Card>
        </div >;
    }
}

export default Form.create()(StayReport);
