/**
 * Created by maxun on 2011/2/15.
 */
import React,{Component} from 'react';
import { Card, Form, Button, Row, Col, Input, Table, message,Modal } from 'antd';




/**
 *  弹出具有table表的面板
 */ 
export default class TableModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            // userList:this.props.userList,
            // userList:this.props.userList.map((item)=>{
            //     item.selected=false;
            // }),
        }


        // this.columnsCreatedUser = [
        //     {
        //         title: '用户ID',
        //         dataIndex: 'userId',
        //         key: 'userId',
        //     },
        //     {
        //         title: '用户名称',
        //         dataIndex: 'userName',
        //         key: 'userName',
        //     },
        //     {
        //         title: '邮箱地址',
        //         dataIndex: 'email',
        //         key: 'email',
        //     },
        //     {
        //         title: '权限组权限',
        //         dataIndex: 'authGroupId',
        //         key: 'authGroupId',
        //     },
        //     {
        //         title: '权限列表',
        //         dataIndex: 'auths',
        //         key: 'auths',
        //     },
        //     {
        //         title: '权限组权限',
        //         dataIndex: 'state',
        //         key: 'state',
        //     },
        //     {
        //         title: '操作',
        //         dataIndex: 'handle',
        //         key:'handle',
        //         width: '30%',
        //         render: (textValue, tableItem) => this.renderCreatedUserColumns(textValue, tableItem, 'handle'),
        //     },
        // ];
    }


    //已创建用户选择按钮
    // renderCreatedUserColumns=(textValue, tableItem, column)=>{
    //     return (
    //         <div><button onClick ={(event) => this.chooseUser(event, tableItem, column)}>{tableItem.selected?已选中:选择}</button></div>
    //     );
    // }

    //点击，填充form表单中的权限组id
    // chooseUser=(event, tableItem, column)=>{
    //     // this.props.form.setFieldsValue({authGroupId:`${tableItem.authGroupId}`})
    //     // let userList = this.state.userList;
    //     // tableItem.selected==1;
    //     // let userList = this.state.userList;
    //     // let newUserList = userList.map((item)=>{
    //     //     if(item.userId == tableItem.userId){
    //     //         item.selected==true;
    //     //         return item;
    //     //     }else{
    //     //         item.selected==false;
    //     //         return item;
    //     //     }
    //     // })
    //     event.target.textValue='已经选中';
    // }

    // componentDidMount() {
    //     // this.getAuthGroupData();
    //     // this.requestAllCreateUsers();//获取最新的用户信息
    //     // debugger
    // }



    render(){
        const {...props} = this.props;
        return <Modal
            title="已创建用户"
            visible={props.visible}
            onOk={props.onOk}
            onCancel={props.onCancel}
            >
            <Table pagination={props.pagination?props.pagination:'10'} columns={props.columns} dataSource={props.dataSource} size={props.size?props.size:'small'} />
        </Modal>
    }
}