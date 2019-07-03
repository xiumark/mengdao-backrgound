import { message } from 'antd';
import { apiFetch,apiFetchError,apiFetchWithMsg,apiFetchNomsg, requestData, apiFetchWithSuccessAndLoseMsg } from './api.js';
import { getFormatedRtnData } from './lib.js';

//服务器列表数据
export function getServiceList(cb) {
    let url = "/root/getServerList.action"
    let errMsg = "服务器列表数据获取失败"
    // let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    // let method = "POST"
    fetch(url, {
        credentials: 'include',
        // method: method,
        // headers: {
        //     headers
        // }
    }).then(res => {
        if (res.status !== 200) {
            throw new Error("服务器列表数据获取失败")
        }
        return res;
    }).then(res => res.json())
        .then(res => {
            if (res.state === 1) {
                cb && cb(res.data.serverInfos)
            }
            if (res.state === 0) {
                throw new Error(errMsg)
            }
        }).catch(err => {
            message.error(err.message ? err.message : "服务器列表数据获取失败")
        })
}

//获取渠道列表
export function getYxList(data, cb) {
        let dataArray = data.map((item,index)=>{
            return item.yx;
        })
        let yxArrayList=[];
        for(let i = 0;i<dataArray.length;i++){
            if(yxArrayList.indexOf(data[i].yx)==-1){//不重复
                yxArrayList.push(data[i].yx);
            }
        }
        let yxList = yxArrayList.map((item, index)=>{
            return {yx:item,key:index}
        });
        cb&&cb(yxList);
}

/**
 * 获取权限列表 
 */ 
export function getAuthList(cb){
    let querystring = ''
    let url = "/root/getAuthList.action"
    let method = 'POST'
    let successmsg = '成功获取权限列表 ';
    requestData(url, method, querystring, successmsg,
        (res) => {
            let authList = res.data.authList; //获取的权限列表数据
            let fomatedAuthList = []; //待存放的容器
            for (let i = 0; i < authList.length; i++) {
                let data = authList[i];
                let tableItem = {};
                tableItem.key = data.authId;
                tableItem.authId = data.authId;
                tableItem.authName = data.authName;
                fomatedAuthList.push(tableItem);
            }
            let sortedList =fomatedAuthList.sort((item1,item2)=>{
                    return item1.authId-item2.authId;
                })
            cb&&cb(sortedList);
        })
}



//获取权限组列表
export function getAuthGroupData(cb){
    let querystring;
    let  url = "/root/getAuthGroupList.action"
    let successmsg = '获取权限组列表';
    let method = 'POST';
    apiFetch(url, method, null, successmsg,(res)=>{
        cb&&cb(res);
    });
}



//创建选服页公告
export function requestAddUpdateNotice(yx, startTime,content,cb){   
    let contentStr = encodeURIComponent(content)
    const querystring = `yx=${yx}&startTime=${startTime}&content=${contentStr}`
    let url = "/root/addUpdateNotice.action"
    let method = 'POST'
    let successmsg = '成功创建选服页公告'
    apiFetch(url, method, querystring, successmsg, () => {
        cb&&cb()
    })
}


//删除选服页公告
export function removeUpdateNotice(vid, cb){   
    const querystring = `vid=${vid}`;
    let url = "/root/removeUpdateNotice.action"
    let method = 'POST'
    let successmsg = '成功删除选服页公告'
    apiFetch(url, method, querystring, successmsg, (res) => {
        cb&&cb();
    })
}




//获取选服页公告
export function getAllUpdateNotice(yx,cb){
    const querystring = `yx=${yx}`
    let url = "/root/getUpdateNotice.action"
    let method = 'POST'
    let successmsg = '更新选服页列表'
    apiFetch(url, method, querystring, successmsg, (res) => {
        let list = getFormatedRtnData(res,'noticeList')
        cb&&cb(list)
    })
}


//获取服务状态列表数据
export function getServerStateDataByYxAndServerId(yx,serverId,cb){
    const querystring = `yx=${yx}&serverId=${serverId}`
    let url = "/root/getServerState.action"
    let method = 'POST'
    let successmsg = '成功获得游戏服列表'
    apiFetch(url, method, querystring, successmsg, (res) => {
        let list = getFormatedRtnData(res,'serverList')
        cb&&cb(list)
    })
}



