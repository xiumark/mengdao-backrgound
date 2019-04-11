import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { getServiceList, getYxList, requestSendPureMail } from '../../api/service';

const buttonStyle = {
    margin: '10px',
    marginLeft:'0px',
    width: '40px',
  };
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
        <button id="decrece" style={buttonStyle} onClick = {e =>onClick(e)}>-</button>
        <Input style={{ margin: '7px 7px 7px -4px',textAlign:'center' }} value={value} onChange={e => onChange(e)}/>
        <button id="increce" style={buttonStyle} onClick = {e =>onClick(e)}>+</button>
        <button id="add" style={buttonAddStyle} onClick = {e =>onClick(e)}>添加</button>
    </div>
  );


class SendEmail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isPersonal:false, //默认用户名不需要填，当个人邮件被选中，用户名需要填
            key: 1,
            giftPackageItemsData: [
                // { key: '0', num:1,type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
                // { key: '1', num:1,type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
            ],
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
            giftContentData: [
                // { key: '1', num:1,type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
                // { key: '2', num:1,type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
            ],
            mailTypeList:[
                {mailType:'1',name:'个人邮件', key:1},
                {mailType:'2',name:'单服邮件', key:2}
            ],
            mailType:'1',
            isNotYxAllserver:true,
            isPlayerNameEditable:false,
            yxValue:'',
            playerName:'',
        };
        this.columns = [

            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '掉落字符串',
                dataIndex: 'wildCard',
                key: 'wildCard',
            },
            // {
            //     title: '类型',
            //     dataIndex: 'type',
            //     key: 'type',
            // },
            {
                title: '数量',
                dataIndex: 'num',
                key:'num',
                width: '25%',
                render: (textValue, tableItem) => this.renderColumns(textValue, tableItem, 'num'),
            },
        ];
        this.renderColumns = this.renderColumns.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onMailTypeChange = this.onMailTypeChange.bind(this);
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

    //发送邮件,发送文本邮件
    handleSubmit = (e) => { 
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { serverId,yx, playerName, mailContent, duration, title} = values;
                let {mailType} = this.state;
                if (serverId=='等待置为空'){//yx全服模式serverId为空，playerName为空
                    serverId='';
                    playerName='';
                }

                let playerNameStr = "";
                if (playerName) {
                    let playerNameArray = playerName.split('，');
                    playerNameStr = playerNameArray.join(',');
                }
                requestSendPureMail( mailType, serverId, yx, playerNameStr, mailContent, duration, title)
            }
        });
    }

    renderColumns(textValue, tableItem, column) {
        return (
          <EditableCell
            editable={true}
            value={textValue}
            onChange={(event) => this.handleChange(event, tableItem, column)}
            onClick ={(event) => this.handleClick(event, tableItem, column)}
          />
        );
    }

    handleChange(event,tableItem, column){//一个令人疑惑的巨大BUG，这个以及下一个函数内部不能放入console，否则不能打包。其他的地方却不受任何影响，很奇怪
        const {giftPackageItemsData} = this.state;
        let key = tableItem.key;
        giftPackageItemsData[key-1].num = event.target.value;
        this.setState({giftPackageItemsData:giftPackageItemsData})
    }
    handleClick(event, tableItem, column){
        let id = event.target.id;
        const key = tableItem.key//数组下标
        const {giftPackageItemsData} = this.state;
        if(id==='decrece'){
            giftPackageItemsData[key-1].num = tableItem.num-1>0?tableItem.num-1:1;
            this.setState({giftPackageItemsData:giftPackageItemsData})
        } else if(id==='increce'){
            giftPackageItemsData[key-1].num = tableItem.num+1;
            this.setState({giftPackageItemsData:giftPackageItemsData});
        } else if(id==='add'){
            const {giftContentData} = this.state;
            let filteredGiftContentData = giftContentData.filter((item)=>{
                return item.key != key
            })
            filteredGiftContentData.push(tableItem);//将添加的item加入数组最后一行
            this.setState({giftContentData:filteredGiftContentData});
        }
    }

    onMailTypeChange(v){
        if(v==1){
            this.setState({isPersonal: true,mailType:'1'});
        }else{
            this.setState({isPersonal: false,mailType:'2'});
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {filteredServiceList, yxList, mailTypeList, isPlayerNameEditable} = this.state;
        const {isPersonal } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 8 },
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
            <Card title="发送邮件" style={{}}>
                <Form id="email">
                    <Row>
                        <Col sm={8} md={8} xs={24}>
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
                            <FormItem {...formItemLayout} label="邮件类型" >
                                {getFieldDecorator('mailTyspe', {
                                    rules: [
                                        { required: true, message: '请选择邮件类型' },
                                    ],
                                })(
                                    <Select placeholder="请选择邮件类型" onChange = {(value)=>this.onMailTypeChange(value)}>
                                        {mailTypeList.map((item, index)=>{
                                            return <Option value={item.mailType} key = {item.key}>{item.name}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            
                            <FormItem {...formItemLayout} label={"目标用户名"} id="playerNameId" >
                                {getFieldDecorator('playerName', {
                                   rules: [{ required: isPersonal, message: '请输入目标用户名' }],
                                })(
                                    <Input placeholder="如：星星#5001,月亮#3016" disabled={isPlayerNameEditable} />
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"有效时间"} >
                                {getFieldDecorator('duration', {
                                    rules: [{ required: true, message: '请输入有效时间!' }],
                                })(
                                    <Input placeholder="请输入有效时间（分钟）" />
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={16} md={16} xs={24}>
                            <FormItem {...formItemLayout} label={"邮件名称"} >
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: '请输入邮件名称!' }],
                                })(
                                    <Input placeholder="请输入邮件名称" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"邮件正文"} >
                                {getFieldDecorator('mailContent', {
                                    rules: [{ required: true, message: '请输邮件正文' }],
                                })(
                                    <textarea style={{ minHeight: 200, width: "100%" }} placeholder="请输入邮件正文" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                    <FormItem {...tailFormItemLayout} >
                        <Button type="primary" htmlType="submit" id="textMail" style={{ marginLeft: 20}} onClick={this.handleSubmit}>发送文字邮件</Button>
                    </FormItem>
                    </Row>
                </Form>
            </Card>
        </div >;
    }
}

export default Form.create()(SendEmail);

const  MailType = {
    MAIL: 'mail',   //邮件
    TEXTMAIL:'textMail',     //文本邮件
}