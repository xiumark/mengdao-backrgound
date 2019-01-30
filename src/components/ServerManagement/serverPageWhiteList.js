import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, Radio, DatePicker, TimePicker, Popconfirm  } from 'antd';
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
const FormItem = Form.Item;
const Option = Select.Option;
import { isNotExpired } from '../../utils/cache';

class serverPageWhiteList extends React.Component {
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

            yx:'',
            serverId:'',
            allUserWhiteData: [//游戏服状态信息
            ],
            whiteListToSet:
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
                title: '用户ID',
                dataIndex: 'uid',
                key: 'uid',
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key:'handle',
                width: '30%',
                render: (textValue, tableItem) => this.renderColumns(textValue, tableItem, 'handle'),
            },
        ];
        this.renderColumns = this.renderColumns.bind(this);
        this.chooseServerState = this.chooseServerState.bind(this);
    }


    renderColumns(textValue, tableItem, column) {
        return (
            <div><button onClick ={(event) => this.chooseServerState(event, tableItem, column)}>选择该用户</button></div>
        );
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        })
    }

    setInputValue=(yx, serverId)=>{
        let expireTime2 =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime2)){
            yx&&this.props.form.setFieldsValue({yx: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId: `${serverId}`});
            if(yx&&serverId){
                this.getAllActivityIds(yx,serverId);  //获取可配置的活动信息
                this.getAllUserWhiteData(yx,serverId);  //获取已配置的活动信息
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
    }

    getYxList=(data)=>{//获取渠道列表
        getYxList(data,(yxList)=>{
         this.setState({yxList:yxList});
        });
     }


    //游戏服状态选中
    chooseServerState(event, tableItem, column){
        this.setState({whiteListToSet:tableItem},()=>{
            this.props.form.setFieldsValue({yx:`${tableItem.yx}`,uid:`${tableItem.uid}`})
        });
    }

    //点击获取白名单列表
    onGetUserWhite=()=>{
        let {yx} = this.state;
        if(yx){
            this.getAllUserWhiteData(yx);
        }else{
            message.info('请选择渠道');
        }

    }
    
    //请求获取白名单列表
    getAllUserWhiteData=(yx)=>{
        const querystring = `yx=${yx}`
        let url = "/root/getUserWhite.action"
        let method = 'POST'
        let successmsg = '成功获得游戏服列表'
        apiFetch(url, method, querystring, successmsg, (res) => {
            let list = res.data.whiteList;
            let objList=[];
            if(list&&list.length>0){
                for(let i=0;i<list.length;i++){
                    let item = list[i];
                    objList.push({uid:item,yx:this.state.yx});
                };
            }
            this.setState({allUserWhiteData:objList});
        })
    }

    //设置区服状态
    onSetUserWhite=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { yx, uid} = values;
                this.requestSetUserWhite(yx, uid);
            }
        });
    }

    requestSetUserWhite=(yx, uid)=>{
        const querystring = `yx=${yx?yx:''}&uid=${uid?uid:''}`
        let url = "/root/setUserWhite.action"
        let method = 'POST'
        let successmsg = '成功设置游戏状态'
        apiFetch(url, method, querystring, successmsg, (res) => {
            this.onGetUserWhite();   //刷新页面
        })
    }

    render() {
        const {yxList, allUserWhiteData} = this.state;
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
                    <Card title="设置白名单">
                        <Form id="setUserWhite">
                            <Row>
                                <Col className="gutter-row">
                                    <FormItem {...formItemLayout} label="渠道" >
                                        {getFieldDecorator('yx', {
                                            rules: [
                                                { required: true, message: '请选择渠道' },
                                            ],
                                        })(
                                            <Select placeholder="可为空，若有多个yx，用:分隔" onChange = {(value)=>this.onYxChange(value)}>
                                                {yxList.map((item, index) => {
                                                    return <Option key={index} value={`${item.yx}`}>{item.yx}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label={"用户ID"} id="uid" >
                                        {getFieldDecorator('uid', {
                                        rules: [{ required:true, message: '请输入用户ID' }],
                                        })(
                                            <Input placeholder="输入用户ID" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <FormItem {...tailFormItemLayout} >
                                    <Button type="primary" htmlType="submit" onClick = {this.onSetUserWhite}>添加/删除</Button>
                                </FormItem>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card title="获取白名单游戏用户">
                        <Button type="primary"  style={{ marginBottom: 20}} onClick = {this.onGetUserWhite}>获取</Button>
                        <Table pagination={{ pageSize: 10 }} columns={this.columnsAll} dataSource={allUserWhiteData} size={'small'} />
                    </Card>
                </Col>
            </Row>
        </div>;
    }
}
export default Form.create()(serverPageWhiteList);
