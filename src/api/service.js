import { message } from 'antd';
import { apiFetch, requestData, apiFetchWithSuccessAndLoseMsg } from './api.js';
import { setKeyForList } from './lib.js';

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
 * 
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
export function getAllServerStateData(yx,serverId,cb){
    const querystring = `yx=${yx}&serverId=${serverId}`
    let url = "/root/getServerState.action"
    let method = 'POST'
    let successmsg = '成功获得游戏服列表'
    apiFetch(url, method, querystring, successmsg, (res) => {
        let list = getFormatedRtnData(res,'serverList')
        cb&&cb(list)
    })
}



//局格式化后台返回的数据,设置key
export function getFormatedRtnData(res,rtnList){
    let list =[];
    if(res.data[rtnList]&&res.data[rtnList].length>0){
        list = setKeyForList(res.data[rtnList]);
    }
    return list;
}


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
    let querystring = `serverId=${serverId}&yxValue=${yxValue}`
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
    let method = 'POST'
    let successmsg = '操作成功';
    let losemsg = '操作失败'
    apiFetchWithSuccessAndLoseMsg(url, method, querystring, successmsg,losemsg, undefined, (res) => {
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



// //请求运营日报
// export function getDayReport(yx, serverId,startDayStr, endDayStr){
//     let querystring = `yx=${yx}&serverId=${serverId}&startDayStr=${startDayStr}&endDayStr=${endDayStr}`;
//     let url = "/root/getDayReport.action";
//     let method = 'POST';
//     let successmsg = '查询成功';
//     apiFetch(url, method, querystring, successmsg, (res) => {
//         let dayReports = res.data.dayReports;
//         this.setState({dayReports:dayReports});
//          //请求成功后设置localStorage
//          setDayReportStorage(yx, serverId,startDayStr, endDayStr);
//     });
// }