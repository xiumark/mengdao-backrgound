import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList, getAllNoticeList } from '../../api/service';

const buttonAddStyle = {
    margin: '10px',
    marginLeft:'0px',
    width: '80px',
};

const flex = {
    display:"flex",
}

const EditableCell = ({ editable, value, onChange, onClick}) => (
    <div style={flex}>
        <button id="add" style={buttonAddStyle} onClick = {e =>onClick(e)}>添加</button>
    </div>
  );


class NoticeManage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            key: 1,
            serviceList: [
                {yx:'渠道1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
                {yx:'渠道1', serverId: "2", serverName: "sg_dev", serverState: 0 },
                {yx:'渠道2', serverId: "90002", serverName: "sg_90002", serverState: 0 }
            ],
            filteredServiceList: [
                {yx:'渠道1', serverId: "", serverName: "该渠道上所有服", serverState: 0 },  //serverId为空时传入的
                {yx:'渠道1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
                {yx:'渠道1', serverId: "2", serverName: "sg_dev", serverState: 0 },
            ],
            yxList:[
                {yx:'渠道1' ,key:1},
                {yx:'渠道2' ,key:2},
            ],
            playerName:'',
            allNoticeList: [
            ],
            selectedNotice: [
            ],
            serverId:'',
            yxValue:'',
        };
        this.columns = [

            {
                title: '公告ID',
                dataIndex: 'noticeId',
                key: 'noticeId',
            },
            {
                title: '公告内容',
                dataIndex: 'content',
                key: 'content',
            },
            // {
            //     title: '类型',
            //     dataIndex: 'type',
            //     key: 'type',
            // },
            {
                title: '操作',
                dataIndex: 'handle',
                key:'handle',
                width: '25%',
                render: (textValue, tableItem) => this.renderColumns(textValue, tableItem, 'handle'),
            },
        ];
        this.renderColumns = this.renderColumns.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onAllNoticeListItemClick = this.onAllNoticeListItemClick.bind(this);
        this.onServerChange = this.onServerChange.bind(this);
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        })
    }

    onYxChange=(value)=>{//渠道列表变换引起服务列表更新
        const{serviceList, yxValue} = this.state;
        let filteredServiceList = serviceList.filter((item, index)=>{
            return item.yx===value;
        });
        this.setState({yxValue:value});
        if(filteredServiceList[0].serverId!=="等待置为空"){
            filteredServiceList.unshift({yx:'555', serverId: "等待置为空", serverName: "该渠道上所有服", serverState: 0 });
        }
        this.setState({filteredServiceList:filteredServiceList});
    }

    getYxList=(data)=>{//获取渠道列表
       getYxList(data,(yxList)=>{
        this.setState({yxList:yxList});
       });
    }
    //修改
    noticeModify = (e)=>{
        let key = NoticeType.MODIFY;
        this.handleNotice(e,key);
    }
    //删除系统公告
    noticeDelete = (e)=>{
        let key = NoticeType.DELETE;
        this.handleNotice(e,key);
    }

    //请求
    handleNotice = (e,key) => { 
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {serverId,yxValue} = this.state
                let{noticeId,content} = values;
                if (serverId=='等待置为空'){//yx全服模式serverId为空，playerName为空
                    serverId='';
                }
                let querystring;
                let url;
                if(key==NoticeType.MODIFY){   //修改公告
                    querystring = `yx=${yxValue}&serverId=${serverId}&noticeId=${noticeId}&content=${content}`;
                    url = "/root/modifyNotice.action"
                }else if(key==NoticeType.DELETE){//删除公告;
                    querystring =  `yx=${yxValue}&serverId=${serverId}&noticeId=${noticeId}`;
                    url = "/root/deleteNotice.action"
                }
                let method = 'POST'
                let successmsg = e.target.id==NoticeType.MAIL?'修改成功':'删除成功';

                apiFetch(url, method, querystring, successmsg,()=>{
                    if(key==NoticeType.DELETE){
                        this.props.form.setFieldsValue({noticeId:'',content:''});
                    }
                    this.getAllNoticeList();
                });//请求后台
            }
        });
    }

    renderColumns(textValue, tableItem, column) {
        return (
          <EditableCell
            editable={true}
            value={textValue}
            onClick ={(event) => this.onAllNoticeListItemClick(event, tableItem, column)}
          />
        );
    }

    handleChange(event,tableItem, column){
        const {allNoticeList} = this.state;
        let key = tableItem.key;
        allNoticeList[key-1].num = event.target.value;
        this.setState({allNoticeList:allNoticeList})
    }

    onAllNoticeListItemClick(event, tableItem, column){
        let filteredSelectedNotice = [];
        filteredSelectedNotice.push({content:tableItem.content,noticeId:tableItem.noticeId,key:tableItem.key});//将添加的item加入数组最后一行
        this.setState({selectedNotice:filteredSelectedNotice});
        this.props.form.setFieldsValue({noticeId: `${tableItem.noticeId}`,content:`${tableItem.content}`});
    }

    onServerChange(v){
        this.setState({serverId:v},()=>{
            this.getAllNoticeList();
        });
    }
   
    getAllNoticeList = () => { //获取全部的公告信息列表
        const {yxValue,serverId} = this.state;
        getAllNoticeList(serverId,yxValue,(list)=>{
            this.setState({ allNoticeList: list});
        })

        // const {yxValue,serverId} = this.state;
        // const querystring = `serverId=${serverId}&yx=${yxValue}`;
        // let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        // let url = '/root/getAllNotices.action';
        // let method = 'POST'
        // let successmsg = '获取公告信息';

        // apiFetch(url, method, querystring, successmsg,(res)=>{
            
        // });//请求后台

        // fetch(`/root/getAllNotices.action`, {
        //     credentials: 'include', //发送本地缓存数据
        //     method: 'POST',
        //     headers: {
        //         headers
        //     },
        //     body: querystring
        // }).then(res => {
        //     if (res.status !== 200) {
        //         throw new Error('获取公告信息失败')
        //     }
        //     return res.json()
        // })
        //     .then(res => {
        //         let { allNoticeList, key } = this.state;
        //         allNoticeList = [];
        //         let items = res.data.notices;
        //         if (!items) {
        //             message.info("公告信息为空")
        //             this.setState({ allNoticeList: [] }, () => {
        //             });
        //         }else{
        //             key = 1;
        //             for (let i = 0; i < items.length; i++) {
        //                 let data = items[i]
        //                 let tableItem = Object.assign(data, { key: key});
        //                 allNoticeList.push(tableItem);
        //                 key = key + 1;
        //             }
        //             this.setState({ allNoticeList: allNoticeList, key: key + 1 }, () => {
        //             });
        //         }
        //     }).catch(err => {
        //         message.error(err.message ? err.message : '未知错误');
        //         this.setState({ allNoticeList: []});
        //     })
    }

    buttonDeleteClick=(item)=>{
        let key = item.key;
        const {selectedNotice} = this.state;
        let newList = selectedNotice.filter((item, index)=>{
            return item.key!==key
        })
        this.setState({selectedNotice:newList});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {filteredServiceList, yxList,allNoticeList} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 6,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        return <div>
            <Card title="公告管理" style={{}}>
                <Form id="email">
                    <Row>
                        <Col sm={12} md={12} xs={24}>
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
                                    <Select placeholder="选择服务器名称" onChange={(value)=>this.onServerChange(value)}>
                                        {filteredServiceList.map((item, index) => {
                                            return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"公告ID"} id="noticeId">
                                {getFieldDecorator('noticeId', {
                                    rules: [{ required: true, message: '请输入系统公告ID!' }],
                                })(
                                    <Input placeholder="请输入系统公告ID" />
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={12} md={12} xs={24}>
                            <FormItem {...formItemLayout} label={"公告内容"} >
                                {getFieldDecorator('content', {
                                    rules: [{ required: true, message: '请输入公告内容' }],
                                })(
                                    <textarea style={{ minHeight: 200, width: "100%" }} placeholder="请输入公告内容" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        
                    </Row>
                    <FormItem {...tailFormItemLayout} >
                        <Button type="primary" htmlType="submit" id="modify" onClick={this.noticeModify}>修改</Button>
                        <Button type="primary" htmlType="submit" id="delete" style={{ marginLeft: 20}} onClick={this.noticeDelete}>删除</Button>
                    </FormItem>
                </Form>
            </Card>
            <Card title="系统公告列表">
                <Table pagination={{ pageSize: 15 }} columns={this.columns} dataSource={allNoticeList} size={'small'} />
            </Card>
        </div >;
    }
}

export default Form.create()(NoticeManage);

const  NoticeType = {
    MODIFY: '修改',   //修改公告
    DELETE:'删除',    //删除公告
}