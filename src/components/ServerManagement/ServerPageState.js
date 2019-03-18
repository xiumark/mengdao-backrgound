import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Table, Radio } from 'antd';
import './index.less';
import { getServiceList, getYxList, getAllServerStateData, requestSetServerState } from '../../api/service';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ServerPageState extends React.Component {
    constructor(props){
        super(props);
        this.state = {
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

            serverState:'1',
            yx:'',
            serverId:'',
            allServerStateData: [//游戏服状态信息
                {yx:'渠道1', serverId:"1", serverName:"sg_banshu1",  serverState:1,},
                {yx:'渠道2', serverId:"2", serverName:"sg_banshu2",  serverState:2,},
                {yx:'渠道3', serverId:"3", serverName:"sg_banshu3",  serverState:3,},
                {yx:'渠道4', serverId:"4", serverName:"sg_banshu4",  serverState:4,},
            ],
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
        this.onServerChange = this.onServerChange.bind(this);
    }
    
    //渲染单服操作选项
    renderHandleType(textValue, tableItem, column) {
        return (
            <div>
                <RadioGroup onChange={(event)=>this.checkSingleStateChange(event, tableItem, column)} value={tableItem.serverState+''}>
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
                <button style={{backgroundColor:this.getServerStateColor(tableItem.serverState), minWidth:'60'}} onClick ={(event) => this.chooseServerState(event, tableItem, column)}>{this.getServerStateText(tableItem.serverState)}</button>
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

    //单服状态修改
    checkSingleStateChange=(event, tableItem, column)=>{
        let v = event.target.value;
        this.requestSetServerState(tableItem.yx, tableItem.serverId, v);
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

    //游戏服状态选中
    chooseServerState(event, tableItem, column){
        this.setState({serverStateToChange:tableItem},()=>{
            this.props.form.setFieldsValue({serverState:`${tableItem.serverState}`})
        });
    }

    onServerChange(serverId){
        let {yx} = this.state;
        this.setState({serverId:serverId},()=>{
            this.getAllServerStateData(yx,serverId);
        })
    }

    //点击获取按钮
    onGetClick=()=>{
        let {yx,serverId} = this.state;
        if(yx&&serverId){
            this.getAllServerStateData(yx,serverId);
        }else{
            message.info('请选择渠道和区服');
        }
    }
    //获取服务列表数据
    getAllServerStateData=(yx,serverId)=>{
        getAllServerStateData(yx,serverId,(list)=>{
            this.setState({allServerStateData:list});
        });
    }

    //设置全渠道区服状态
    onSetYxServerState=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { yx, serverId, serverState} = values;
                this.requestSetServerState(yx, serverId, serverState);
            }
        });
    }
    
    requestSetServerState=(yx, serverId, serverState)=>{
        requestSetServerState(yx, serverId, serverState,()=>{
            this.onGetClick();
        })
    }

    render() {
        const {filteredServiceList, yxList, allServerStateData, serverState} = this.state;
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
                                            <Radio value="1">一键火爆</Radio>
                                            <Radio value="2">一键维护</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <FormItem {...tailFormItemLayout} >
                                    <Button type="primary" htmlType="submit" onClick = {this.onSetYxServerState}>确认</Button>
                                </FormItem>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col md={16}>
                    <Card title="单服操作">
                        {/* <Button type="primary"  style={{ marginBottom: 20}} onClick = {this.onGetClick}>获取游戏服</Button> */}
                        <Table pagination={{ pageSize: 10 }} columns={this.columnsAll} dataSource={allServerStateData} size={'small'} />
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