// //局格式化后台返回的数据,设置key
// export function getFormatedRtnData(res,rtnList){
//     let list =[];
//     if(res.data[rtnList]&&res.data[rtnList].length>0){
//         list = setKeyForList(res.data[rtnList]);
//     }
//     return list;
// }


//设置游戏服状态
export function requestSetServerState(yx, serverId, serverState, cb){
    const querystring = `yx=${yx}&serverId=${serverId}&serverState=${serverState}`
    let url = "/root/setServerState.action"
    let method = 'POST'
    let successmsg = '成功设置游戏服状态'
    apiFetch(url, method, querystring, successmsg, () => {
        cb&&cb()
    })
}

//发送文字邮件
export function requestSendPureMail(mailType, serverId, yx, playerNameStr, mailContent, duration, title){
    let querystring = `mailType=${mailType}&serverId=${serverId}&yx=${yx}&playerName=${playerNameStr}&mailContent=${mailContent}&duration=${duration}&title=${title}`
    let url = "/root/sendPureMail.action";
    let method = 'POST';
    let successmsg ='发送文字邮件成功';
    apiFetch(url, method, querystring, successmsg);//请求后台
}

//发送文字邮件
export function getAllNoticeList(serverId,yxValue,cb){
    let querystring = `serverId=${serverId}&yx=${yxValue}`
    let url = "/root/getAllNotices.action";
    let method = 'POST';
    let successmsg ='获取公告信息';
    apiFetch(url, method, querystring, successmsg,(res)=>{
        let list = getFormatedRtnData(res,'notices')          //notices 为返回数据的数组名称
        cb&&cb(list);
    });//请求后台
}


//开启单个活动
export function createActivity(yx, serverId, startTime, endTime, activityId,cb){   
    const querystring = `yx=${yx}&serverId=${serverId}&startTime=${startTime}&endTime=${endTime}&activityId=${activityId}`
    let url = "/root/createActivity.action"
    let method = 'POST'
    let successmsg = '成功配置活动'
    apiFetch(url, method, querystring, successmsg, (res) => {
        //如果请求成功，1.再次请求已配置数据；2.设置缓存
        cb&&cb();
    })
}

//关闭单个活动
export function removeActivity(yx, serverId, activityId,cb){   
    const querystring = `yx=${yx}&serverId=${serverId}&activityId=${activityId}`
    let url = "/root/removeActivity.action"
    let method = 'POST'
    let successmsg = '成功删除活动'
    apiFetch(url, method, querystring, successmsg, (res) => {
        //如果请求成功，1.再次请求已配置数据；2.设置缓存
        cb&&cb(res);
    })
}

/**
 * 获取可配置的活动信息
 */
export function getAllActivityIds(yx,serverId,cb){ 
    const querystring = `serverId=${serverId}&yx=${yx}`;
    let url = "/root/getAllActivityIds.action"
    let method = 'POST'
    let successmsg = '成功获取可配置的活动信息';
    let losemsg = '获取活动信息失败'
    apiFetchWithSuccessAndLoseMsg(url, method, querystring, successmsg,losemsg, (res) => {
        let list = getFormatedRtnData(res,'activityIds')          //activityIds 为返回数据的数组名称
        cb&&cb(list);
    })
}



/**
 * 获取已经配置的活动信息
 */
export function getCurActiveActivities(yx,serverId,cb){ 
    const querystring = `serverId=${serverId}&yx=${yx}`;
    let url = "/root/curActiveActivities.action"
    let method = 'POST'
    let successmsg = '成功获取已配置的活动信息';
    let losemsg = '获取活动信息失败'
    apiFetchWithSuccessAndLoseMsg(url, method, querystring, successmsg,losemsg, (res) => {
        let list = getFormatedRtnData(res,'activities')          //activityIds 为返回数据的数组名称
        cb&&cb(list);
    })
}


/**
 * 指定渠道所有服开启某活动
 * minOpenTime maxOpenTime
 */
export function createActivityAllServers(yx,activityId,startTime,endTime,minOpenTime,maxOpenTime,cb){ 
    const querystring = `yx=${yx}&activityId=${activityId}&startTime=${startTime}&endTime=${endTime}&minOpenTime=${minOpenTime}&maxOpenTime=${maxOpenTime}`;
    let url = "/root/createActivityAllServers.action"
    let method = 'POST'
    let successmsg = '操作成功';
    let losemsg = '操作失败'
    apiFetchWithSuccessAndLoseMsg(url, method, querystring, successmsg,losemsg, undefined, (res) => {
        let list = getFormatedRtnData(res,'results')          //activityIds 为返回数据的数组名称
        showMsg(res.state, list, successmsg, losemsg);
        cb&&cb(list);
    })
}

