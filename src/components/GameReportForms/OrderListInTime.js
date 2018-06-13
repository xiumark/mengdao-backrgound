import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, DatePicker, TimePicker,Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
import { isNotExpired, setOrderListStorage } from '../../utils/cache';
import moment from 'moment';
/**
 * 
 */
class OrderListInTime extends React.Component {
    state = {
        orderList:[
        //     {playerId: 1801,   			// 角色编号
        //     createTime: "2018-04-19 00:00:00",	    // 创建时间
        //     succTime: "2018-04-20 00:00:00",		// 充值成功时间
        //     money: 10,							// 人民币
        //     diamond: 100,						// 元宝数
        //     platformOrderId: "abdererere",		    // 平台订单号
        //     productId: 1001,						// 商品编号
        //     state: 1,                                // 订单状态(0新建,1已成功,2已失败)
        // },
        ],
        sucList:[],
        failList:[],

        yxList:[{key:'1',yx:'渠道1'},{key:'2',yx:'渠道2'}],
        serviceList:[
            {yx: "aa", serverId: 10000, serverName: "sg_banshu1", serverState: 0},
            {yx: "ab", serverId: 20000, serverName: "sg_banshu2", serverState: 1},
            {yx: "ab", serverId: 30000, serverName: "sg_banshu3", serverState: 0},
        ],
        serverId:'',
        yx:''
    }
    componentWillMount() {
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            // currPage: '1',
            numPerPage:'10000'
        });
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res});
        })

        let yx, serverId, startTime, endTime, numPerPage, containType;
        let {orderYx, orderServerId, orderStartTime, orderEndTime, ordernumPerPage, ordernumContainType}=localStorage;
        yx = orderYx; serverId =orderServerId; startTime =orderStartTime; endTime =orderEndTime;
         numPerPage =ordernumPerPage;
         containType =ordernumContainType;
        this.setInputValue(yx, serverId, startTime, endTime, numPerPage, containType);
    }

    //自动填充表单值
    setInputValue=(yx, serverId, startTime, endTime, numPerPage,containType)=>{
        let expireTime =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime)){//localSorate信息没有过期，为表单填充已经存在的值
            // startTime&&(startTime = new Date(startTime));
            // endTime&&(endTime = new Date(endTime));
            numPerPage&&(numPerPage = JSON.parse(numPerPage));
            yx&&this.props.form.setFieldsValue({yx: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId: `${serverId}`});
            startTime&&this.props.form.setFieldsValue({startTime: moment(`${startTime}`)});
            endTime&&this.props.form.setFieldsValue({endTime: moment(`${endTime}`)});
            numPerPage&&this.props.form.setFieldsValue({numPerPage: `${numPerPage}`});
            containType&&this.props.form.setFieldsValue({containType: `${containType}`});

            //如果请求数据完整，则请求后台数据，并且显示
            if(yx&&serverId&&startTime&&endTime&&numPerPage&&containType){
                let currPage = undefined;
                // startTime=startTime.format('YYYY-MM-DD HH:mm:ss');
                // endTime=endTime.format('YYYY-MM-DD HH:mm:ss');
                this.requestSearch(yx, serverId, startTime, endTime, currPage, numPerPage, containType);
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
        let dataStr = '角色编号'+'\t'+'创建时间'+'\t'+'充值成功时间'+'\t'+'人民币'+'\t'+'平台订单号'+'\t'+'商品编号'+'\t'+'订单状态\n';
        for(let i =0;i<data.length;i++){
            let item = data[i]
            dataStr =dataStr+`${item.playerId}`
                    +'\t'+`${item.createTime}`
                    +'\t'+`${item.succTime}`
                    +'\t'+`${item.money}`
                    +'\t'+`${item.platformOrderId}`
                    +`\t`+`${item.productId}`
                    +'\t'+`${item.statemsg}\n`
        }
        return dataStr;
    }

    copyClick=(e)=>{
        let {orderList} = this.state;
        this.stringifyData(orderList);

        let tableStr =this.stringifyData(orderList);
        
        let input = document.getElementById("input");
        input.value = tableStr; // 修改文本框的内容
        input.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
        message.info("表格内容已复制");
    }


    /**
     * 查询指定时间段的充值订单列表
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { yx, serverId, startTime, endTime, currPage, numPerPage, containType} = values;
                startTime=startTime.format('YYYY-MM-DD HH:mm:ss');
                endTime=endTime.format('YYYY-MM-DD HH:mm:ss');
                this.requestSearch(yx, serverId, startTime, endTime, currPage, numPerPage, containType);
            }
        });
    }


    /**
     * 默认获取全部数据（1）
     * @param containType:0:成功订单；1：全部订单；2：失败订单
    */
    requestSearch=(yx, serverId, startTime, endTime, currPage, numPerPage, containType)=>{
        let querystring = `yx=${yx}&serverId=${serverId}&startTime=${startTime}&endTime=${endTime}&currPage=${currPage}&numPerPage=${numPerPage}&containFail=1`
        let url = "/root/getOrderListInTime.action"
        let method = 'POST'
        let successmsg = '查询成功';
        let sucList=[];
        let failList = [];
        let allList = [];
        apiFetch(url, method, querystring, successmsg, (res) => {
            let orderList = res.data.orderList;
            for(let i=0;i<orderList.length;i++){
                switch(orderList[i].state){
                    //新建（错误）
                    case 0: 
                        orderList[i].statemsg='新建';
                        failList.push(orderList[i]);
                    break;
                    // 已成功
                    case 1: 
                        orderList[i].statemsg='已成功';
                        sucList.push(orderList[i]);
                    break;
                    //已失败
                    case 2: 
                        orderList[i].statemsg='已失败';
                        failList.push(orderList[i]);
                    break;
                    //已失败
                    default:
                        orderList[i].statemsg='错误';
                        failList.push(orderList[i]);
                }
            }

            switch(containType){
                //成功订单
                case '0':
                    this.setState({orderList:sucList});
                break;
                //全部订单
                case '1':
                    this.setState({orderList:orderList});
                break;
                //失败订单
                case '2':
                    this.setState({orderList:failList});
                break;
            }
            //请求成功后设置localStorage
            if(res.data.orderList.length!==0){
                setOrderListStorage(yx, serverId, startTime, endTime, currPage, numPerPage, containType);
            }
        })
    }

    onServerChange=(value)=>{
        this.setState({serverId:value})
    }
    onYxChange=(value)=>{
        this.setState({yx:value})
    }
    onRadioChange = (v)=>{
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { orderList, serviceList, yxList } = this.state;
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
        const columns = [{
            title: '角色编号',
            dataIndex: 'playerId',
          }, {
            title: '创建时间',
            dataIndex: 'createTime',
            defaultSortOrder: 'descend',
            sorter: (a, b) => {
                return (new Date(a.createTime)).getTime()-(new Date(b.createTime)).getTime()
            },
          }, {
            title: '充值成功时间',
            dataIndex: 'succTime',
            defaultSortOrder: 'descend',
            sorter: (a, b) => {
                return (new Date(a.succTime)).getTime()-(new Date(b.succTime)).getTime()
            },
        }, {
            title: '人民币',
            dataIndex: 'money',
            defaultSortOrder: 'descend',
            sorter: (a, b) => {
                return a.money-b.money
            },
        },

        //  {
        //     title: '元宝数',
        //     dataIndex: 'diamond',
        // },
         {
            title: '平台订单号',
            dataIndex: 'platformOrderId',
        }, {
            title: '商品编号',
            dataIndex: 'productId',
        }, {
            title: '订单状态',
            dataIndex: 'statemsg',
          }];
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
                            {/* <FormItem {...formItemLayout} label={"当前页"} >
                                {getFieldDecorator('currPage', {
                                    rules: [{ required: false, message: '请输入当前页!' }],
                                })( 
                                    <Input placeholder="输入当前页" />
                                )}
                            </FormItem> */}
                            <FormItem {...formItemLayout} label={"最大记录数"} >
                                {getFieldDecorator('numPerPage', {
                                    rules: [{ required: true, message: '请输入最大记录数!' }],
                                })(
                                    <Input placeholder="输入最大记录数" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="订单类型"
                                >
                                {getFieldDecorator('containType',{ initialValue: '0' })(
                                    <RadioGroup onChange = {this.onRadioChange}>
                                    <Radio value="0">成功订单</Radio>
                                    <Radio value="1">全部订单</Radio>
                                    <Radio value="2">失败订单</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">查询订单</Button>
                                <Button type="primary" id='copyButton' style={{ marginLeft: 40 }} onClick = {this.copyClick}>复制</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
            <Card title="订单列表" id="orderList" style={{ minHeight: 380 }} >
                <Table onRowClick={this.onClick} rowKey="vid" columns={columns} dataSource={orderList} size="middle" />
                <textarea id="input" value='' style={{ position: 'absolute',top: '0',left: '0',opacity: '0',zIndex: '-10'}}>这是幕后黑手</textarea>
            </Card>
        </div >;
    }
}

export default Form.create()(OrderListInTime);
