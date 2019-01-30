import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, Radio, DatePicker, TimePicker, Popconfirm  } from 'antd';
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList, getAllServerStateData, requestSetServerState } from '../../api/service';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { setActivityManageData } from '../../utils/cache';

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
            ],
            serverStateToChange:
            {
            },
        };

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
                title: '区服状态',
                dataIndex: 'serverState',
                key: 'serverState',
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key:'handle',
                width: '25%',
                render: (textValue, tableItem) => this.renderColumns(textValue, tableItem, 'handle'),
            },
        ];
        this.renderColumns = this.renderColumns.bind(this);
        this.chooseServerState = this.chooseServerState.bind(this);
        this.onServerChange = this.onServerChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }


    renderColumns(textValue, tableItem, column) {
        return (
            <div><button onClick ={(event) => this.chooseServerState(event, tableItem, column)}>选择本服</button></div>
        );
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        })
    }

    checkChange(e){
        this.props.form.setFieldsValue({
            serverState:e.target.value
          });
        this.setState({serverState:e.target.value});   //时间模式
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


    //设置区服状态
    onSetServerState=(e)=>{
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
                <Col className="gutter-row" md={12}>
                    <Card title="活动开启">
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
                                    <FormItem
                                        {...formItemLayout}
                                        label="游戏服状态"
                                        >
                                        {getFieldDecorator('serverState')(
                                            <RadioGroup onChange={this.checkChange}>
                                            <Radio value="1">新服</Radio>
                                            <Radio value="2">火爆</Radio>
                                            <Radio value="3">维护</Radio>
                                            <Radio value="4">关闭</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <FormItem {...tailFormItemLayout} >
                                    <Button type="primary" htmlType="submit" onClick = {this.onSetServerState}>修改状态</Button>
                                </FormItem>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card title="游戏服状态">
                        <Button type="primary"  style={{ marginBottom: 20}} onClick = {this.onGetClick}>获取游戏服</Button>
                        <Table pagination={{ pageSize: 10 }} columns={this.columnsAll} dataSource={allServerStateData} size={'small'} />
                    </Card>
                </Col>
            </Row>
        </div>;
    }
}
export default Form.create()(ServerPageState);