/**
 * 指定渠道所有服结束某活动（已开启的活动无法结束）
 * minOpenTime maxOpenTime
 */
export function removeActivityAllServers(yx,activityId,minOpenTime,maxOpenTime,cb){ 
    const querystring = `yx=${yx}&activityId=${activityId}&&minOpenTime=${minOpenTime}&maxOpenTime=${maxOpenTime}`;
    let url = "/root/removeActivityAllServers.action"
    // let method = 'POST'
    let successmsg = '操作成功';
    let losemsg = '操作失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg, undefined, (res) => {
        let list = getFormatedRtnData(res,'results')          //activityIds 为返回数据的数组名称
        showMsg(res.state, list, successmsg, losemsg);
        cb&&cb(list);
    })
}


/**显示消息**/
export function showMsg(state, list, successmsg, losemsg) {
    if (state != 1) {
        message.info(losemsg);
    } else {
        let ifSucc = isSucc(list);
        let msg = ifSucc ? successmsg : losemsg;
        message.info(msg);
    }
}

/**成功获取数据**/
export function isSucc(list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].succ == false) {
            return false;
        }
    }
    return true;
}


/**
 * 请求运营日报
 */
export function getDayReport(yx, serverId,startDayStr, endDayStr,cb){ 
    let querystring = `yx=${yx}&serverId=${serverId}&startDayStr=${startDayStr}&endDayStr=${endDayStr}`;
    let url = "/root/getDayReport.action";
    let method = 'POST';
    let successmsg = '查询成功';
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'dayReports')
        // showMsg(res.state, list, successmsg, losemsg);
        cb&&cb(list);
    }, undefined);
}

/**
 * 查询留存
 */
export function getLtvReport(yx, serverId,startDayStr, endDayStr,type,cb){ 
    let querystring = `yx=${yx}&serverId=${serverId}&startDayStr=${startDayStr}&endDayStr=${endDayStr}&type=${type}`;
    let url = "/root/getLtvReport.action";
    let method = 'POST';
    let successmsg = '查询成功';
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'ltvReports')
        // showMsg(res.state, list, successmsg, losemsg);
        cb&&cb(list);
    }, undefined);
}


/**
 * 查询ltv
 */
export function getOnlineTimeData(yx, serverId,startDayStr, endDayStr,cb){ 
    let querystring = `yx=${yx}&serverId=${serverId}&startTime=${startDayStr}&endTime=${endDayStr}`;
    let url = "/root/getOnlineTimeData.action";
    let method = 'POST';
    let successmsg = '查询成功';
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'onlineTimeReports')
        // showMsg(res.state, list, successmsg, losemsg);
        cb&&cb(list);
    }, undefined);
}


/**
 * 查询订单
 */
export function getOrderListInTime(yx, serverId, startTime, endTime, currPage, numPerPage,cb){ 
    let querystring = `yx=${yx}&serverId=${serverId}&startTime=${startTime}&endTime=${endTime}&currPage=${currPage}&numPerPage=${numPerPage}&containFail=1`
    let url = "/root/getOrderListInTime.action"
    let method = 'POST'
    let successmsg = '查询成功';
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'orderList')
        // showMsg(res.state, list, successmsg, losemsg);
        cb&&cb(list);
    }, undefined);
}

/**
 * 充值排行
 */
export function getPayRankList(serverId, yx,cb){ 
    let querystring = `serverId=${serverId}&yx=${yx}`
    let url = "/root/getPayRankList.action"
    let method = 'POST'
    let successmsg = '用户充值数据获取成功'
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'rankList')
        // showMsg(res.state, list, successmsg, losemsg);
        cb&&cb(list);
    }, undefined);
}

/**
 * 留存统计
 */
export function getStayReport(yx, serverId,startDayStr, endDayStr, type,cb){ 
    let querystring = `yx=${yx}&serverId=${serverId}&startDayStr=${startDayStr}&endDayStr=${endDayStr}&type=${type}`;
    let url = "/root/getStayReport.action";
    let method = 'POST';
    let successmsg = '查询成功';
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'stayReports')
        // showMsg(res.state, list, successmsg, losemsg);
        cb&&cb(list);
    }, undefined);
}

