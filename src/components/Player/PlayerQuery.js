import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch, apiFetchError } from '../../api/api'
import { getServiceList, getYxList } from '../../api/service';
/**
 * 测试用
 */

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
        this.requestGuide(tableItem.yx,tableItem.serverId,tableItem.playerName)

    }



    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
            this.setState({ serviceList: res, filteredServiceList: res});
        })
    }

    onYxChange=(value)=>{//渠道列表变换引起服务列表更新
        const{serviceList} = this.state;
        let filteredServiceList = serviceList.filter((item, index)=>{
            return item.yx===value;
        });
        this.setState({filteredServiceList:filteredServiceList});
    }

    getYxList=(data)=>{//获取渠道列表
       getYxList(data,(yxList)=>{
        this.setState({yxList:yxList});
       });
    }



    requestGuide=(yx, serverId, name)=>{
        const querystring = `yx=${yx}&serverId=${this.state.serverId}&playerName=${name}`
        let url = "/root/modifyPlayerIdentity.action"
        let method = 'POST'
        let successmsg = '设置成功'
        let modifyPlayerData = null;
        this.state.playerData.forEach(item=>{
            if (item.playerName == name) {
                modifyPlayerData = item;
            }
        });

        apiFetch(url, method, querystring, successmsg, (res) => {
            //更新界面
            // playerId:角色Id
            // playerName:角色名
            // identityInfo:身份信息
            modifyPlayerData.identityInfo = res.data.identityInfo;
            this.setState({playerData:this.state.playerData});
        })
    }


    handleSubmit = (e) => {  //查询玩家信息
        // console.log('e:', e.target.id)   //playerName,userIdyx,playerId
        let queryId=e.target.id
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { serverId, playerName, userId, yx, playerId } = values;
                let querystring ='';
                if(queryId=='playerName'){
                    querystring = `playerId=1&serverId=${serverId}&yx=${yx}&playerName=${playerName}`;
                }else if(queryId=='userIdyx'){
                    querystring = `playerId=2&serverId=${serverId}&userId=${userId}&yx=${yx}`;
                }else if(queryId=='playerId'){
                    querystring = `playerId=3&serverId=${serverId}&yx=${yx}&playerName=${playerId}`;
                }

                
                let url = "/root/playerInfo.action"
                let method = 'POST'
                let successmsg = '获取玩家数据成功'
                apiFetchError(url, method, querystring, successmsg, (res) => {
                    this.setState({serverId,serverId});
                    let { playerData, key } = this.state;
                    playerData = [];   //清除自定义数据
                    let resDataArray = res.data.playerList;
                    for(let i = 0;i<resDataArray.length;i++){
                        let resData = resDataArray[i]; 
                        let playerDataItem = {};
                        playerDataItem.cityName = resData.cityName;
                        playerDataItem.forceId = resData.forceId;
                        playerDataItem.playerId = resData.playerId;
                        playerDataItem.playerLv = resData.playerLv;
                        playerDataItem.playerName = resData.playerName;
                        playerDataItem.vipLv = resData.vipLv;
                        playerDataItem.key = i;
                        playerDataItem.fightCapacity = resData.fightCapacity;
                        playerDataItem.mainTaskId = resData.mainTaskId;
                        playerDataItem.mainTaskName = resData.mainTaskName;
                        playerDataItem.diamond = resData.diamond;
                        playerDataItem.armyId = resData.armyId;
                        playerDataItem.yxSource = resData.yxSource;
                        playerDataItem.yx = resData.yx;
                        playerDataItem.createTime = resData.createTime;
                        playerDataItem.lastLoginTime = resData.lastLoginTime;
                        playerDataItem.lastLogoutTime = resData.lastLogoutTime;
                        playerDataItem.uniqId = resData.uniqId;
                        playerData.push(playerDataItem);
                    }
                    this.setState({ playerData: playerData, key: key });
                }
                // ,()=>{
                //     const {key} = this.state;
                //     this.setState({ playerData: [], key: key + 1 });
                // }
            )
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {filteredServiceList, yxList} = this.state;
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
            <Card title="获取玩家信息">
            <Form>
                <Row>
                    <Col className="gutter-row" md={12}>
                        <FormItem {...formItemLayout} label="服务器名称" >
                        {getFieldDecorator('serverId', {
                            rules: [
                                { required: true, message: '请选择服务器名称' },
                            ],
                        })(
                            <Select placeholder="选择服务器名称">
                                {filteredServiceList.map((item, index) => {
                                    return <Option key={item.serverId} value={`${item.serverId}`}>{item.serverName}</Option>
                                })}
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" md={12}>
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
                    </Col>
                </Row>
                
            </Form>
                <Row>
                    <Col className="gutter-row" md={8}>
                        <Form id="playerName" onSubmit = {this.handleSubmit}>
                            <FormItem {...formItemLayout} label={"角色的名称"}>
                                {getFieldDecorator('playerName', {
                                    rules: [{ required: false, message: '请输入角色的名称' }],
                                })(
                                    <Input placeholder="请输入角色的名称,多个角色用逗号分开" />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" >通过角色名称获取</Button>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col className="gutter-row" md={8}>
                        <Form id="userIdyx" onSubmit = {this.handleSubmit}>
                            <FormItem {...formItemLayout} label={"用户Id"}>
                                {getFieldDecorator('userId', {
                                    rules: [{ required: false, message: '请输入用户Id' }],
                                })(
                                    <Input placeholder="请输入用户Id,多个Id用逗号分开" />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" >通过userId获取</Button>
                            </FormItem>
                            
                        </Form>
                    </Col>      
                    <Col className="gutter-row" md={8}>
                        {/* <Form layout="inline" onSubmit={this.handleSubmit}> */}
                        <Form id="playerId" onSubmit = {this.handleSubmit}>
                            <FormItem {...formItemLayout} label={"角色的Id"}>
                                {getFieldDecorator('playerId', {
                                    rules: [{ required: false, message: '请输入角色Id"' }],
                                })(
                                    <Input placeholder="请输入角色Id,多个Id用逗号分开" />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">通过角色Id获取</Button>
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
