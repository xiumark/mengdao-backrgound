import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { getServiceList, getYxList, getAuthGroupList, modityUserAuthGroup } from '../../api/service';


const buttonAddStyle = {
    margin: '10px',
    marginLeft:'0px',
    width: '80px',
};

const pStyle={
    paddingTop: '6px',
}

const flex = {
    display:"flex",
}

const EditableCell = ({ editable, value, onChange, onClick}) => (
    <div style={flex}>
        {/* <button id="decrece" style={buttonStyle} onClick = {e =>onClick(e)}>-</button> */}
        {/* <Input style={{ margin: '7px 7px 7px -4px',textAlign:'center' }} value={value} onChange={e => onChange(e)}/> */}
        {/* <button id="increce" style={buttonStyle} onClick = {e =>onClick(e)}>+</button> */}
        <button id="add" style={buttonAddStyle} onClick = {e =>onClick(e)}>操作</button>
    </div>
  );


class AuthManage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isPersonal:false, //默认用户名不需要填，当个人邮件被选中，用户名需要填
            key: 1,
            giftPackageItemsData: [
                // { key: '0', num:1,type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
                // { key: '1', num:1,type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
                // { key: '2', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
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
            authGroupToUpdate: [
                // { key: '1', num:1,type: 1, name: "元宝", wildCard: "sysDiamond:2:1000:{0}:0:0:0" },
                // { key: '2', num:1,type: 1, name: "银币", wildCard: "resource:2:1000:{0}:1:0:0" },
                // { key: '3', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
                // { key: '3', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
                // { key: '4', num:1,type: 1, name: "虎符", wildCard: "resource:2:1000:{0}:2:0:0" },
            ],
            mailTypeList:[
                {mailType:'1',name:'个人邮件', key:1},
                {mailType:'2',name:'单服邮件', key:2}
            ],
            isNotYxAllserver:true,
            isPlayerNameEditable:false,
            yxValue:'',
            playerName:'',

            authGroupData:[       //权限组列表
                // {authGroupId: 49, authGroupName: "5684", authIds: "1;2;4;"},
                // {authGroupId: 50, authGroupName: "5684", authIds: "1;2;4;"},
                // {authGroupId: 51, authGroupName: "5684", authIds: "1;2;4;"},
                // {authGroupId: 52, authGroupName: "5684", authIds: "1;2;4;"},
                // {authGroupId: 53, authGroupName: "5684", authIds: "1;2;4;"},
                // {authGroupId: 54, authGroupName: "5684", authIds: "1;2;4;"},
                // {authGroupId: 55, authGroupName: "5684", authIds: "1;2;4;"},
                // {authGroupId: 56, authGroupName: "5684", authIds: "1;2;4;"},
                // {authGroupId: 57, authGroupName: "5684", authIds: "1;2;4;"},
            ],
            authGroupToUpdate:[
                // {authGroupId: 49, authGroupName: "5684", authIds: "1;2;4;"},
            ]


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

        this.columnsAuthGroup = [

            {
                title: '权限组ID',
                dataIndex: 'authGroupId',
                key: 'authGroupId',
            },
            {
                title: '权限组名称',
                dataIndex: 'authGroupName',
                key: 'authGroupName',
            },
            {
                title: '权限组权限',
                dataIndex: 'authIds',
                key: 'authIds',
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
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.format = this.format.bind(this);
        this.onAuthManageTypeChange = this.onAuthManageTypeChange.bind(this);
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            // res.unshift(newelement1);
            this.setState({ serviceList: res, filteredServiceList: res});
        })
        this.getAuthGroupData()
    }

    getAuthGroupData=()=>{
        getAuthGroupList((list)=>{
            this.setState({authGroupData:list});
        })

        // let querystring;
        // let  url = "/root/getAuthGroupList.action"
        // let successmsg = '获取权限组列表';
        // let method = 'POST';
        // apiFetch(url, method, null, successmsg,(res)=>{
        //     let {authGroupData} = this.state;
        //     let authGroupList = res.data.authGroupInfo;
        //     this.setState({authGroupData:authGroupList});
        // });//请求后台
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


    //修改玩家所属的权限组列表
    handleSubmit = (e) => { 
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {authGroupToUpdate} =this.state;
                let authGroupId = authGroupToUpdate.length>0?authGroupToUpdate[0].authGroupId:'';
                let { userName} = values;
                modityUserAuthGroup(userName, authGroupId);
                // let querystring = `userName=${userName}&authGroupId=${authGroupId}`;
                // let url = "/root/modityUserAuthGroup.action";
                // let method = 'POST';
                // let successmsg ='修改成功';
                // apiFetch(url, method, querystring, successmsg);//请求后台
            }
        });
    }

    renderColumns(textValue, tableItem, column) {
        return (
          <EditableCell
            // editable={tableItem.editable}
            editable={true}
            value={textValue}
            // onChange={(event) => this.handleChange(event, tableItem, column)}
            onClick ={(event) => this.handleClick(event, tableItem, column)}
          />
        );
    }

    handleChange(event,tableItem, column){//一个令人疑惑的巨大BUG，这个以及下一个函数内部不能放入console，否则不能打包。其他的地方却不受任何影响，很奇怪
        const {giftPackageItemsData} = this.state;
        let key = tableItem.key;
        // console.log('handleChange():eventvalue:',event.target.value)
        giftPackageItemsData[key-1].num = event.target.value;
        this.setState({giftPackageItemsData:giftPackageItemsData})
    }

    // TODO  点击公告列表中的添加按钮，可以将内容填充到上方，方便操作，最多只能添加一个
    handleClick(event, tableItem, column){
        // let id = event.target.id;
        // const key = tableItem.key//数组下标
        // const {giftPackageItemsData} = this.state;
        // if(id==='decrece'){
        //     giftPackageItemsData[key-1].num = tableItem.num-1>0?tableItem.num-1:1;
        //     this.setState({giftPackageItemsData:giftPackageItemsData})
        // } else if(id==='increce'){
        //     giftPackageItemsData[key-1].num = tableItem.num+1;
        //     this.setState({giftPackageItemsData:giftPackageItemsData})
        // } else if(id==='add'){
        //     //向authGroupToUpdate添加数据
        //     const {authGroupToUpdate} = this.state;
        //     let filteredGiftContentData = authGroupToUpdate.filter((item)=>{
        //         return item.key != key
        //     })
        //     filteredGiftContentData.push(tableItem);//将添加的item加入数组最后一行
        //     this.setState({authGroupToUpdate:filteredGiftContentData});
        // }
        let item = {authGroupId:tableItem.authGroupId, authGroupName:tableItem.authGroupName, authIds:tableItem.authIds, key:tableItem.authGroupId}
        this.setState({authGroupToUpdate:[item]});
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


    onAuthManageTypeChange(v){
        if(v==1){
            this.setState({isPersonal: true});
        }else{
            this.setState({isPersonal: false});
        }
    }
        
    buttonDeleteClick=(item)=>{
        let key = item.key;
        const {authGroupToUpdate} = this.state;
        let newList = authGroupToUpdate.filter((item, index)=>{
            return item.key!==key
        })
        this.setState({authGroupToUpdate:newList});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {authGroupToUpdate, authGroupData } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 14 },
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
            <Card title="新增、修改、删除用户所属的权限组" style={{}}>
                <Form id="email">
                    <Row>
                        <Col sm={10} md={10} xs={24}>
                            
                            <FormItem {...formItemLayout} label={"用户名"} id="userName">
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: '请输入用户名!' }],
                                })(
                                    <Input placeholder="请输入用户名" />
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={14} md={14} xs={24}>
                            <FormItem {...formItemLayout} label={"更改所属权限组"} >
                                {getFieldDecorator('giftContent', {
                                })(
                                    <div className="gift-content" style={{ minHeight: 160, width: "120%", border: 'solid 1px #d9d9d9'}} placeholder="选择下方列表权限添加">
                                    {authGroupToUpdate.map((item, index)=>{
                                        let data = item
                                        return <div style={flex} key={item.key}>
                                        <p style={pStyle}>{`${item.authGroupId}  ${item.authGroupName}  ${item.authIds}`}</p>
                                        <a className="btn-delete"  onClick = {(event)=>this.buttonDeleteClick(item)}>X</a>
                                        </div>
                                    })}
                                    </div>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...tailFormItemLayout} >
                        <Button type="primary" htmlType="submit" id="create" onClick={this.handleSubmit}>确认</Button>
                    </FormItem>
                </Form>
            </Card>
            <Card title="用户可分配的权限组列表">
                <Table pagination={{ pageSize: 15 }} columns={this.columnsAuthGroup} dataSource={authGroupData} size={'small'} />
            </Card>
        </div >;
    }
}

export default Form.create()(AuthManage);


const  AuthManageType = {
    // CREATE: 'create',    //创建权限
    MODIFY: 'modify',    //修改权限
    // DELETE: 'delete',    //删除权限
}