import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
import { isNotExpired, setRankListStorage } from '../../utils/cache';
import moment from 'moment';
/**
 * 充值排行榜
 */
class PayRankList extends React.Component {
    state = {
        inputMethod:'0',//0自动，1手动
        yxList:[{key:'1',yx:'渠道1'},{key:'2',yx:'渠道2'}],
        serviceList:[
            {yx: "aa", serverId: 10000, serverName: "sg_banshu1", serverState: 0},
            {yx: "ab", serverId: 20000, serverName: "sg_banshu2", serverState: 1},
            {yx: "ab", serverId: 30000, serverName: "sg_banshu3", serverState: 0},
        ],
        rankList:[
            // {
            // "playerId": 1801,
            // "payPoint": 900
            // },
            // {
            // "playerId": 1802,
            // "payPoint": 800
            // },
            // {
            // "playerId": 1803,
            // "payPoint": 700
            // },
        ],
        serverId:'',
        yx:''
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res});
        })
        let yx,serverId;
        let {rankYx, rankServerId}=localStorage;
        yx = rankYx;
        serverId = rankServerId;
        let {inputMethod} = this.state;
        if(inputMethod==0){
            this.setInputValue1(yx, serverId);
            this.setState({serverId:serverId, yx:yx})
        }else{
            this.setInputValue2(yx, serverId);
            this.setState({serverId:serverId, yx:yx})
        }

        //如果当前请求数据完整且没有过期，则请求后台数据
        // this.handleSubmit();
        this.requestSearch();
    }
     
    //自动填充选择表单
    setInputValue1=(yx, serverId)=>{
        let expireTime =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime)){//localSorate信息没有过期，为表单填充已经存在的值
            yx&&this.props.form.setFieldsValue({yx1: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId1: `${serverId}`});

            if(serverId&&yx){//如果请求数据齐全则请求后天数据
                this.requestSearch(serverId, yx);
            }
        }
        //如果已经过期，就不使用
    }

    //自动填充输入表单
    setInputValue2=(yx, serverId)=>{
        let expireTime =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime)){//localSorate信息没有过期，为表单填充已经存在的值
            yx&&this.props.form.setFieldsValue({yx2: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId2: `${serverId}`});

            if(serverId&&yx){//如果请求数据齐全则请求后天数据
                this.requestSearch(serverId, yx);
            }
        }
    }

    getYxList=(data)=>{//获取渠道列表
        getYxList(data,(yxList)=>{
         this.setState({yxList:yxList});
        });
    }

    /**
     * 获取用户充值数据
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {serverId, yx} = this.state;
                this.requestSearch(serverId, yx);
            }
        });
    }

    
    requestSearch=(serverId, yx)=>{
        let querystring = `serverId=${serverId}&yx=${yx}`
        let {rankList} = this.state;
        let url = "/root/getPayRankList.action"
        let method = 'POST'
        let successmsg = '用户充值数据获取成功'
        apiFetch(url, method, querystring, successmsg, (res) => {
            this.setState({rankList:res.data.rankList},()=>{
                setRankListStorage(this.state.yx, this.state.serverId);
            })
        })
    }


    onRadioChange = (e)=>{  //选择输入状态
        this.setState({inputMethod:e.target.value},()=>{
            let {yx, serverId}=localStorage;
            let {inputMethod} = this.state;
            if(inputMethod==0){
                this.setInputValue1(yx, serverId);
            }else{
                this.setInputValue2(yx, serverId);
            }
        });
    }

    onServerChange=(value)=>{
        this.setState({serverId:value})
    }

    onServerinputChange=(e)=>{
        this.setState({serverId:e.target.value})
    }

    onYxChange=(value)=>{
        this.setState({yx:value})
    }
    
    onYxinputChange=(e)=>{
        this.setState({yx:e.target.value})
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { inputMethod, yxList, serviceList, rankList } = this.state;
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
                title: '玩家',
                dataIndex: 'playerId',
            },
            {
                title: '充值',
                dataIndex: 'payPoint',
            },
        ];
        return <div>
            <Card title="">
                <Row>
                    <Col className="gutter-row" md={12} sm={24}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formItemLayout}
                                label="输入方式"
                                >
                                {getFieldDecorator('inputMethod',{ initialValue: '0' })(
                                    <RadioGroup onChange = {this.onRadioChange}>
                                    <Radio value="0">选择输入</Radio>
                                    <Radio value="1">手动输入</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>

                            {/*serverId*/}
                            {inputMethod==0?<FormItem {...formItemLayout} label="服务器" >
                                {getFieldDecorator('serverId1', {
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
                            :
                            <FormItem {...formItemLayout} label={"服务器"} >
                                {getFieldDecorator('serverId2', {
                                    rules: [{ required: true, message: '请输入服务器名称' }],
                                })(
                                    <Input placeholder="请输入服务器名称" onChange = {(value)=>this.onServerinputChange(value)}/>
                                )}
                            </FormItem>
                            }

                            {/* 服务端获取yx数据 */}
                            {inputMethod==0?<FormItem {...formItemLayout} label="渠道" >
                                {getFieldDecorator('yx1', {
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
                            :
                            <FormItem {...formItemLayout} label={"渠道"} >
                                {getFieldDecorator('yx2', {
                                    rules: [{ required: true, message: '请输入渠道!' }],
                                })(
                                    <Input placeholder="请输入渠道" onChange = {(value)=>this.onYxinputChange(value)}/>
                                )}
                            </FormItem>
                            }
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">查询排行</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
            <Card title="充值排行" id="payRankList" style={{ minHeight: 380 }}>
                <Table rowKey="playerId" columns={columns} dataSource={rankList} size="small" />
            </Card>
        </div >;
    }
}

export default Form.create()(PayRankList);