/**
 * 发送公告
 */
export function sendNotice(yx, serverId, noticeType, duration, times, content,cb){ 
    let querystring = `yx=${yx}&serverId=${serverId}&noticeType=${noticeType}&duration=${duration}&times=${times}&content=${content}`
    let url = "/root/sendNotice.action"
    let method = 'POST'
    let successmsg = '发送公告成功'
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        cb&&cb();
    }, undefined);
}

/**
 * 更新公告
 */
export function setUpdateNotice(content){ 
    let querystring = `content=${content}`
    let url = "/root/setUpdateNotice.action"
    let method = 'POST'
    let successmsg = '更新公告内容成功'
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        // cb&&cb();
    }, undefined);
}

/**
 * 用户创建
 */ 
export function createUser(userName, md5password, email,authGroupId,cb){ 
    // if(!auths){
    //     auths='';
    // }
    let querystring = `userName=${userName}&password=${md5password}&email=${email}&auths=&authGroupId=${authGroupId?authGroupId:''}`
    let url = "/root/createUser.action"
    let method = "POST"
    let successmsg = '用户创建成功'
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        cb&&cb()
    }, undefined);
}

/**
 * 用户创建
 */ 
export function handleAuthGroup(key,authGroupName, authGroupId,authStr,cb){ 
    let querystring;
    let url;
    let successmsg;
    let method = 'POST'
    if(key==AuthManageType.CREATE){      //创建权限组
        querystring = `authGroupName=${authGroupName}&auths=${authStr}`;
        url = "/root/createAuthGroup.action"
        successmsg = '创建成功';
    }else if(key==AuthManageType.MODIFY){//修改权限组
        querystring = `authGroupId=${authGroupId}&auths=${authStr}`;
        url = "/root/modifyAuthGroup.action"
        successmsg = '修改成功';
    }else if(key==AuthManageType.DELETE){//删除权限组
        querystring = `authGroupId=${authGroupId}`;
        url = "/root/deleteAuthGroup.action"
        successmsg = '删除成功';
    }
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        cb&&cb();
    }, undefined);
}


/**
 * 获取权限组列表
 */ 
export function getAuthGroupList(cb){ 
    let querystring = undefined;
    let  url = "/root/getAuthGroupList.action"
    let successmsg = '刷新权限组列表';
    let method = 'POST';
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,undefined,(res) => {
        let list = getFormatedRtnData(res,'authGroupInfo')
        cb&&cb(list);
    });
}


/**
 * 修改玩家所属的权限组列表
 */ 
export function modityUserAuthGroup(userName, authGroupId){ 
    let querystring = `userName=${userName}&authGroupId=${authGroupId}`;
    let url = "/root/modityUserAuthGroup.action";
    let method = 'POST';
    let successmsg ='修改成功';
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {

    }, undefined);
}

/**
 * 修改玩家所属的权限组列表
 */ 
export function changePlayerName(yx, serverId, beforePlayerName, afterPlayerName){ 
    let querystring = `yx=${yx}&serverId=${serverId}&beforePlayerName=${beforePlayerName}&afterPlayerName=${afterPlayerName}`;
    let url = "/root/changePlayerName.action";
    let method = 'POST';
    let successmsg ='修改成功';
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {

    }, undefined);
}
/**
 * 修改玩家所属的权限组列表
 */ 
export function getUserWhite(yx, cb){ 
    const querystring = `yx=${yx}`
    let url = "/root/getUserWhite.action"
    let method = 'POST'
    let successmsg = '成功获得游戏服列表'
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'whiteList')
        cb&&cb(list);
    }, undefined);
}

/**
 * 修改玩家所属的权限组列表
 */ 
export function setUserWhite(yx, uid, cb){ 
    const querystring = `yx=${yx?yx:''}&uid=${uid?uid:''}`
    let url = "/root/setUserWhite.action"
    let method = 'POST'
    let successmsg = '成功设置游戏状态'
    let losemsg = undefined;
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        // let list = getFormatedRtnData(res,'whiteList')
        cb&&cb();
    }, undefined);
}

/**
 * 获取礼包信息列表
 */ 
export function getItems(serverId, yxValue, cb){ 
    const querystring = `serverId=${serverId}&yx=${yxValue}`;
    let url = "/root/getItems.action"
    let method = 'POST'
    let successmsg = '成功获取礼包信息'
    let losemsg = '获取礼包信息失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'items')
        cb&&cb(list);
    }, undefined);
}

