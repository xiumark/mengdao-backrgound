import React from 'react';
import { Card, Form, Tooltip, Cascader, Select, Checkbox, Button, message, Table, Icon } from 'antd';
const FormItem = Form.Item;
import './index.less';
import { Row, Col } from 'antd';
import { Input } from 'antd';
/**
 * 测试用
 */
class PlayerQuery extends React.Component {
    state = {
        key: 1,
        playerData: [],
        // playerData :[
        //     {
        //         key: '0',
        //         cityName:'扬州',
        //         forceId:'234',
        //         playerId:1629,
        //         playerLv:17,
        //         playerName:'快',
        //         vipLv:0,
        //     }, 
        //     {
        //         key: '1',
        //         cityName:'扬州',
        //         forceId:'234',
        //         playerId:1629,
        //         playerLv:17,
        //         playerName:'玩家2',
        //         vipLv:0,
        //     }, 
        //     {
        //         key: '8',
        //         cityName:'益州',
        //         forceId:'234',
        //         playerId:1329,
        //         playerLv:13,
        //         playerName:'玩家3',
        //         vipLv:0,
        //     },
        //     {
        //         key: '9',
        //         cityName:'益州',
        //         forceId:'234',
        //         playerId:1329,
        //         playerLv:13,
        //         playerName:'玩家3',
        //         vipLv:0,
        //     },
        //     {
        //         key: '10',
        //         cityName:'益州',
        //         forceId:'234',
        //         playerId:1329,
        //         playerLv:13,
        //         playerName:'玩家3',
        //         vipLv:0,
        //     },
        // ]
    }

    columns = [
        {
            title: 'playerId',
            dataIndex: 'playerId',
            key: 'playerId',
        },
        {
            title: 'playerName',
            dataIndex: 'playerName',
            key: 'playerName',
        },
        {
            title: 'cityName',
            dataIndex: 'cityName',
            key: 'cityName',
        },
        {
            title: 'forceId',
            dataIndex: 'forceId',
            key: 'forceId',
        },
        {
            title: 'playerLv',
            dataIndex: 'playerLv',
            key: 'playerLv',
        },
        {
            title: 'vipLv',
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
                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                fetch(`/root/playerInfo.action`, {
                    credentials: 'include', //发送本地缓存数据
                    method: 'POST',
                    headers: {
                        headers
                    },
                    body: querystring
                }).then(res => {
                    if (res.status !== 200) {
                        throw new Error('查询失败')
                    }
                    return res;
                })
                    .then(res => res.json())
                    .then(res => {
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

                        this.setState({ playerData: playerData, key: key + 1 },
                            () => {
                                message.info("用户数据已成功更新")
                            });
                    })
                    .catch(err => {
                        message.info('查询失败')
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
