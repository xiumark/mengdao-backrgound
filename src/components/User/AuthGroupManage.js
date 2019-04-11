import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { getServiceList, getYxList, getAuthList, handleAuthGroup,AuthManageType,getAuthGroupList } from '../../api/service';

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
        <button id="add" style={buttonAddStyle} onClick = {e =>onClick(e)}>添加</button>
    </div>
  );


class AuthGroupManage extends React.Component {
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

            ],

            allAuthListData:[
                // {authId: 11, authName: "发送邮件"},
                // {authId: 12, authName: "发送邮件"},
                // {authId: 17, authName: "发送邮件"},
            ],
            authListDataToEdit: [      //向后台发送的数据
                // {authId: 11, authName: "发送邮件"},
                // {authId: 12, authName: "发送邮件"},
                // {authId: 17, authName: "发送邮件"},
            ],
            key:'',
        };
        this.columns = [

            {
                title: '权限ID',
                dataIndex: 'authId',
                key: 'authId',
            },
            {
                title: '权限名称',
                dataIndex: 'authName',
                key: 'authName',
            },
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
                width: '30%',
                render: (textValue, tableItem) => this.renderGroupColumns(textValue, tableItem, 'handle'),
            },
        ];
        this.renderColumns = this.renderColumns.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onAuthManageTypeChange = this.onAuthManageTypeChange.bind(this);
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            // res.unshift(newelement1);
            this.setState({ serviceList: res, filteredServiceList: res});
        })

        this.onRequestAllAuthList();
        this.getAuthGroupData();
    }


    //获取权限组列表
    getAuthGroupData=()=>{
        setTimeout(()=>{
            getAuthGroupList((list)=>{
                this.setState({authGroupData:list});
                // if(this.state.key==AuthManageType.DELETE){
                    this.props.form.setFieldsValue({authGroupId:'',authGroupName:'',authList:[]});
                // }
            });
        },500,this)
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

    onRequestAllAuthList = (e) => { //获取全部权限列表
        getAuthList((res)=>{
            this.setState({ allAuthListData: res});    //排序完成后的权限列表
        });
    }

    
    getAuthStr = (e)=>{
        let {authListDataToEdit} = this.state;
        let authStr ='';
        for (let i=0;i<authListDataToEdit.length;i++) {
            let item = authListDataToEdit[i];
          authStr=authStr+item.authId+':'
        }
        return authStr;
    }


    authCreate = (e)=>{
        let key = AuthManageType.CREATE;
        this.handleAuthGroup(e,key);
    }
    authModify = (e)=>{
        let key = AuthManageType.MODIFY;
        this.handleAuthGroup(e,key);
    }
    authDelete = (e)=>{
        let key = AuthManageType.DELETE;
        this.handleAuthGroup(e,key);
    }

    handleAuthGroup = (e,key) => { 
        this.setState({key:key})
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { authGroupName, authGroupId} = values;
                let authStr = this.getAuthStr();
                handleAuthGroup(key,authGroupName, authGroupId,authStr,()=>{
                    this.getAuthGroupData();
                });

                // let querystring;
                // let url;
                // let successmsg;
                // let method = 'POST'
                // if(key==AuthManageType.CREATE){      //创建权限组
                //     querystring = `authGroupName=${authGroupName}&auths=${authStr}`;
                //     url = "/root/createAuthGroup.action"
                //     successmsg = '创建成功';
                // }else if(key==AuthManageType.MODIFY){//修改权限组
                //     querystring = `authGroupId=${authGroupId}&auths=${authStr}`;
                //     url = "/root/modifyAuthGroup.action"
                //     successmsg = '修改成功';
                // }else if(key==AuthManageType.DELETE){//删除权限组
                //     querystring = `authGroupId=${authGroupId}`;
                //     url = "/root/deleteAuthGroup.action"
                //     successmsg = '删除成功';
                // }
                // apiFetch(url, method, querystring, successmsg,()=>{
                //     this.getAuthGroupData();
                // });
            }
        });
    }




    renderColumns(textValue, tableItem, column) {
        return (
          <EditableCell
            // editable={tableItem.editable}
            // editable={true}
            value={textValue}
            // onChange={(event) => this.handleChange(event, tableItem, column)}
            onClick ={(event) => this.handleClick(event, tableItem, column)}
          />
        );
    }


    renderGroupColumns(textValue, tableItem, column) {
        return (
            <div><button onClick ={(event) => this.chooseAuthGroup(event, tableItem, column)}>选择该组</button></div>
        );
    }


    //点击，填充form表单
    chooseAuthGroup(event, tableItem, column){
        //

        let auths = tableItem.authIds;
        let authListDataToEditData = this.getAuthListDataByAuths(auths);
        this.setState({
            authIds:tableItem.authIds, 
            authListDataToEdit:authListDataToEditData
        },()=>{
            this.props.form.setFieldsValue({authGroupId:`${tableItem.authGroupId}`,authGroupName:`${tableItem.authGroupName}`})
        });
    }


    //根据权限id字符串获得对应的权限信息列表
    getAuthListDataByAuths=(auths)=>{
        let authList = auths.split(';');
        let rtList= [];
        let {allAuthListData} = this.state;
        if(!allAuthListData){
            message.info('请先获取权限列表');
            return;
        }
        for (let i=0;i<authList.length;i++) {
            let item = authList[i];
            for (let i=0;i<allAuthListData.length;i++) {
                let jtem = allAuthListData[i];
                if(item==jtem.authId){
                    rtList.push(jtem);
                }
            }
        }
        return rtList;


    }

    handleChange(event,tableItem, column){
        const {giftPackageItemsData} = this.state;
        let key = tableItem.key;
        giftPackageItemsData[key-1].num = event.target.value;
        this.setState({giftPackageItemsData:giftPackageItemsData})
    }

    
    handleClick(event,tableItem,column){
        const key = tableItem.key//数组下标
        const {authListDataToEdit} = this.state;
        let filteredAuthListDataToEdit = authListDataToEdit.filter((item)=>{
            return item.key != key
        })
        filteredAuthListDataToEdit.push(tableItem);//将添加的item加入数组最后一行
        this.setState({authListDataToEdit:filteredAuthListDataToEdit});
    }


    onAuthManageTypeChange(v){
        if(v==1){
            this.setState({isPersonal: true});
        }else{
            this.setState({isPersonal: false});
        }
    }


    onButtonDeleteClick=(item)=>{
        let key = item.key;
        const {authListDataToEdit} = this.state;
        let newList = authListDataToEdit.filter((item, index)=>{
            return item.key!==key
        })
        this.setState({authListDataToEdit:newList});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {authListDataToEdit, allAuthListData, authGroupData } = this.state;
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
        <Row>
            <Col sm={16} md={16} xs={24}>
                <Card title="权限组管理" >
                    <Form id="email">
                        <Row>
                            <Col sm={24} md={24} xs={24}>
                                <FormItem {...formItemLayout} label={"权限组ID"} id="authGroupId">
                                    {getFieldDecorator('authGroupId', {
                                        // rules: [{ required: true, message: '请输入权限组ID' }],
                                    })(
                                        <Input placeholder="请输入权限组ID" />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label={"权限名称"} id="authGroupName">
                                    {getFieldDecorator('authGroupName', {
                                        // rules: [{ required: true, message: '请输入权限组名称' }],
                                    })(
                                        <Input placeholder="请输入权限组名称" />
                                    )}
                                </FormItem>
                                
                                <FormItem {...formItemLayout} label={"权限组权限列表(点击右边添加)"} >
                                    {getFieldDecorator('authList', {
                                        // rules: [{ required: authListDataToEdit.length===0?true:false, message: '请添加权限' }],
                                    })(
                                        <div className="gift-content" style={{ minHeight: 160, width: "100%", border: 'solid 1px #d9d9d9'}} placeholder="选择下方列表权限添加">
                                        {authListDataToEdit.map((item, index)=>{
                                            let data = item
                                            return <div style={flex} key={item.key}>
                                            <p style={pStyle}>{`${item.authId}  ${item.authName}`}</p>
                                            <a className="btn-delete"  onClick = {(event)=>this.onButtonDeleteClick(item)}>X</a>
                                            </div>
                                        })}
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem {...tailFormItemLayout} >
                                    <Button type="primary" htmlType="submit" id="create" onClick={this.authCreate}>{AuthManageType.CREATE}</Button>
                                    <Button type="primary" htmlType="submit" id="modify" style={{ marginLeft: 20}} onClick={this.authModify}>{AuthManageType.MODIFY}</Button>
                                    <Button type="primary" htmlType="submit" id="delete" style={{ marginLeft: 20}} onClick={this.authDelete}>{AuthManageType.DELETE}</Button>
                                </FormItem>
                            </Col>
                            <Col sm={24} md={24} xs={24}>
                                <Button type="primary" htmlType="submit" id="get" style={{ marginBottom: 10}} onClick={this.getAuthGroupData}>获得权限组列表</Button>
                                <Table pagination={{ pageSize: 8 }} columns={this.columnsAuthGroup} dataSource={authGroupData} size={'small'} />
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
            <Col sm={8} md={8} xs={24}>
                <Card title="用户可分配的权限组列表">
                    <Button type="primary" htmlType="submit" id="get" style={{ marginBottom: 10}} onClick={this.onRequestAllAuthList}>获得权限列表</Button>
                    <Table pagination={{ pageSize: 12 }} columns={this.columns} dataSource={allAuthListData} size={'small'} /> 
                </Card>
            </Col>
        </Row>
        </div >;
    }
}

export default Form.create()(AuthGroupManage);


// export const  AuthManageType = {
//     CREATE: '创建',    //创建权限组
//     MODIFY: '修改',    //修改权限组
//     DELETE: '删除',    //删除权限组
// }