/**
 * 发送邮件
 */ 
export function sendMail(mailType, serverId, yx, playerNameStr, giftContentStr, mailContent, duration, title){ 
    let querystring = `mailType=${mailType}&serverId=${serverId}&yx=${yx}&playerName=${playerNameStr}&attachmenet=${giftContentStr}&mailContent=${mailContent}&duration=${duration}&title=${title}`
    let url = "/root/sendMail.action"
    let method = 'POST'
    let successmsg = '发送邮件成功'
    let losemsg = '发送邮件失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        // let list = getFormatedRtnData(res,'items')
        // cb&&cb(list);
    }, undefined);
}

/**
 * 适应面向对象的查询方式
 */
export function getPlayerInfoOTO(querystring, cb,hasMsg = true){ 
    // let querystring ='';
    // if(queryId=='playerName'){
    //     querystring = `playerId=1&serverId=${serverId}&yx=${yx}&playerName=${playerName}`;
    // }else if(queryId=='userIdyx'){
    //     querystring = `playerId=2&serverId=${serverId}&userId=${userId}&yx=${yx}`;
    // }else if(queryId=='playerId'){
    //     querystring = `playerId=3&serverId=${serverId}&yx=${yx}&playerName=${playerId}`;
    // }
    let url = "/root/playerInfo.action"
    let method = 'POST'
    let successmsg = '获取玩家数据成功'
    let losemsg = '获取玩家数据失败';
    // apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,undefined,(res) => {
    //     let list = getFormatedRtnData(res,'playerList')
    //     showMsg(res.state, list, successmsg, losemsg);
    //     cb&&cb(list);
    // });
    if(hasMsg){   //含有消息展示
        apiFetchWithMsg(url, method, querystring, successmsg,(res)=>{
            // apiFetchError(url, method, querystring, successmsg, cb,errCb) {
                debugger
            let list = getFormatedRtnData(res,'playerList')
            cb&&cb(list);
        });
    }else{        //不含有消息展示
        apiFetchNomsg(url, method, querystring, successmsg,(res)=>{
            // apiFetchError(url, method, querystring, successmsg, cb,errCb) {
            let list = getFormatedRtnData(res,'playerList')
            cb&&cb(list);
        });
    }
}
/**
 * 查询玩家数据
 */ 
export function getPlayerInfo(queryId, serverId, playerName, userId, yx, playerId, cb,hasMsg = true){ 
    let querystring ='';
    if(queryId=='playerName'){
        querystring = `playerId=1&serverId=${serverId}&yx=${yx}&playerName=${playerName}`;
    }else if(queryId=='userIdyx'){
        querystring = `playerId=2&serverId=${serverId}&yx=${yx}&userId=${userId}`;
    }else if(queryId=='playerId'){
        querystring = `playerId=3&serverId=${serverId}&yx=${yx}&playerName=${playerId}`;
    }
    let url = "/root/playerInfo.action"
    let method = 'POST'
    let successmsg = '获取玩家数据成功'
    let losemsg = '获取玩家数据失败';
    // apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,undefined,(res) => {
    //     let list = getFormatedRtnData(res,'playerList')
    //     showMsg(res.state, list, successmsg, losemsg);
    //     cb&&cb(list);
    // });
    if(hasMsg){   //含有消息展示
        apiFetchWithMsg(url, method, querystring, successmsg,(res)=>{
            // apiFetchError(url, method, querystring, successmsg, cb,errCb) {
            let list = getFormatedRtnData(res,'playerList')
            cb&&cb(list);
        });
    }else{        //不含有消息展示
        apiFetchNomsg(url, method, querystring, successmsg,(res)=>{
            // apiFetchError(url, method, querystring, successmsg, cb,errCb) {
            let list = getFormatedRtnData(res,'playerList')
            cb&&cb(list);
        });
    }
}




/**
 * 发送邮件
 */ 
export function modifyPlayerIdentity(yx, serverId, name,cb){ 
    const querystring = `yx=${yx}&serverId=${serverId}&playerName=${name}`
    let url = "/root/modifyPlayerIdentity.action"
    let method = 'POST'
    let successmsg = '设置成功'
    let losemsg = '发送邮件失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb(list);
    }, undefined);
}

/**
 * 补单
 */ 
