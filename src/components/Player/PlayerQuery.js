import React from 'react';
import { Card, Form, Select, Button , Input, Table, Radio, Row } from 'antd';
import './index.less';
import { getServiceList, getYxList, getPlayerInfo, modifyPlayerIdentity,changePlayerName } from '../../api/service';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

const flex = {
    display:"flex",
};
const buttonAddStyle = {
    margin: '10px',
    marginLeft:'0px',
    width: '80px',
};

const EditableCell = ({ value,onClick}) => (
    <div style={flex}>
        <button id="add" style={buttonAddStyle} onClick = {e =>onClick(e)}>{(!value||value>=0)?'否':'是'}</button>
    </div>
  );
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
            //     identityInfo, <0 指导员
            // },
        ],
        serviceList: [
            {yx:'渠道1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
            {yx:'渠道1', serverId: "2", serverName: "sg_dev", serverState: 0 },
            {yx:'渠道2', serverId: "90002", serverName: "sg_90002", serverState: 0 }
        ],

        serverId:'',
        filteredServiceList: [
            {yx:'渠道1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
            {yx:'渠道1', serverId: "2", serverName: "sg_dev", serverState: 0 },
        ],

        yxList:[
            {yx:'渠道1' ,key:1},
            {yx:'渠道2' ,key:1},
        ],

        queryTypeState:'1',    //查询方式
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
        },


        {
            title: '战斗力',
            dataIndex: 'fightCapacity',
            key: 'fightCapacity',
        },
        {
            title: '主线任务进度',
            dataIndex: 'mainTaskId',
            key: 'mainTaskId',
        },
        {
            title: '主线任务名称',
            dataIndex: 'mainTaskName',
            key: 'mainTaskName',
        },
        {
            title: '元宝数',
            dataIndex: 'diamond',
            key: 'diamond',
        },
        {
            title: '关卡进度',
            dataIndex: 'armyId',
            key: 'armyId',
        },
        {
            title: '用户来源',
            dataIndex: 'yxSource',
            key: 'yxSource',
        },
        {
            title: '渠道',
            dataIndex: 'yx',
            key: 'yx',
        },
        {
            title: '创角时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '最近登陆时间',
            dataIndex: 'lastLoginTime',
            key: 'lastLoginTime',
        },
        {
            title: '最近退出时间',
            dataIndex: 'lastLogoutTime',
            key: 'lastLogoutTime',
        },
        {
            title: '唯一编号',
            dataIndex: 'uniqId',
            key: 'uniqId',
        },
        {
            title: '是否指导员',
            dataIndex: 'identityInfo',
            key: 'identityInfo',
            width: 100,
            render: (textValue, tableItem) => this.renderColumns(textValue, tableItem, 'identityInfo'),
        },
    ];

    renderColumns(textValue, tableItem, column) {
        return (
          <EditableCell
            value={textValue}
            onClick ={(event) => this.handleClick(event, tableItem, column)}
          />
        );
    }

    handleClick(event, tableItem, column){
        this.requestGuide(tableItem.yx,tableItem.playerName)
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        });
    }

    onYxChange=(value)=>{//渠道列表变换引起服务列表更新
        const{serviceList} = this.state;
        let filteredServiceList = serviceList.filter((item, index)=>{
            return item.yx===value;
        });
        this.setState({filteredServiceList:filteredServiceList});
    }

    onServerChange=(value)=>{//渠道列表变换引起服务列表更新
        // const{serviceList} = this.state;
        // let filteredServiceList = serviceList.filter((item, index)=>{
        //     return item.yx===value;
        // });
        this.setState({serverId:value});
    }
    
    getYxList=(data)=>{//获取渠道列表
       getYxList(data,(yxList)=>{
        this.setState({yxList:yxList});
       });
    }

    requestGuide=(yx, name)=>{
        let modifyPlayerData = null;
        this.state.playerData.forEach(item=>{
            if (item.playerName == name) {
                modifyPlayerData = item;
            }
        });

        let serverId = this.state.serverId;
        modifyPlayerIdentity(yx, serverId, name,(list)=>{
            modifyPlayerData.identityInfo = list;
            this.setState({playerData:this.state.playerData});
        });

        // const querystring = `yx=${yx}&serverId=${this.state.serverId}&playerName=${name}`
        // let url = "/root/modifyPlayerIdentity.action"
        // let method = 'POST'
        // let successmsg = '设置成功'

        // apiFetch(url, method, querystring, successmsg, (res) => {
        //     //更新界面
        //     // playerId:角色Id
        //     // playerName:角色名
        //     // identityInfo:身份信息
        //     modifyPlayerData.identityInfo = res.data.identityInfo;
        //     this.setState({playerData:this.state.playerData});
        // })
    }


    /**
     * 查询玩家信息
     */
    handleSubmit = (e) => {
        e.preventDefault();
        //根据不同查询控制不同合法验证
        let v = this.state.queryTypeState;
        let queryId;
        if(v==PlayerQueryType.PLAYER_NAME){
            queryId='playerName';
            this.props.form.validateFields(['serverId', 'yx', 'playerName'],(err, values) => {
                if (!err) {
                    let { serverId, playerName, userId, yx, playerId } = values;
                    getPlayerInfo(queryId, serverId, playerName, userId, yx, playerId,(list)=>{
                        this.setState({ playerData: list });
                    });
                }
            });
        } else if(v==PlayerQueryType.USER_ID){
            queryId='userIdyx';
            this.props.form.validateFields(['serverId', 'yx', 'userId'],(err, values) => {
                if (!err) {
                    let { serverId, playerName, userId, yx, playerId } = values;
                    getPlayerInfo(queryId, serverId, playerName, userId, yx, playerId,(list)=>{
                        this.setState({ playerData: list });
                    });
                }
            });
        } else if(v==PlayerQueryType.PLAYER_ID){
            queryId='playerId';
            this.props.form.validateFields(['serverId', 'yx', 'playerId'],(err, values) => {
                if (!err) {
                    let { serverId, playerName, userId, yx, playerId } = values;
                    getPlayerInfo(queryId, serverId, playerName, userId, yx, playerId,(list)=>{
                        this.setState({ playerData: list });
                    });
                }
            });
        } else if(v==PlayerQueryType.PLAYER_NAME_MODIFY){
            this.props.form.validateFields(['yx', 'serverId', 'playerName', 'afterPlayerName'],(err, values) => {
                if (!err) {
                    let { yx, serverId, playerName, afterPlayerName } = values;
                    changePlayerName(yx, serverId, playerName, afterPlayerName,()=>{
                        // this.setState({ playerData: list });
                    });
                }
            });
        }
    }

    //选择查询方式
    checkChange = (e)=>{
        this.setState({queryTypeState:e.target.value});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {filteredServiceList, yxList, queryTypeState} = this.state;
        const { playerData, serviceList } = this.state;
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
            <Card title="玩家信息">
                <Form onSubmit = {this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="操作方式"
                        >
                        {getFieldDecorator('queryType', {
                            initialValue: '1' ,
                            rules: [
                                { required: true, message: '请选择操作方式' },
                            ],
                        })(
                            <RadioGroup onChange={this.checkChange}>
                                <Radio value="1">通过角色名称查询</Radio>
                                <Radio value="2">通过userID查询</Radio>
                                <Radio value="3">通过角色ID查询</Radio>
                                <Radio value="4">变更玩家名称</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {/* <Row>
                        <Col className="gutter-row" md={12}> */}
                            <FormItem {...formItemLayout} label="服务器名称" >
                            {getFieldDecorator('serverId', {
                                rules: [
                                    { required: true, message: '请选择服务器名称' },
                                ],
                            })(
                                <Select placeholder="选择服务器名称" onChange = {(value)=>this.onServerChange(value)}>
                                    {filteredServiceList.map((item, index) => {
                                        return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                    })}
                                </Select>
                            )}
                            </FormItem>
                        {/* </Col>
                        <Col className="gutter-row" md={12}> */}
                            <FormItem {...formItemLayout} label="渠道" >
                                {getFieldDecorator('yx', {
                                    rules: [
                                        { required: true, message: '请选择渠道' },
                                    ],
                                })(
                                    <Select placeholder="请选择渠道" onChange = {(value)=>this.onYxChange(value)}>
                                        {yxList.map((item, index) => {
                                            return <Option key={index} value={`${item.yx}`}>{item.yx}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                        {/* </Col>
                    </Row> */}
                    {(queryTypeState==PlayerQueryType.PLAYER_NAME||queryTypeState==PlayerQueryType.PLAYER_NAME_MODIFY)&&
                    <FormItem {...formItemLayout} label={"角色的名称"}>
                        {getFieldDecorator('playerName', {
                            rules: [{ required: true, message: '请输入角色的名称' }],
                        })(
                            <Input placeholder="请输入角色的名称,多个角色用逗号分开" />
                        )}
                    </FormItem>}
                    {queryTypeState==PlayerQueryType.USER_ID&&
                    <FormItem {...formItemLayout} label={"userId"}>
                        {getFieldDecorator('userId', {
                            rules: [{ required: true, message: '请输入userId' }],
                        })(
                            <Input placeholder="请输入用户Id,多个Id用逗号分开" />
                        )}
                    </FormItem>}
                    {queryTypeState==PlayerQueryType.PLAYER_ID&&
                    <FormItem {...formItemLayout} label={"角色的Id"}>
                        {getFieldDecorator('playerId', {
                            rules: [{ required: true, message: '请输入角色Id"' }],
                        })(
                            <Input placeholder="请输入角色Id,多个Id用逗号分开" />
                        )}
                    </FormItem>}
                    {queryTypeState==PlayerQueryType.PLAYER_NAME_MODIFY&&
                    <FormItem {...formItemLayout} label={"玩家新名称"}>
                        {getFieldDecorator('afterPlayerName', {
                            rules: [{ required: true, message: '请输入玩家新名称' }],
                        })(
                            <Input placeholder="请输入玩家新名称" />
                        )}
                    </FormItem>}
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" disabled={queryTypeState!=PlayerQueryType.PLAYER_NAME_MODIFY?false:true}>查询</Button>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 12}} disabled={queryTypeState==PlayerQueryType.PLAYER_NAME_MODIFY?false:true}>更改玩家名称</Button>
                    </FormItem>
                </Form>
            </Card>
            <Card title="玩家列表">
                <Table pagination={{ pageSize: 8 }}
                    columns={this.columns} dataSource={playerData} size={'small'} />
            </Card>
        </div >;
    }
}
export default Form.create()(PlayerQuery);

/**
 * @param PLAYER_NAME 通过角色名称获取
 * @param USER_ID     通过userId获取
 * @param PLAYER_ID   通过角色Id获取
 * @param PLAYER_NAME_MODIFY   通过角色Id获取
 */
export const PlayerQueryType = {
    PLAYER_NAME :1,
    USER_ID : 2,
    PLAYER_ID : 3,
    PLAYER_NAME_MODIFY : 4,   //变更用户名
}
