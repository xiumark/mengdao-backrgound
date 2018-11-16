import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
import { isNotExpired, setSendGiftData } from '../../utils/cache';

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
// const buttonContetStyle={
//     width: '35px',
//     height: '30px',
//     border: '0px',
//     marginLeft: '5px',
//     paddingTop: '-2px',
//     backgroundColor: 'rgb(255,255,255)',
//     color: 'rgb(255, 25, 174)',
// }
const pStyle={
    paddingTop: '6px',
}

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



class GiftPackage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isPersonal:false,
            key: 1,
            giftPackageItemsData: [
                // { key: '0', num:1,type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
                // { key: '1', num:1,type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
                // { key: '2', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
            ],
            giftContentData: [
                // { key: '1', num:1,type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
                // { key: '2', num:1,type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
                // { key: '3', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
                // { key: '3', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
                // { key: '4', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
            ],
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
            yx:''
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
                width: '15%',
                render: (textValue, tableItem) => this.renderColumns(textValue, tableItem, 'num'),
            },
        ];
        this.renderColumns = this.renderColumns.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.format = this.format.bind(this);
        this.onServerChange = this.onServerChange.bind(this);
        this.onGiftTypeChange = this.onGiftTypeChange.bind(this);
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        });

        //根据缓存，填充表单数据
        let {sendGiftYx, sendGiftServerId, sendGiftGiftType, sendGiftPlayerName,
             sendGiftGiftContent, sendGiftDuration, sendGiftTitle}=localStorage;
        let yx, serverId, giftType, playerName, giftContent, duration, title;
        yx=sendGiftYx; 
        serverId=sendGiftServerId;
        giftType=sendGiftGiftType; 
        playerName=sendGiftPlayerName;
        giftContent=sendGiftGiftContent;
        duration=sendGiftDuration;
        title=sendGiftTitle;
        this.setInputValue(yx, serverId, giftType, playerName, giftContent, duration, title);
    }

    setInputValue=(yx, serverId, giftType, playerName, giftContent, duration, title)=>{
        let expireTime =localStorage.expireTime;  //获取过期时间
        if(isNotExpired(expireTime)){
            yx&&this.props.form.setFieldsValue({yx: `${yx}`});
            serverId&&this.props.form.setFieldsValue({serverId: `${serverId}`});
            giftType&&this.props.form.setFieldsValue({giftType: `${giftType}`});
            playerName&&this.props.form.setFieldsValue({playerName: `${playerName}`});
            giftContent&&this.props.form.setFieldsValue({giftContent: `${giftContent}`});
            duration&&this.props.form.setFieldsValue({duration: `${duration}`});
            title&&this.props.form.setFieldsValue({title: `${title}`});
            if(yx&&serverId){
                this.getPackageItemList(yx,serverId);
            }
        }
    }

    onYxChange=(value)=>{//渠道列表变换引起服务列表更新
        const{serviceList} = this.state;
        let filteredServiceList = serviceList.filter((item, index)=>{
            return item.yx===value;
        });
        this.setState({filteredServiceList:filteredServiceList,yx:value});
    }

    getYxList=(data)=>{//获取渠道列表
       getYxList(data,(yxList)=>{
        this.setState({yxList:yxList});
       });
    }

    renderColumns(textValue, tableItem, column) {
        return (
          <EditableCell
            // editable={tableItem.editable}
            editable={true}
            value={textValue}
            onChange={(event) => this.handleChange(event, tableItem, column)}
            onClick ={(event) => this.handleClick(event, tableItem, column)}
          />
        );
    }

    handleChange(event,tableItem, column){//一个令人疑惑的巨大BUG，这个以及下一个函数内部不能放入console，否则不能打包。其他的地方却不受任何影响，很奇怪
        const {giftPackageItemsData} = this.state;
        let key = tableItem.key
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
            this.setState({giftPackageItemsData:giftPackageItemsData})
        } else if(id==='add'){
            //向giftContentData添加数据
            const {giftContentData} = this.state;
            let filteredGiftContentData = giftContentData.filter((item)=>{
                return item.key != key
            })
            filteredGiftContentData.push(tableItem);//将添加的item加入数组最后一行
            this.setState({giftContentData:filteredGiftContentData});
        }
    }


    format(pattern, params){
        let lastIndex = -1;
        
        let result = "";
        let ifTake = true;
        for (let i = 0; i < pattern.length; i++) {
          if (pattern.charAt(i) == '{') {
             ifTake = false;
          } else if (pattern.charAt(i) == '}') {
             ifTake = true;
             lastIndex = lastIndex + 1;
             result = result + params[lastIndex];
          } else if (ifTake) {
             result = result + pattern.charAt(i);
          }
        }
         
        return result;
       }


    onServerChange(serverId){
        let {yx} = this.state;
        this.getPackageItemList(yx,serverId);
    }
    onGiftTypeChange(v){

        if(v==1){
            this.setState({isPersonal: true});
        }else{
            this.setState({isPersonal: false});
        }
    }

    getPackageItemList = (yx,serverId) => { //获取礼包信息列表
                const querystring = `yx=${yx}&serverId=${serverId}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/getItems.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    if (res.status !== 200) {
                        throw new Error('获取礼包信息失败')
                    }
                    return res.json()
                })
                    .then(res => {
                        let { giftPackageItemsData, key } = this.state;
                        giftPackageItemsData = [];
                        let items = res.items;
                        if (!items) {
                            throw new Error('获取礼包信息失败')
                        }
                        message.info("成功获取礼包信息")
                        key = 1;
                        for (let i = 0; i < items.length; i++) {
                            let data = items[i]
                            let tableItem = Object.assign(data, { key: key ,num:1});
                            giftPackageItemsData.push(tableItem);
                            key = key + 1;
                        }
                        this.setState({ giftPackageItemsData: giftPackageItemsData, key: key + 1 ,giftContentData:[] }, () => {
                        })
                    }).catch(err => {
                        message.error(err.message ? err.message : '未知错误');
                        this.setState({ giftPackageItemsData:[]});
                    })
    }

    handleSubmit = (e) => {//发送礼包
        e.preventDefault();
        
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {giftContentData}=this.state;
                let giftContentStr = '';
                for (let i=0;i<giftContentData.length;i++){
                    let itemStr=giftContentData[i].wildCard;
                    let handledStr = '';
                    let itemNum = new Array()
                    itemNum[0] = giftContentData[i].num;
                    handledStr = this.format(itemStr,itemNum);
                    giftContentStr = giftContentStr===''?giftContentStr + handledStr:giftContentStr +';'+ handledStr;
                }
                
                let {yx, serverId, giftType, playerName, giftContent, duration, title } = values;
                this.requestSearch(yx, serverId, giftType, playerName, giftContent, duration, title);
            }
        });
    }

    requestSearch=(yx, serverId, giftType, playerName, giftContent, duration, title)=>{
        const querystring = `yx=${yx}&serverId=${serverId}&giftType=${giftType}&playerName=${playerName}&giftContent=${giftContent}&duration=${duration}&title=${title}`
        let url = "/root/sendGift.action"
        let method = 'POST'
        let successmsg = '成功发送礼包'
        
        apiFetch(url, method, querystring, successmsg, (res) => {
            //请求成功后设置缓存
            setSendGiftData(yx, serverId, giftType, playerName, giftContent, duration, title);
        })
    }

    buttonDeleteClick=(item)=>{
        let key = item.key;
        const {giftContentData} = this.state;
        let newList = giftContentData.filter((item, index)=>{
            return item.key!==key
        })
        this.setState({giftContentData:newList});
    }

    render() {
        const {filteredServiceList, yxList} = this.state;
        const { getFieldDecorator } = this.props.form;
        const { isPersonal, giftPackageItemsData, giftContentData, serviceList } = this.state;
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
            <Card title="礼包管理">
                <Form onSubmit={this.handleSubmit} id="add">
                    <Row>
                        <Col className="gutter-row" md={8}>
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
                                        {serviceList.map((item, index) => {
                                            return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="礼包类型" >
                                {getFieldDecorator('giftType', {
                                    rules: [
                                        { required: true, message: '请选择礼包类型!' },
                                    ],
                                })(
                                    <Select placeholder="请选择礼包类型" onChange = {(value)=>this.onGiftTypeChange(value)}>
                                        <Option value="1">个人礼包</Option>
                                        <Option value="2">单服礼包</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"目标用户名"} >
                                {getFieldDecorator('playerName', {
                                    rules: [{ required: isPersonal, message: '请输入目标用户名!' }],
                                })(
                                    <Input placeholder="目标用户名" />
                                )}
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" md={16}>
                            <Row>
                                <Col md={12}>
                                    <FormItem {...formItemLayout} label={"礼品内容"} >
                                        {getFieldDecorator('giftContent', {
                                            rules: [{ required: giftContentData.length===0?true:false, message: '请输入礼品内容' }],
                                        })(
                                            <div className="gift-content" style={{ minHeight: 160, width: "120%", border: 'solid 1px #d9d9d9'}} placeholder="请输入礼品内容">
                                            {giftContentData.map((item, index)=>{
                                                let data = item
                                                return <div style={flex} key={item.key}>
                                                <p style={pStyle}>{`${item.name} 数量:${item.num}`}</p>
                                                <a className="btn-delete"  onClick = {(event)=>this.buttonDeleteClick(item)}>X</a>
                                                </div>
                                            })}
                                            </div>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={12}>
                                    <FormItem {...formItemLayout} label={"有效时间"} >
                                        {getFieldDecorator('duration', {
                                            rules: [{ required: true, message: '请输入有效时间!' }],
                                        })(
                                            <Input placeholder="有效时间" />
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label={"礼包的名称"} >
                                        {getFieldDecorator('title', {
                                            rules: [{ required: true, message: '请输入礼包的名称!' }],
                                        })(
                                            <Input placeholder="礼包的名称" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" md={12} sm={12}>
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">发送礼包</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Card>
                <Table pagination={{ pageSize: 15 }} columns={this.columns} dataSource={giftPackageItemsData} size={'small'} />
            </Card>
        </div >;
    }
}

export default Form.create()(GiftPackage);