export function repay(serverId, playerName, orderId, yx){ 
    const querystring = `serverId=${serverId}&playerName=${playerName}&yx=${yx}&orderId=${orderId}`
    let url = "/root/repay.action"
    let method = 'POST'
    let successmsg = '补单成功'
    let losemsg = '补单失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        // cb&&cb(list);
    }, undefined);
}

/**
 * 禁言
 */ 
export function banChat(serverId, playerName, reason, duration ,yx,cb){ 
    let querystring = `playerId=${QueryType.PLAYERNAME}&serverId=${serverId}&yx=${yx}&playerName=${playerName}&reason=${reason}&duration=${duration}`
    let url = "/root/banChat.action"
    let method = 'POST';
    let successmsg = (reason!==''&&duration!=='')?'禁言成功':'请填写原因和期限';
    let losemsg = '禁言失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb();
    }, undefined);
}


/**
 * 解除禁言
 */ 
export function unbanChat(serverId, playerName ,yx,cb){ 
    let querystring = `playerId=${QueryType.PLAYERNAME}&serverId=${serverId}&playerName=${playerName}&yx=${yx}`
    let url = "/root/unbanChat.action"
    let method = 'POST'
    let successmsg = '解除禁言成功'
    let losemsg = '解除禁言失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb();
    }, undefined);
}


/**
 * 封禁玩家
 */ 
export function banUser(serverId, playerName, reason, duration ,yx,cb){ 
    let querystring = `playerId=${QueryType.PLAYERNAME}&playerName=${playerName}&serverId=${serverId}&yx=${yx}&reason=${reason}&duration=${duration}`
    let url = "/root/banUser.action"
    let method = 'POST'
    let successmsg = (reason!==''&&duration!=='')?'封禁成功':'请填写原因和期限'
    let losemsg = '封禁玩家失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb();
    }, undefined);
}

/**
 * 解禁玩家
 */ 
export function unbanUser(serverId, playerName,yx,cb){ 
    let querystring = `playerId=${QueryType.PLAYERNAME}&playerName=${playerName}&serverId=${serverId}&yx=${yx}`
    let url = "/root/unbanUser.action"
    let method = 'POST'
    let successmsg ='解除封禁成功'
    let losemsg = '解除封禁失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb();
    }, undefined);
}


/**
 * 礼品获取
 */ 
export function getGiftCodeContents(cb){ 
    let querystring = ''
    let url = "/root/getGiftCodeContents.action"
    let method = 'POST'
    let successmsg ='礼品获取成功'
    let losemsg = '礼品获取失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'contentList')
        cb&&cb(list);
    }, undefined);
}


/**
 * 过期时间修改
 */ 
export function changeGiftCodeExpireTime(cb){ 
    let querystring = ''
    let url = "/root/changeGiftCodeExpireTime.action"
    let method = 'POST'
    let successmsg ='过期时间修改成功'
    let losemsg = '过期时间修改失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb();
    }, undefined);
}

/**
 * 生成礼品码
 */ 
export function generateGiftCode(giftVid, num, scope){ 
    let querystring = `vid=${giftVid}&num=${num}&scope=${scope}`
    let url = "/root/generateGiftCode.action"
    let method = 'POST'
    let successmsg = '成功生成礼品码'
    let losemsg = '生成礼品码失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        // cb&&cb();
    }, undefined);
}



/**
 * 获取礼品码
 */ 
export function getGiftCode(giftCodeType, serverId, yx, num, giftContent, duration,cb){ 
    let querystring = `giftCodeType=${giftCodeType}&serverId=${serverId}&yx=${yx}&num=${num}&giftContent=${giftContent}&duration=${duration}`
    let url = "/root/getGiftCode.action"
    let method = 'POST'
    let successmsg = '礼品码获取成功'
    let losemsg = '获取礼品码失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb(res);
    }, undefined);
}

/**
 * 创建礼品
 */ 
export function createGiftCodeContent(yx, serverId, name, batch, expireTime, canRepeat, giftContent,cb){ 
    const querystring = `yx=${yx}&serverId=${serverId}&name=${name}&batch=${batch}&expireTime=${expireTime}&canRepeat=${canRepeat}&giftContent=${giftContent}`
    let url = "/root/createGiftCodeContent.action"
    let method = 'POST'
    let successmsg = '成功创建礼品'
    let losemsg = '创建礼品失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb();
    }, undefined);
}

/**
 * 发送礼包
 */ 
