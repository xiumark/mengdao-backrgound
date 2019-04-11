import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Table, Radio } from 'antd';
import './index.less';
import { getServiceList, getYxList, getServerStateDataByYxAndServerId, requestSetServerState } from '../../api/service';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ServerPageState extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            serviceList: [
                // {yx:'渠道1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
                // {yx:'渠道1', serverId: "2", serverName: "sg_dev", serverState: 0 },
                // {yx:'渠道2', serverId: "90002", serverName: "sg_90002", serverState: 0 }
            ],
            filteredServiceList: [
                // {yx:'渠道1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
                // {yx:'渠道1', serverId: "2", serverName: "sg_dev", serverState: 0 },
            ],
            yxList:[
                // {yx:'渠道1' ,key:1},
                // {yx:'渠道2' ,key:1},
            ],

            serverState:'1',
            yx:'',
            serverId:'',

            serverStateToChange:
            {
            },
        };

        /**游戏服状态显示 */
        this.columnsAll = [
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
                title: '区服名称',
                dataIndex: 'serverName',
                key: 'serverName',
            },
            {
                title: '区服状态标识',
                dataIndex: 'serverState',
                key:'serverState',
                width: '15%',
                render: (textValue, tableItem) => this.renderServerState(textValue, tableItem, 'serverState'),
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key:'handle',
                width: '35%',
                render: (textValue, tableItem) => this.renderHandleType(textValue, tableItem, 'handle'),
            },
        ];
        this.renderHandleType = this.renderHandleType.bind(this);
        this.chooseServerState = this.chooseServerState.bind(this);
    }
    
    //渲染单服操作选项
    renderHandleType(textValue, tableItem, column) {
        return (
            <div>
                <RadioGroup onChange={(event)=>this.onSingleStateChange(event, tableItem, column)} value={tableItem.serverState+''}>
                    <Radio value="1">新服</Radio>
                    <Radio value="2">火爆</Radio>
                    <Radio value="3">维护</Radio>
                    <Radio value="4">关闭</Radio>
                </RadioGroup>
            </div>
        );
    }

    //用颜色和文本标识状态
    renderServerState(textValue, tableItem, column) {
        return (
            <div>
                <button style={{backgroundColor:this.getServerStateColor(tableItem.serverState), minWidth:'60',minHeight:'30'}} onClick ={(event) => this.chooseServerState(event, tableItem, column)}>{this.getServerStateText(tableItem.serverState)}</button>
            </div>
        );
    }

    getServerStateColor = (serverState)=>{
        if((serverState==ServerState.HOT)){     //火爆
            return ServerStateColor.HOT;
        }else if(serverState==ServerState.NEW){ //新服
            return ServerStateColor.NEW;
        }else{                                  //维护||关闭
            return ServerStateColor.MAINTENANCE;
        }
    }
    
    getServerStateText = (serverState)=>{
        if((serverState==ServerState.HOT)){             //火爆
            return '火爆';
        }else if(serverState==ServerState.NEW){         //新服
            return '新服';
        }else if(serverState==ServerState.MAINTENANCE){ //维护
            return '维护';
        }else if(serverState==ServerState.CLOSE){       //关闭
            return '关闭';
        }
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        })
    }

    //全服状态操作
    checkYxStateChange=(e)=>{
        this.props.form.setFieldsValue({
            serverState:e.target.value
          });
        this.setState({serverState:e.target.value});  
    }



    onYxChange=(value)=>{//渠道列表变换引起服务列表更新
        getServiceList((res) => {
            let serviceList = res;
            this.getYxList(res);
            let filteredServiceList = serviceList.filter((item)=>{
                return item.yx===value;
            });
            this.setState({serviceList: res, filteredServiceList:filteredServiceList, yx:value});
        })
        
    }

    getYxList=(data)=>{//获取渠道列表
        getYxList(data,(yxList)=>{
         this.setState({yxList:yxList});
        });
     }

    //游戏服状态选中
    chooseServerState(event, tableItem, column){
        this.setState({serverStateToChange:tableItem},()=>{
            this.props.form.setFieldsValue({serverState:`${tableItem.serverState}`})
        });
    }



    //单服设置成功
    onServerStateSetSuc=()=>{
        let {yx,serverId} = this.state;
        if(yx&&serverId&&serverId!=''){
            // this.getServerStateDataByYxAndServerId(yx,serverId);
            this.getServerStateDataByYx(yx);
        }else if(yx&&(yx!='')){
            this.getServerStateDataByYx(yx);
        }else{
            this.getServerStateDataByNoYx();
            // message.info('请选择渠道,或者渠道和区服');
        }
    }

    //获取渠道和serverId对应的服务列表数据
    getServerStateDataByYxAndServerId=(yx,serverId)=>{
        getServerStateDataByYxAndServerId(yx,serverId,(list)=>{
            this.setState({filteredServiceList:list});
        });
    }

    //获取全部服务列表数据
    getServerStateDataByNoYx = (yx)=>{
        getServerStateDataByYxAndServerId('','',(list)=>{
            this.setState({filteredServiceList:list});
        });
    }
    //获取渠道对应的服务列表数据
    getServerStateDataByYx = (yx)=>{
        getServerStateDataByYxAndServerId(yx,'',(list)=>{
            this.setState({filteredServiceList:list});
        });
    }

    //设置全渠道区服状态
    onYxStateChange = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { yx, serverState} = values;
                this.setServerState(yx, '', serverState);
            }
        });
    }

    //设置单服状态
    onSingleStateChange=(event, tableItem, column)=>{
        let v = event.target.value;
        this.setServerState(tableItem.yx, tableItem.serverId, v);
    }
    
    //请求
    setServerState=(yx, serverId, serverState)=>{
        requestSetServerState(yx, serverId, serverState,()=>{
            this.setState({yx:yx,serverId:serverId},()=>{
                this.onServerStateSetSuc();
            });
        })
    }

    render() {
        const {filteredServiceList, yxList} = this.state;
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
                <Col className="gutter-row" md={8}>
                    <Card title="全服操作">
                        <Form id="serverPageState">
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
                                        {getFieldDecorator('serverState', {
                                            rules: [
                                                { required: true, message: '请选操作方式' },
                                            ],
                                        })(
                                            <RadioGroup onChange={this.checkYxStateChange}>
                                            <Radio value="2">一键火爆</Radio>
                                            <Radio value="3">一键维护</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <FormItem {...tailFormItemLayout} >
                                    <Button type="primary" htmlType="submit" onClick = {this.onYxStateChange}>确认</Button>
                                </FormItem>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col md={16}>
                    <Card title="单服操作">
                        <Table pagination={{ pageSize: 10 }} columns={this.columnsAll} dataSource={filteredServiceList} size={'small'} />
                    </Card>
                </Col>
            </Row>
        </div>;
    }
}
export default Form.create()(ServerPageState);


//1新服2火爆3维护4关闭
const ServerState = {
    NEW:'1',            //新服
    HOT:'2',            //火爆
    MAINTENANCE:'3',    //维护
    CLOSE:'4',          //关闭
}

//不同状态的颜色显示
const ServerStateColor = {
    NEW:'#75E356',            //新服(推荐)
    HOT:'#FF6600',            //火爆
    MAINTENANCE:'#999999',    //维护
    CLOSE:'#999999',          //关闭
}
