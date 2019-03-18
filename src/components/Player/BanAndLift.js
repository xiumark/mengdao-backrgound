import React from 'react';
import { Card, Form, Select, Button, Row, Col, Input,Radio } from 'antd';
import './index.less';
import { getServiceList, getYxList, QueryType, getPlayerInfo, unbanUser, banUser } from '../../api/service';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class BanAndLift extends React.Component {
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
        isBlocked:false,
        reason:'',
        endTime:'',
        handleTypeState:'1',
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        })
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
    /**
     * 封禁玩家
     */
    block = (e) => { //获取权限列表
        e.preventDefault();
        this.props.form.validateFields(['serverId','yx','playerName','reason','duration'],(err, values) => {
            if (!err) {
                let { playerName, serverId, reason='', duration='',yx } = values;
                banUser(playerName, serverId, reason, duration,yx,()=>{
                    this.queryState();
                })
            }
        })
    }

    queryState=()=>{
        this.props.form.validateFields(['serverId','yx','playerName'],(err, values) => {
            if (!err) {
                let { serverId , yx, playerName} = values;
                getPlayerInfo('playerName', serverId, playerName, undefined, yx, QueryType.PLAYERNAME,(list)=>{
                    if(list&&list[0]&&list[0].silenceInfo){
                        let silenceInfo = list[0].silenceInfo;
                        this.setState({isSilenced:silenceInfo.isSilenced, reason:silenceInfo.reason, endTime:silenceInfo.endTime});
                    }
                },true);  //不需要展示提示消息
            }
        })
    }

    /**
     * 解禁玩家
     */
    unBlock = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['serverId','yx','playerName'],(err, values) => {
            if (!err) {
                let { serverId , yx, playerName} = values;
                unbanUser(playerName, serverId,yx,()=>{
                    this.queryState();
                })
            }
        });
    }

    //处理单选框
    checkChange = (e)=>{
        this.setState({handleTypeState:e.target.value});
    }
    render() {
        const {filteredServiceList, yxList} = this.state;
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
                        <Form  style={{ minHeight:302, width: "100%" }}>
                            <FormItem
                                {...formItemLayout}
                                label="操作类型"
                                >
                                {getFieldDecorator('queryType', {
                                    initialValue: '1' ,
                                    rules: [
                                        { required: true, message: '请选择查询方式' },
                                    ],
                                })(
                                    <RadioGroup onChange={this.checkChange}>
                                        <Radio value="1">查询状态</Radio>
                                        <Radio value="2">解除封禁</Radio>
                                        <Radio value="3">封禁</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
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
                            <FormItem {...formItemLayout} label={"角色名"} >
                                {getFieldDecorator('playerName', {
                                    rules: [{ required: true, message: '请输入角色名' }],
                                })(
                                    <Input placeholder="请输入角色名" />
                                )}
                            </FormItem>
                            {this.state.handleTypeState==HandleType.BLOCK&&
                            <FormItem {...formItemLayout} label={"封禁原因"}>
                                {getFieldDecorator('reason', {
                                    rules: [{ required: true, message: '请输入封禁原因' }],
                                })(
                                    <Input placeholder="请输入封禁原因" />
                                )}
                            </FormItem>}
                            {this.state.handleTypeState==HandleType.BLOCK&&
                            <FormItem {...formItemLayout} label={"封禁时间"}>
                                {getFieldDecorator('duration', {
                                    rules: [{ required: true, message: '请输入封禁时间' }],
                                })(
                                    <Input placeholder="请输入封禁时间（分钟）" />
                                )}
                            </FormItem>}
                            <Row>
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" disabled={(this.state.handleTypeState!=HandleType.QUERY_STATE)} onClick={this.queryState}>查询状态</Button>
                                    </FormItem>
                                </Col>  
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" disabled={!isBlocked} htmlType="submit" disabled={(this.state.handleTypeState!=HandleType.UNBLOCK)} onClick={this.unBlock} >解除封禁</Button>
                                    </FormItem>
                                </Col>
                                <Col sm={8} md={8}>
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" disabled={isBlocked} disabled={(this.state.handleTypeState!=HandleType.BLOCK)} onClick={this.block}>封禁</Button>
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
                                    // rules: [{ required: true, message: '' }],
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


// BanAndLift.propTypes = {
//     duration:React.PropTypes.number.isRequired,
// }
export default Form.create()(BanAndLift);

// export const  QueryType = {
//     PLAYERNAME: 1,  //通过玩家名查询
//     USERID:2,     //通过角色id查询
//     PLAYERID: 3,   //通过玩家id查询
// }

const HandleType = {
    QUERY_STATE:'1',//查询状态
    UNBLOCK:'2',  //解除禁言
    BLOCK:'3',    //禁言
}
