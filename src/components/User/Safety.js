import React from 'react';
import { Card, Form, Button, Row, Col, Input, message } from 'antd';
import './index.less';
import { changePassword } from '../../api/service';
import { hex_md5 } from '../../../public/md5';
const FormItem = Form.Item;

class Safety extends React.Component {
    constructor(props) {
        super(props),
            this.state = {
                
            }
    }
    componentDidMount() {

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.validateFields(['oldPassword','newPassword','newPassword2'],(values)=>{
            let { oldPassword,newPassword,newPassword2 } = values;
            if(newPassword!=newPassword2){
                message.error('两次输入密码不同')
                return;
            }
            let md5oldPassword = hex_md5(oldPassword);
            let md5newPassword = hex_md5(newPassword);
            changePassword(md5oldPassword,md5newPassword,()=>{
                // this.props.form.setFieldsValue({newPassword:''})
            });
        });
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
                        <Form onSubmit={this.handleSubmit} id="modify">
                            <FormItem {...formItemLayout} label={"原密码"} >
                                {getFieldDecorator('oldPassword', {
                                    rules: [{ required: true, message: '请输入原密码' }],
                                })(
                                    <Input type="password" placeholder="请输入原密码" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"新密码"} >
                                {getFieldDecorator('newPassword', {
                                    rules: [{ required: true, message: '请输入新密码' }],
                                })(
                                    <Input type="password" placeholder="用户新密码" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"新密码"} >
                                {getFieldDecorator('newPassword2', {
                                    rules: [{ required: true, message: '请输入新密码' }],
                                })(
                                    <Input type="password" placeholder="新密码" />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout} style={{ textAlign: 'center'}} >
                                <Button type="primary" htmlType="submit" >修改密码</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div >;
    }
}

export default Form.create()(Safety);

