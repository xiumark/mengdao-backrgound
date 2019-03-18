/**
 * Created by maxun on 2011/2/15.
 */
import React,{Component} from 'react';
import { Card, Form, Button, Row, Col, Input, Table, message,Modal } from 'antd';
import {COMPONENTTYPE} from './ConfigConsts.js'
/**
 * 一个通用的表单，包括：
 * 1.输入框；
 * 2.日期；
 * 3.单选框；
 * 4.下拉框；
 * 5.按钮；
 * 6.弹出面板；
 */ 
class CommonForm extends Component{
    constructor(props){
        super(props)
    }

    


    render(){
        const {...props} = this.props;
        return <div
            title="通用表单"
            visible={props.visible}
            onOk={props.onOk}
            onCancel={props.onCancel}
            >
            {/* <Table pagination={props.pagination?props.pagination:'10'} columns={props.columns} dataSource={props.dataSource} size={props.size?props.size:'small'} /> */}
            <Form onSubmit={this.handleSubmit} id="add">
                <FormItem {...formItemLayout} label={"用户名"}>
                {/* 通过弹出面板中的表格选择需要的数据 */}
                    <Row gutter={8}>
                        <Col span={12}sm={14} xs={14}>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名' }],
                            })(
                                <Input placeholder="请输入用户名" />
                            )}
                        </Col>
                        <Col sm={8} xs={8}>
                            <Button type="primary" onClick = {this.showModal} disabled = {false}>选择已创建用户</Button>
                            {/* <Modal
                                title="已创建用户"
                                visible={this.state.modalVisible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                >
                                <Table pagination={{ pageSize: 8 }} columns={this.columnsAuthGroup} dataSource={authGroupData} size={'small'} /> */}
                                {/* <p>这里显示用户列表</p>
                                <p>这里显示用户列表</p>
                                <p>这里显示用户列表</p>
                                <p>这里显示用户列表</p>
                                <p>这里显示用户列表</p>
                                <p>这里显示用户列表</p>
                                <p>这里显示用户列表</p> */}
                            {/* </Modal> */}
                            {/* <TableModal title="已创建用户"
                                visible={this.state.modalVisible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                pagination={{ pageSize: 8 }} columns={this.columnsAuthGroup} dataSource={authGroupData} size={'small'}>
                            </TableModal> */}
                            <TableModalF title="已创建用户"
                                visible={this.state.modalVisible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                pagination={{ pageSize: 8 }} columns={this.columnsAuthGroup} dataSource={authGroupData} size={'small'}>
                            </TableModalF>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label={"用户密码"} >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入用户密码' }],
                    })(
                        <Input type="password" placeholder="请输入用户密码" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={"用户邮箱"} >
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: '请输入用户邮箱' }],
                    })(
                        <Input placeholder="请输入用户邮箱" />
                    )}
                </FormItem>
                {/* <FormItem {...formItemLayout} label={"用户权限"} >
                    {getFieldDecorator('auths', {
                        rules: [{ required: false, message: '请输入用户权限Id' }],
                    })(
                        <Input placeholder="用户权限Id（用冒号隔开）" />
                    )}
                </FormItem> */}
                <FormItem {...formItemLayout} label={"用户权限组"} >
                    {getFieldDecorator('authGroupId', {
                        rules: [{ required: false, message: '请输入用户权限组Id' }],
                    })(
                        <Input placeholder="输入用户权限组Id" />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout} style={{ textAlign: 'center'}} >
                    <Button type="primary" htmlType="submit">创建用户</Button>
                    <Button type="primary" htmlType="submit"style={{ marginLeft: 12}} disabled='true'>重置密码</Button>
                    <Button type="primary" htmlType="submit"style={{ marginLeft: 12}} disabled='true'>删除账号</Button>
                    <Button type="primary" htmlType="submit"style={{ marginLeft: 12}} disabled='true'>权限管理</Button>
                </FormItem>
            </Form>
        </div>
    }
}
export default Form.create()(CommonForm);




