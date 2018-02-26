import React from 'react';
import { Card, Form, Tooltip, Cascader, Select, Checkbox, Button, message } from 'antd';
const FormItem = Form.Item;
import { Table } from 'antd';
import { hex_md5 } from '../../../public/md5'
import './index.less';
//单选框
import { Radio } from 'antd';
const RadioGroup = Radio.Group;
//下拉菜单
import { Menu, Dropdown, Icon } from 'antd';
import { Row, Col } from 'antd';
const SubMenu = Menu.SubMenu;

import { Input } from 'antd';

import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;
/**
 * 测试用
 */
class AddUser extends React.Component {
    state = {
        authListData: [
            { key: 6, authId: 6, authName: "禁言" },
            { key: 5, authId: 5, authName: "玩家信息查询" },
            { key: 7, authId: 7, authName: "补单" },
            { key: 8, authId: 8, authName: "发送系统公告" },
            { key: 2, authId: 2, authName: "删除账号" },
            { key: 9, authId: 9, authName: "封禁玩家" },
        ]

    }

    columns = [
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
    ]

    handleButtonClick = (e) => { //获取权限列表
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        fetch(`/root/getAuthList.action`, {
            credentials: 'include', //发送本地缓存数据
            method: 'POST',
            headers: {
                headers
            },
            // body:querystring
        }).then(res => {
            if (res.status !== 200) {
                throw new Error('请求权限数据成败')
            }
            return res;
        }).then(res => res.json())
            .then(res => {
                if (res.state === 1) {
                    message.info('请求用户权限成功')
                }
                let { authListData } = this.state;
                let dataList = res.data.authList; //获取的权限列表数据
                let authListDataItems = []; //待存放的容器
                for (let i = 0; i < dataList.length; i++) {
                    let data = dataList[i];
                    let tableItem = {};
                    tableItem.key = data.authId;
                    tableItem.authId = data.authId;
                    tableItem.authName = data.authName;
                    authListDataItems.push(tableItem);
                }
                this.setState({ authListData: authListDataItems })
            }).catch(err => {
                message.info('请求权限数据成败')
            })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { userName, password, email, auths } = values;
                // let md5password = hex_md5(`${password}`);
                // console.log("hex_md5:");
                // console.log("hex_md5:", hex_md5);
                // let md5password = window.hex_md5(password);
                let md5password = hex_md5(password);
                console.log(md5password)
                let password0 = 'a384b6463fc216a5f8ecb6670f86456a';//密钥
                const querystring = `userName=${userName}&password=${md5password}&email=${email}&auths=${auths}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/createUser.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    if (res.status !== 200) {
                        throw new Error('用户创建失败')
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.state === 1) {
                            message.info('用户创建成功')
                        }
                    })
                    .catch(err => {
                        throw new Error('用户创建失败')
                    })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { authListData } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 6 },
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
            <Card title="新增用户">
                <Row>
                    <Col className="gutter-row" md={11} sm={11}>
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form onSubmit={this.handleSubmit} id="add">
                            <FormItem {...formItemLayout} label={"用户名"}>
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: '请输入用户名' }],
                                })(
                                    <Input placeholder="请输入用户名" />
                                    )}
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
                            <FormItem {...formItemLayout} label={"用户权限"} >
                                {getFieldDecorator('auths', {
                                    rules: [{ required: true, message: '请输入用户权限Id' }],
                                })(
                                    <Input placeholder="用户权限Id（用冒号隔开）" />
                                    )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">创建用户</Button>
                            </FormItem>
                        </Form>
                    </Col>

                    {/* <Col className="gutter-row" md={2}> */}
                    {/* <span>创建用户名：</span> */}
                    {/* </Col> */}
                    <Col className="gutter-row" md={13} sm={13}>
                        <Form onSubmit={this.handleButtonClick} id="list">
                            {/* <FormItem {...formItemLayout} >
                                {getFieldDecorator('authList', {
                                    // rules: [{ required: true, message: '请输入滚动次数' }],
                                })(
                                    <textarea style={{ width: "140%", height: 190 }} placeholder="获取权限列表" />
                                    )}
                            </FormItem> */}
                            {/* <textarea name="a" style={{ width: 400 ,height:180 }} placeholder="在这里输入待更新公告内容"></textarea> */}
                            <Table pagination={{ pageSize: 12 }} columns={this.columns} dataSource={authListData} size={'small'} />
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">获取权限列表</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div >;
    }
}

export default Form.create()(AddUser);
