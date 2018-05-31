import moment from 'moment';
/**
 * 设置cookie
 * @param key
 * @param value
 */
export function setCookie(key, value) {
    try {
        let cookie = document.cookie
        if(getCookie(key)){
            return;
        }

        document.cookie = key+"="+JSON.stringify(value)+"; path=/";
        // $.cookie(key, JSON.stringify(value), {expires:1});
    }catch (err){
        // console.log('存cookie错误:'+key);
    }

}

export function getCookie(key) {
	switch(key) {
		case 'user':
			return {"id":"Lx8ve8jEJLJddyp7fW2Ayv1NSQ","ttl":1209600,"created":"2017-09-27T00:23:14.910Z","userId":1,"role":"admin"};
		case 'host_ip':
			return 'host_ip';
	}
}

export function deleteCookie(key){
    try{
        document.cookie = key+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }catch (err){
        // console.log('删cookie错误:'+key);
    }
}

/**
 *  设置缓存
 * @param key
 * @param value
 */

export function setLocalStorage(key, value) {
    try {
        localStorage && localStorage.setItem(key, JSON.stringify(value));
    }catch (err){
        // console.log('存localStorage错误:'+key);
    }
}

export function getLocalStorage(key) {
    let data
    if(localStorage && localStorage.getItem){
        localStorage.getItem(key);
    }

    if(!!data){
        return JSON.parse(data);
    }

    return null;
}

export function removeLocalStorage(key) {
    localStorage && localStorage.removeItem(key);
}

export function isNotExpired(expireTime) {
    let nowTime = (new Date()).getTime(); //当前时间
    if (nowTime<expireTime){
        // console.log("没有过期")
        return true;  //没有过期
    }else{
        // console.log("过期")
        return false; //已经过期
    }
    // localStorage && localStorage.removeItem(key);
}

//表单值存入localStorage
export function setInputLocalStorage(yx, serverId, startTime, endTime, currPage, numPerPage, startDayStr, endDayStr){
    yx&&(localStorage.yx = yx);
    serverId&&(localStorage.serverId=serverId);
    startTime&&(localStorage.startTime = startTime);
    endTime&&(localStorage.endTime = endTime);
    currPage&&(localStorage.currPage = currPage);
    numPerPage&&(localStorage.numPerPage = numPerPage);
    startDayStr&&(localStorage.startDayStr = startDayStr);
    endDayStr&&(localStorage.endDayStr = endDayStr);
}


/**
 * 游戏报表部分缓存处理
 */

/**
 * 充值排行缓存设置rank
 * @param: yx, serverId
 */
export function setRankListStorage(rankYx, rankServerId){
    rankYx&&(localStorage.rankYx = rankYx);
    rankServerId&&(localStorage.rankServerId=rankServerId);
}

/**
 * 充值订单列表缓存设置orderList
 */
export function setOrderListStorage(orderYx, orderServerId, orderStartTime, orderEndTime, orderCurrPage, ordernumPerPage){
    // localStorage.orderExpireTime=new Date();
    orderYx&&(localStorage.orderYx = orderYx);
    orderServerId&&(localStorage.orderServerId=orderServerId);
    orderStartTime&&(localStorage.orderStartTime=orderStartTime);
    orderEndTime&&(localStorage.orderEndTime=orderEndTime);
    orderCurrPage&&(localStorage.orderCurrPage=orderCurrPage);
    ordernumPerPage&&(localStorage.ordernumPerPage=ordernumPerPage);
    // orderSortType&&(localStorage.orderSortType=orderSortType);
    // orderIsAscend&&(localStorage.orderIsAscend=orderIsAscend);
    // orderContainFail&&(localStorage.orderContainFail=orderContainFail);
}

/**
 * 在线人数缓存设置Online
 * 
 */
export function setOlineStorage(olineYx, olineServerId, olineStartTime, olineEndTime){
    // localStorage.onlineExpireTime=new Date();
    olineYx&&(localStorage.olineYx = olineYx);
    olineServerId&&(localStorage.olineServerId=olineServerId);
    olineStartTime&&(localStorage.olineStartTime=olineStartTime);
    olineEndTime&&(localStorage.olineEndTime=olineEndTime);
}

/**
 * 运营日报缓存设置dayReport
 * 
 */
export function setDayReportStorage(dayReportYx, dayReportServerId, dayReportStartDay, dayReportEndDay){
    // localStorage.dayReportExpireTime=new Date();
    dayReportYx&&(localStorage.dayReportYx = dayReportYx);
    dayReportServerId&&(localStorage.dayReportServerId=dayReportServerId);
    dayReportStartDay&&(localStorage.dayReportStartDay=dayReportStartDay);
    dayReportEndDay&&(localStorage.dayReportEndDay=dayReportEndDay);
}

/**
 * 留存统计缓存设置stayReport
 * 
 */
export function setStayReportStorage(stayReportYx, stayReportServerId, stayReportStartDayStr, stayReportEndDayStr){
    // localStorage.stayReportExpireTime=new Date();
    stayReportYx&&(localStorage.stayReportYx = stayReportYx);
    stayReportServerId&&(localStorage.stayReportServerId=stayReportServerId);
    stayReportStartDayStr&&(localStorage.stayReportStartDayStr=stayReportStartDayStr);
    stayReportEndDayStr&&(localStorage.stayReportEndDayStr=stayReportEndDayStr);
}

/**
 * LTV统计缓存设置ltvReport
 * 
 */
export function setLtvReportStorage(ltvReportYx, ltvReportServerId, ltvReportStartDayStr, ltvReportEndDayStr){
    // localStorage.ltvReportExpireTime=new Date();
    ltvReportYx&&(localStorage.ltvReportYx = ltvReportYx);
    ltvReportServerId&&(localStorage.ltvReportServerId=ltvReportServerId);
    ltvReportStartDayStr&&(localStorage.ltvReportStartDayStr=ltvReportStartDayStr);
    ltvReportEndDayStr&&(localStorage.ltvReportEndDayStr=ltvReportEndDayStr);
}

/**
 * 在线时长缓存设置onlineTimeData
 * 
 */
export function setOnlineTimeData(onlineTimeYx, onlineTimeServerId, onlineTimeStartDayStr, onlineTimeEndDayStr){
    // localStorage.ltvReportExpireTime=new Date();
    onlineTimeYx&&(localStorage.onlineTimeYx = onlineTimeYx);
    onlineTimeServerId&&(localStorage.onlineTimeServerId=onlineTimeServerId);
    onlineTimeStartDayStr&&(localStorage.onlineTimeStartDayStr=onlineTimeStartDayStr);
    onlineTimeEndDayStr&&(localStorage.onlineTimeEndDayStr=onlineTimeEndDayStr);
}