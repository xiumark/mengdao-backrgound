import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
/**
 * 测试用
 */
class PlayerQuery extends React.Component {
    state = {
        key: 1,
        playerData: [
            // {
            //     key: '0',
            //     cityName: '扬州',
            //     forceId: '234',
            //     playerId: 1629,
            //     playerLv: 17,
            //     playerName: '快',
            //     vipLv: 0,
            // },
            // {
            //     key: '10',
            //     cityName: '益州',
            //     forceId: '234',
            //     playerId: 1329,
            //     playerLv: 13,
            //     playerName: '玩家3',
            //     vipLv: 0,
            // },
        ]
    }

    columns = [
        {
            title: 'ID',
            dataIndex: 'playerId',
            key: 'playerId',
        },
        {
            title: '角色名',
            dataIndex: 'playerName',
            key: 'playerName',
        },
        {
            title: '所属的州',
            dataIndex: 'cityName',
            key: 'cityName',
        },
        {
            title: '所属的势力',
            dataIndex: 'forceId',
            key: 'forceId',
        },
        {
            title: '角色等级',
            dataIndex: 'playerLv',
            key: 'playerLv',
        },
        {
            title: 'VIP等级',
            dataIndex: 'vipLv',
            key: 'vipLv',
        }];

    handleSubmit = (e) => {  //查询玩家信息
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { serverId, playerName } = values;
                //serverId可不填
                const querystring = `serverId=${serverId}&playerName=${playerName}`
                let url = "/root/playerInfo.action"
                let method = 'POST'
                let successmsg = '获取玩家数据成功'
                apiFetch(url, method, querystring, successmsg, (res) => {
                    let { playerData, key } = this.state;
                    let resData = res.data;
                    let playerDataItem = {};
                    playerDataItem.cityName = resData.cityName;
                    playerDataItem.forceId = resData.forceId;
                    playerDataItem.playerId = resData.playerId;
                    playerDataItem.playerLv = resData.playerLv;
                    playerDataItem.playerName = resData.playerName;
                    playerDataItem.vipLv = resData.vipLv;
                    playerDataItem.key = key;
                    playerData = [];   //清除自定义数据
                    playerData.push(playerDataItem);
                    this.setState({ playerData: playerData, key: key + 1 });
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { playerData } = this.state;
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
            <Card title="获取玩家信息">
                <Row>
                    <Col className="gutter-row" md={12}>
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label={"服务器Id"} >
                                {getFieldDecorator('serverId', {
                                    rules: [{ required: true, message: '请输入服务器Id' }],
                                })(
                                    <Input placeholder="服务器Id" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"角色的名称"}>
                                {getFieldDecorator('playerName', {
                                    rules: [{ required: true, message: '请输入角色的名称' }],
                                })(
                                    <Input placeholder="请输入角色的名称" />
                                    )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">获取</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
            <Card title="玩家列表">
                <Table pagination={{ pageSize: 8 }}
                    columns={this.columns} dataSource={playerData} size={'small'} />
            </Card>
        </div >;
    }
}

export default Form.create()(PlayerQuery);
