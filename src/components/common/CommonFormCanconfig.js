/**
 * Created by maxun on 2019/3/10.
 * 一个可以通过配置数据定制的form表单
 */
import React,{Component} from 'react';
import { Card, Form, Button, Row, Col, Input, Table, message,Modal } from 'antd';
import {PlayerQueryType} from '../Player/PlayerQuery'
import {getPlayerInfoOTO} from '../../api/service';

class CommonFormCanconfig extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource:undefined,   //返回的数据
        }
        this.configData = props.configData;//配置的数据
        this.dataParam = new DataParamVOFactory(props.host,props.port,props.urlString);  //请求数据
    }

    componentDidMount() {

    }

    onClick = ()=>{
        let queryData = {//playerId=1&serverId=1&yx=aa&playerName=1233
            queryId:1, serverId:1, playerName:1233, userId:123, yx:'aa', playerId:1
        }
        let baseQuery = new BaseQuery();   //在这里使用组合模式比使用继承更合适，故当前组件不再采用继承BaseQuery的方式
        baseQuery.queryPlayer(queryData);
    }

    render(){
        return <div title="通用表单">
            <Form id="add">
                <Button type="primary" htmlType="submit"style={{ marginLeft: 12}} onClick = {this.onClick}>查询玩家数据</Button>
            </Form>
        </div>
    }
}
export default Form.create()(CommonFormCanconfig);


class DataParamVOFactory {
    createParamVO = (queryData)=>{   //初始化和更新数据
        if (queryData.type=='playerQuery') {
            return (new PlayerQueryParamVO(queryData)).createParamVO();
        } else {

        }
    }
}

/**
 * 
 * 玩家查询请求参数
 */
class PlayerQueryParamVO{
    constructor(queryData){
        this.queryData = queryData;
        this.queryType = queryData.playerId;
        this.createParamVO();
    }
    createParamVO = ()=>{
        let querystring = '';
        let queryData = this.queryData;
        if (this.queryType == PlayerQueryType.PLAYER_NAME) {        //通过角色名称获取
            querystring = `playerId=1&serverId=${queryData.serverId}&yx=${queryData.yx}&playerName=${queryData.playerName}`;
        } else if(this.queryType == PlayerQueryType.USER_ID) {      //通过userId获取
            querystring = `playerId=2&serverId=${queryData.serverId}&userId=${queryData.userId}&yx=${queryData.yx}`;
        } else if(this.queryType == PlayerQueryType.PLAYER_ID) {    //通过角色Id获取
            querystring = `playerId=3&serverId=${queryData.serverId}&yx=${queryData.yx}&playerName=${queryData.playerId}`;
        }else{
            //查询方式错误
            return;
        }
        querystring = `playerId=1&serverId=1&yx=aa&playerName=1233`;    //测试数据
        return querystring;
    }
}

/**
 * 服务端返回数据处理工厂类
 * 
 */
class DataSourceVOFactory {  //创建数据源
    createSourceDataVO = (data)=>{
        if(data.type == 'playerQuery'){    //返回的数据为玩家查询结果
            return new createPlayerQuerySourceDataVO(data);
        }else{//其他查询结果，待扩展

        }
    }
}

/**
 * 查询玩家获得的数据
 * data: PlayerQueryParamVO
*/
class createPlayerQuerySourceDataVO {
    constructor(data){
        this.playerData = data; //TODO 结构待完善
    }
}

/**
 * 基本查询，查询渠道和区服
*/
class BaseQuery{
    //查询玩家数据,queryData包含查询字符串
    queryPlayer = (queryData)=>{
        queryData.type = 'playerQuery';  //类似的判断，待实现具体的判断方法
        let queryParam = (new DataParamVOFactory()).createParamVO(queryData);  //查询字符串
        getPlayerInfoOTO(queryParam,(returnData)=>{    //查询玩家数据
            let dataSource = (new DataSourceVOFactory()).createSourceDataVO(returnData);
            this.setState({ dataSource: dataSource });
        });
    };

    //TODO 待拓展各种查询方式
}


/**
 * 基本查询数据
 */
class BaseQueryParamVO{
    constructor(props){
        this.setServerAndYx(props);
    } 

    //构建基本的查询结构
    setServerAndYx= (props) => {
        this.serverId = props.serverId;
        this.yx = props.yx;
    }
}


