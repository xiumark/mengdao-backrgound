import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
import { getServiceList } from '../../api/service'
/**
 * 测试用
 */
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
const buttonContetStyle={
    width: '35px',
    height: '30px',
    border: '0px',
    marginLeft: '5px',
    paddingTop: '-2px',
    backgroundColor: 'rgb(255,255,255)',
    color: 'rgb(255, 25, 174)',
}
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


class SendEmail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            key: 1,
            giftPackageItemsData: [
                // { key: '0', num:1,type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
                // { key: '1', num:1,type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
                // { key: '2', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
            ],
            serviceList: [
                { serverId: "1", serverName: "sg_banshu", serverState: 0 },
                { serverId: "2", serverName: "sg_dev", serverState: 0 },
                { serverId: "90002", serverName: "sg_90002", serverState: 0 }
            ],
            giftContentData: [
                // { key: '1', num:1,type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
                // { key: '2', num:1,type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
                // { key: '3', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
                // { key: '3', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
                // { key: '4', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
            ]
        };
        this.columns = [
            {
                title: 'num',
                dataIndex: 'num',
                key:'num',
                width: '15%',
                render: (textValue, tableItem) => this.renderColumns(textValue, tableItem, 'num'),
            },
            {
                title: 'name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'type',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: 'wildCard',
                dataIndex: 'wildCard',
                key: 'wildCard',
            },
        ];
        this.renderColumns = this.renderColumns.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.format = this.format.bind(this);
    }


    componentDidMount() {
        getServiceList((res) => {
            this.setState({ serviceList: res })
        })
    }

    handleSubmit = (e) => { //发送邮件
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {giftContentData} =this.state;
                let giftContentStr = '';
                for (let i=0;i<giftContentData.length;i++){
                    let itemStr=giftContentData[i].wildCard;

                    let handledStr = '';
                    let itemNum = new Array()
                    itemNum[0] = giftContentData[i].num;
                    handledStr = this.format(itemStr,itemNum);
                    giftContentStr = giftContentStr===''?giftContentStr + handledStr:giftContentStr +';'+ handledStr;
                }



                let { mailType, serverId, playerName, attachmenet, mailContent, duration, title } = values;
                let querystring = `mailType=${mailType}&serverId=${serverId}&playerName=${playerName}&attachmenet=${giftContentStr}&mailContent=${mailContent}&duration=${duration}&title=${title}`
                let url = "/root/sendMail.action"
                let method = 'POST'
                let successmsg = '发送邮件成功'
                apiFetch(url, method, querystring, successmsg, (res) => {

                })
            }
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
        // console.log('eventvalue:',event.target.value)
        this.setState({giftPackageItemsData:giftPackageItemsData})
    }
    handleClick(event, tableItem, column){
        let id = event.target.id;
        const key = tableItem.key//数组下标
        const {giftPackageItemsData} = this.state;
        if(id==='decrece'){
            giftPackageItemsData[key-1].num = tableItem.num-1>=0?tableItem.num-1:0;
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

       getPackageItemList = () => { //获取礼包信息列表
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { serverId } = values;
                const querystring = `serverId=${serverId}`
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
                        for (let i = 0; i < items.length; i++) {
                            let data = items[i]
                            let tableItem = Object.assign(data, { key: key ,num:1});
                            giftPackageItemsData.push(tableItem);
                            key = key + 1;
                        }
                        this.setState({ giftPackageItemsData: giftPackageItemsData, key: key + 1 }, () => {
                        })
                    }).catch(err => {
                        message.error(err.message ? err.message : '未知错误')

                    })
            }
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
        const { getFieldDecorator } = this.props.form;
        const { serviceList, giftContentData, giftPackageItemsData } = this.state;
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
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        return <div>
            <Card title="发送邮件" style={{}}>
                {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                <Form onSubmit={this.handleSubmit} id="email">
                    <Row>
                        <Col sm={8} md={8} xs={24}>
                            <FormItem {...formItemLayout} label="邮件类型" >
                                {getFieldDecorator('mailType', {
                                    // rules: [
                                    //     { required: true, message: '请选择邮件类型' },
                                    // ],
                                })(
                                    <Select placeholder="请选择邮件类型">
                                        <Option value="1">个人邮件</Option>
                                        <Option value="2">单服邮件</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="服务器ID" >
                                {getFieldDecorator('serverId', {
                                    rules: [
                                        { required: true, message: '请选择服务器ID' },
                                    ],
                                })(
                                    <Select placeholder="选择服务器名称">
                                        {serviceList.map((item, index) => {
                                            return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            {/* <FormItem {...formItemLayout} label={"服务器Id"} >
                                {getFieldDecorator('serverId', {
                                    rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="请输入服务器Id" />
                                )}
                            </FormItem> */}
                            <FormItem {...formItemLayout} label={"目标用户名"} >
                                {getFieldDecorator('playerName', {
                                    // rules: [{ required: true, message: '请输入目标用户名' }],
                                })(
                                    <Input placeholder="请输入目标用户名（单服邮件可不填）" />
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"有效时间"} >
                                {getFieldDecorator('duration', {
                                    // rules: [{ required: true, message: '请输入有效时间!' }],
                                })(
                                    <Input placeholder="请输入有效时间（分钟）" />
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={8} md={8} xs={24}>
                            {/* <FormItem {...formItemLayout} label={"附件内容"} >
                                {getFieldDecorator('attachmenet', {
                                    rules: [{ required: true, message: '请输入附件内容' }],
                                })(
                                    <Input placeholder="请输入附件内容" />
                                )}
                            </FormItem> */}
                            <FormItem {...formItemLayout} label={"附件内容"} >
                                {getFieldDecorator('attachmenet', {
                                    // rules: [{ required: true, message: '请输入滚动次数' }],
                                })(
                                    <div className="gift-content" style={{ minHeight: 160, width: "120%", border: 'solid 1px #d9d9d9'}} placeholder="请输入附件内容">
                                    {giftContentData.map((item, index)=>{
                                        // console.log("item:", item)
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
                        <Col sm={8} md={8} xs={24}>
                            <FormItem {...formItemLayout} label={"邮件名称"} >
                                {getFieldDecorator('title', {
                                    // rules: [{ required: true, message: '请输入邮件名称!' }],
                                })(
                                    <Input placeholder="请输入邮件名称" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"邮件正文"} >
                                {getFieldDecorator('mailContent', {
                                    // rules: [{ required: true, message: '请输入滚动次数' }],
                                })(
                                    <textarea style={{ minHeight: 200, width: "100%" }} placeholder="请输入邮件正文" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="button" onClick={this.getPackageItemList}>获取附件信息列表</Button>
                            </FormItem>
                        </Col>
                        <Col md={12}>
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">发送邮件</Button>
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

export default Form.create()(SendEmail);
