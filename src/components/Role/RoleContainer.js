import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
/**
 * 测试用
 */
class RoleContainer extends React.Component {
    state = {
        value1: 1,
        value2: 1,

    }
    onChange = (e) => {
        //console.log('radio checked', e.target.value);
        this.setState({
            value1: e.target.value,
        }, );
    }
    onChange2 = (e) => {
        this.setState({
            value2: e.target.value,
        }, );
    }

    onSelect = (selectedKeys, info) => {
        //console.log('selected', selectedKeys, info);
    }
    onCheck = (checkedKeys, info) => {
    }
    submit = () => {
        //   this.setState({})
    }

    handleMenuClick = (e) => {
        // message.info('Click on menu item.');
    }

    handleSubmit = (e) => {  //查询玩家信息
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('从表单中获取的数据是: ', values);
                let { noticeType, serverId, duration, times } = values;
                //serverId可不填
                const querystring = `noticeType=${noticeType}&serverId=${serverId}&duration=${duration}&times=${times}`
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/sendNotice.action?${querystring}`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    // body
                }).then(res => {
                    console.log('res:', res)
                    if (res.status !== 200) {
                        throw new Error('添加失败')
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
                        //console.log(res)
                    })
                    .catch(err => {
                        //console.log(err)
                        message.info('添加失败')
                    })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
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
            <Card title="获取玩家信息">
                <Row>
                    <Col className="gutter-row" md={12}>
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label={"服务器Id"} >
                                {getFieldDecorator('serverId', {
                                    // rules: [{ required: true, message: '请输入公告类型（默认为1）' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="服务器Id" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"角色的名称"}>
                                {getFieldDecorator('playerName', {
                                    // rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="角色的名称" />
                                    )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">获取</Button>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col className="gutter-row" md={1}>
                        {/* <span>创建用户名：</span> */}
                    </Col>
                    <Col className="gutter-row" md={10}>
                        <Card title="获取的玩家信息内容">
                            <textarea style={{ width: "100%", height: 190 }} placeholder="获取的玩家信息内容" />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div >;
    }
}

export default Form.create()(RoleContainer);
