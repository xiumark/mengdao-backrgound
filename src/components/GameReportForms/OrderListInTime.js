import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, DatePicker, TimePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';

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
     * 查询指定时间段的充值订单列表
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { yx, serverId, startTime, endTime, currPage, numPerPage} = values;
                startTime=startTime.format('YYYY-MM-DD HH:mm:ss');
                endTime=endTime.format('YYYY-MM-DD HH:mm:ss');
                let { orderList } = this.state;
                let querystring = `yx=${yx}&serverId=${serverId}&startTime=${startTime}&endTime=${endTime}&currPage=${currPage}&numPerPage=${numPerPage}`
                let url = "/root/getOrderListInTime.action"
                let method = 'POST'
                let successmsg = '查询成功'
                apiFetch(url, method, querystring, successmsg, (res) => {
                    let orderList = res.data.orderList;
                    for(let i=0;i<orderList.length;i++){
                        switch(orderList[i].state){
                            case 0: 
                                orderList[i].statemsg='新建';
                            break;
                            case 1: 
                                orderList[i].statemsg='已成功';
                            break;
                            case 2: 
                                orderList[i].statemsg='已失败';
                            break;
                            default:
                                orderList[i].statemsg='错误';
                        }
                    }
                    this.setState({orderList:orderList});
                })
            }
        });
    }

    onServerChange=(value)=>{
        this.setState({serverId:value})
    }
    onYxChange=(value)=>{
        this.setState({yx:value})
    }
    // buttonClick=(e)=>{
    //     console.log("e:", e)
    // }

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
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">查询订单</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
            <Card title="订单列表" id="orderList" style={{ minHeight: 380 }} >
                <Table onRowClick={this.onClick} rowKey="vid" columns={columns} dataSource={orderList} size="middle" />
            </Card>
        </div >;
    }
}

export default Form.create()(OrderListInTime);