export function sendGift(yx, serverId, giftType, playerName, giftContent, duration, title,cb){ 
    const querystring = `yx=${yx}&serverId=${serverId}&giftType=${giftType}&playerName=${playerName}&giftContent=${giftContent}&duration=${duration}&title=${title}`
    let url = "/root/sendGift.action"
    let method = 'POST'
    let successmsg = '成功发送礼包'
    let losemsg = '发送礼包失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb();
    }, undefined);
}


/**
 * 修改公告
 */ 
export function modifyNotice(yxValue,serverId,noticeId,content,cb){ 
    const querystring =`yx=${yxValue}&serverId=${serverId}&noticeId=${noticeId}&content=${content}`;
    let url = "/root/modifyNotice.action"
    let method = 'POST'
    let successmsg = '成功修改公告'
    let losemsg = '修改公告失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb();
    }, undefined);
}

/**
 * 删除公告
 */ 
export function deleteNotice(yxValue,serverId,noticeId,cb){ 
    const querystring =`yx=${yxValue}&serverId=${serverId}&noticeId=${noticeId}`;
    let url = "/root/deleteNotice.action"
    let method = 'POST'
    let successmsg = '成功删除公告'
    let losemsg = '删除公告失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,() => {
        // let list = getFormatedRtnData(res,'identityInfo')
        cb&&cb();
    }, undefined);
}

/**
 * 查询指定时间段的在线人数
 */ 
export function getOnlineNumData(yx, serverId, startTime, endTime, cb){ 
    let querystring = `yx=${yx}&serverId=${serverId}&startTime=${startTime}&endTime=${endTime}`;
    let url = "/root/getOnlineNumData.action";
    let method = 'POST';
    let successmsg = '查询成功';
    let losemsg = '查询失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'onlineNumList')
        cb&&cb(list);
    }, undefined);
}


/**-------------------------------------用户以及权限--------------------------------------------***/
/**
 * 修改密码
 */
export function changePassword(oldPassword,newPassword,cb){ 
    let querystring = `oldPassword=${oldPassword}&newPassword=${newPassword}`;
    let url = "/root/changePassword.action";
    let method = 'POST';
    let successmsg = '修改成功';
    let losemsg = '修改失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        // let list = getFormatedRtnData(res,'userList')
        // cb&&cb(list);
        cb&&cb();
    }, undefined);
}

/**
 * 重置密码
 */
export function resetPassword(userName,cb){ 
    let querystring = `userName=${userName}`;
    let url = "/root/resetPassword.action";
    let method = 'POST';
    let successmsg = '重置成功';
    let losemsg = '重置失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        // let list = getFormatedRtnData(res,'userList')
        // cb&&cb(list);
        cb&&cb();
    }, undefined);
}

/**
 * 删除用户
 */
export function deleteUser(userName,cb){ 
    let querystring = `userName=${userName}`;
    let url = "/root/deleteUser.action";
    let method = 'POST';
    let successmsg = '删除用户成功';
    let losemsg = '删除用户失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        // let list = getFormatedRtnData(res,'userList')
        // cb&&cb(list);
        cb&&cb();
    }, undefined);
}


/**
 * 获取已创建用户列表
 */ 
export function getAllCreateUsers(cb){ 
    let querystring = '';
    let url = "/root/getAllCreateUsers.action";
    let method = 'POST';
    let successmsg = '查询成功';
    let losemsg = '查询失败';
    apiFetchWithSuccessAndLoseMsg(url, method='POST', querystring, successmsg,losemsg,(res) => {
        let list = getFormatedRtnData(res,'userList');
        // setTimeout(()=>{cb&&cb(list)},1000);
        cb&&cb(list);
    }, undefined);
    // apiFetchNomsg(url, method='POST', querystring, successmsg,(res)=>{
    //     // apiFetchError(url, method, querystring, successmsg, cb,errCb) {
    //     let list = getFormatedRtnData(res,'userList')
    //     cb&&cb(list);
    // });
}

//权限组操作的方式
export const  AuthManageType = {
    CREATE: '创建',    //创建权限组
    MODIFY: '修改',    //修改权限组
    DELETE: '删除',    //删除权限组
}

//查询玩家信息的方式
export const  QueryType = {
    PLAYERNAME: 1,  //通过玩家名查询
    USERID:2,     //通过角色id查询
    PLAYERID: 3,   //通过玩家id查询
}