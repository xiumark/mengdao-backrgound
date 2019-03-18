import React from 'react';
import { Card, Form, Button, Row, Col, Input, Table, message,Modal,Radio } from 'antd';
import './index.less';
import { getAuthList, createUser,deleteUser, getAuthGroupList, changePassword, resetPassword, getAllCreateUsers,modityUserAuthGroup  } from '../../api/service';
import { hex_md5 } from '../../../public/md5';
import TableModal from '../common/TableModal';          //类的实现方式
import TableModalF from '../common/TableModalFunc';     //函数的实现方式
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class AddUser extends React.Component {
    constructor(props) {
        super(props),
            this.state = {
                authListData: [
                    // { key: 6, authId: 6, authName: "禁言" },
                ],
                authGroupData:[       //权限组列表
                    // {authGroupId: 49, authGroupName: "5684", authIds: "1;2;4;"},
                    // {authGroupId: 50, authGroupName: "5684", authIds: "1;2;4;"},
                ],
                authGroupDataChoose:{},
                modalVisible: false,
                userList:[            //已经创建的用户的列表
                    {userId:''  , userName:'' , email:'' , authGroupId:'' , auths:'' , state:'' },
                    {userId:''  , userName:'' , email:'' , authGroupId:'' , auths:'' , state:'' },
                    ],
                selectedUser:{userId:''  , userName:'' , email:'' , authGroupId:'' , auths:'' , state:'' },
                handleType:'1',         //操作方式，1,2,3,4 控制组件的显示
            },
            this.columns = [
                {
                    title: '权限id',
                    dataIndex: 'authId',
                    key: 'authId',
                },
                {
                    title: '权限名称',
                    dataIndex: 'authName',
                    key: 'authName',
                },
            ],
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
            this.columnsCreatedUser = [
                {
                    title: '用户ID',
                    dataIndex: 'userId',
                    key: 'userId',
                },
                {
                    title: '用户名称',
                    dataIndex: 'userName',
                    key: 'userName',
                },
                {
                    title: '邮箱地址',
                    dataIndex: 'email',
                    key: 'email',
                },
                {
                    title: '权限组权限',
                    dataIndex: 'authGroupId',
                    key: 'authGroupId',
                },
                {
                    title: '权限列表',
                    dataIndex: 'auths',
                    key: 'auths',
                },
                {
                    title: '权限组权限',
                    dataIndex: 'state',
                    key: 'state',
                },
                {
                    title: '操作',
                    dataIndex: 'handle',
                    key:'handle',
                    width: '30%',
                    render: (textValue, tableItem) => this.renderCreatedUserColumns(textValue, tableItem, 'handle'),
                },
            ];
    }

    //已创建用户选择按钮
    renderCreatedUserColumns(textValue, tableItem, column) {
        return (
            <div><button onClick ={(event) => this.chooseCreatedUser(event, tableItem, column)} style={tableItem.selected?{'background-color': '#108ee9'}:{}}>{tableItem.selected?'已选该用户':'选择该用户'}</button></div>
        );
    }

    //点击，选择要用天聪的数据
    chooseCreatedUser(event, tableItem, column){
        this.props.form.setFieldsValue({authGroupId:`${tableItem.authGroupId}`})
        let userList = this.state.userList;
        let selectedUser;
        let newUserList = userList.map((item)=>{
            if(item.userId == tableItem.userId){
                item.selected = true;
                selectedUser = item;
            }else{
                item.selected = false;
            }
            return item;
        });
        this.setState({userList:newUserList,selectedUser:selectedUser});   //新的用户列表和已经选中的用户
    }

    componentDidMount() {
        this.getAuthGroupData();
        // this.requestAllCreateUsers();//获取最新的用户信息
    }

    //获取已经创建的用户的信息
    requestAllCreateUsers=()=>{
        getAllCreateUsers((list)=>{
            this.setState({userList:list});
        })
    }

    handleButtonClick = (e) => { //获取权限列表
        // getAuthList((res)=>{
        //     this.setState({ authListData: res});    //排序完成后的权限列表
        // });
    }

    renderGroupColumns(textValue, tableItem, column) {
        return (
            <div><button onClick ={(event) => this.chooseAuthGroup(event, tableItem, column)}>选择该组</button></div>
        );
    }

    
    //点击，填充form表单中的权限组id
    chooseAuthGroup(event, tableItem, column){
        this.props.form.setFieldsValue({authGroupId:`${tableItem.authGroupId}`})
        // let userList = this.state.userList;

    }

    handleSubmit = (e) => {
        e.preventDefault();
        //根据状态控制不同的合法验证
        let handleType = this.state.handleType;
        if(handleType==HandleType.ADD){             //创建用户
            this.validateFields(['userName','password','email','authGroupId'],(values)=>{
                let { userName, password, email, authGroupId } = values;
                let md5password = hex_md5(password);
                createUser(userName, md5password, email,authGroupId,()=>{
                    // this.requestAllCreateUsers();   //刷新用户列表
                });
            });
            // this.props.form.validateFields(['userName','password','email','authGroupId'],(err, values) => {
            //     if (!err) {
            //         let { userName, password, email, authGroupId } = values;
            //         let md5password = hex_md5(password);
            //         createUser(userName, md5password, email,authGroupId);
            //     }
            // });
        }else if(handleType==HandleType.DELETE){    //删除用户
            this.validateFields(['userName'],(values)=>{
                let { userName } = values;
                deleteUser(userName,()=>{
                    this.props.form.setFieldsValue({userName:''})
                });
            });
        }else if(handleType==HandleType.RESET){     //重置密码
            this.validateFields(['userName'],(values)=>{
                let { userName } = values;
                resetPassword(userName);
            });
        }else if(handleType==HandleType.AUTH){      //修改权限
            this.validateFields(['userName','authGroupId'],(values)=>{
                let { userName, authGroupId } = values;
                modityUserAuthGroup(userName, authGroupId);
            });
        }
    }

    validateFields=(keyArray,cb)=>{
        this.props.form.validateFields(keyArray,(err, values) => {
            if (!err) {
                cb&&cb(values);
                // let { userName, password, email, authGroupId } = values;
                // let md5password = hex_md5(password);
                // createUser(userName, md5password, email,authGroupId);
            }
        });
    }
    //获取权限组列表
    getAuthGroupData=()=>{
        setTimeout(()=>{
            getAuthGroupList((list)=>{
                this.setState({authGroupData:list});
                // this.props.form.setFieldsValue({authGroupId:'',authGroupName:'',authList:[]});
            });
        },500,this)
    }

    //打开弹出面板，显示已经创建的用户的列表
    showModal=()=>{
        // this.requestAllCreateUsers((list)=>{
        //     this.setState({modalVisible: !this.state.modalVisible});
        // })

        getAllCreateUsers((list)=>{
            this.setState({userList:list,modalVisible: !this.state.modalVisible});
        })
        

    }

    //modal中取消
    handleCancel=()=>{
        this.setState({modalVisible:false})
    }

    //modal中选中指定用户
    handleOk=(e)=>{
        let data = e
        this.setState({modalVisible:false});
        let selectedUser  = this.state.selectedUser;
        //填充玩家信息，包括用户名和用户权限
        // this.props.form.setFieldsValue
        this.props.form.setFieldsValue({userName:`${selectedUser.userName}`,authGroupId:`${selectedUser.authGroupId}`})
    }


    //操作方式单选按钮改变
    checkChange=(e)=>{
        // debugger
        this.setState({handleType:e.target.value});
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const { authGroupData, userList,handleType } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 4,
                },
                sm: {
                    span: 24,
                    offset: 4,
                },
                md: {
                    span: 24,
                    offset: 2,
                },
                lg: {
                    span: 24,
                    offset: 2,
                }
            },
        };
        return <div>
            <Card title="用户管理">
                <Row>
                    <Col className="gutter-row" md={14} sm={24} xs={24}>
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form onSubmit={this.handleSubmit} id="add">
                            <FormItem
                                {...formItemLayout}
                                label="操作类型"
                                >
                                {getFieldDecorator('handleType',{ initialValue: '1',rules: [
                                    { required: true, message: '请选择操作方式' },
                                ], })(
                                    <RadioGroup onChange={this.checkChange} >
                                    <Radio value="1">创建用户</Radio>
                                    <Radio value="2">重置密码</Radio>
                                    <Radio value="3">删除用户</Radio>
                                    <Radio value="4">更改权限</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"用户名"}>
                            <Row gutter={8}>
                                <Col span={12}sm={14} xs={14}>
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: '请输入用户名' }],
                                    })(
                                        <Input placeholder="请输入用户名" />
                                    )}
                                </Col>
                                {handleType!=HandleType.ADD&&
                                <Col sm={8} xs={8}>
                                    <Button type="primary" onClick = {this.showModal} disabled = {false}>选择已创建用户</Button>
                                    <TableModal title="已创建用户"
                                        visible={this.state.modalVisible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                        pagination={{ pageSize: 8 }} columns={this.columnsCreatedUser} dataSource={userList} size={'small'}>
                                    </TableModal>
                                </Col>}
                            </Row>
                            </FormItem>
                            {handleType==HandleType.ADD&&
                            <FormItem {...formItemLayout} label={"用户密码"} >
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入用户密码' }],
                                })(
                                    <Input type="password" placeholder="请输入用户密码" />
                                )}
                            </FormItem>}
                            {handleType==HandleType.ADD&&
                            <FormItem {...formItemLayout} label={"用户邮箱"} >
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: '请输入用户邮箱' }],
                                })(
                                    <Input placeholder="请输入用户邮箱" />
                                )}
                            </FormItem>}
                            {/* <FormItem {...formItemLayout} label={"用户权限"} >
                                {getFieldDecorator('auths', {
                                    rules: [{ required: false, message: '请输入用户权限Id' }],
                                })(
                                    <Input placeholder="用户权限Id（用冒号隔开）" />
                                )}
                            </FormItem> */}
                            {(handleType==HandleType.ADD||handleType==HandleType.AUTH)&&
                            <FormItem {...formItemLayout} label={"用户权限组"} >
                                {getFieldDecorator('authGroupId', {
                                    rules: [{ required: true, message: '请输入用户权限组Id' }],
                                })(
                                    <Input placeholder="输入用户权限组Id" />
                                )}
                            </FormItem>}
                            <FormItem {...tailFormItemLayout} style={{ textAlign: 'center'}} >
                                <Button type="primary" htmlType="submit" disabled={handleType==HandleType.ADD?false:true}>创建用户</Button>
                                <Button type="primary" htmlType="submit"style={{ marginLeft: 12}} disabled={handleType==HandleType.RESET?false:true}>重置密码</Button>
                                <Button type="primary" htmlType="submit"style={{ marginLeft: 12}} disabled={handleType==HandleType.DELETE?false:true}>删除账号</Button>
                                <Button type="primary" htmlType="submit"style={{ marginLeft: 12}} disabled={handleType==HandleType.AUTH?false:true}>更改权限</Button>
                            </FormItem>
                        </Form>
                    </Col>

                    {/* <Col className="gutter-row" md={2}> */}
                    {/* <span>创建用户名：</span> */}
                    {/* </Col> */}
                    {(handleType==HandleType.ADD||handleType==HandleType.AUTH)&&
                    <Col className="gutter-row" md={8} sm={24} xs={24}>
                        <Form onSubmit={this.handleButtonClick} id="list" style={{ marginLeft: 20}}>
                            {/* <Table pagination={{ pageSize: 12 }} columns={this.columns} dataSource={authListData} size={'small'} /> */}
                            {/* <Button type="primary" htmlType="submit" id="get" style={{ marginBottom: 10}} onClick={this.getAuthGroupData}>获得权限组列表</Button> */}
                            <div>权限组列表：</div>
                            <Table pagination={{ pageSize: 8 }} columns={this.columnsAuthGroup} dataSource={authGroupData} size={'small'} />
                            {/* <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">获取权限列表</Button>
                            </FormItem> */}
                        </Form>
                    </Col>}
                </Row>
            </Card>
        </div >;
    }
}

export default Form.create()(AddUser);

const HandleType = {
    ADD:'1',
    RESET:'2',
    DELETE:'3',
    AUTH:'4',
}