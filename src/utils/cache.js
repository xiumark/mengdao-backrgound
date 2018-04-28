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

export function isNotExpired(time) {
    time=(time===undefined?0:time)
    let data = (new Date()).getTime();
    if (data>time){
        return true;  //没有过期
    }else{
        return false; //已经过期
    }
    // localStorage && localStorage.removeItem(key);
}

//表单值存入localStorage
export function setInputLocalStorage(yx, serverId, startTime, endTime, currPage, numPerPage, startDayStr, endDayStr){
    localStorage.expireTime=new Date();
    yx&&(localStorage.yx = yx);
    serverId&&(localStorage.serverId=serverId);
    startTime&&(localStorage.startTime = startTime);
    endTime&&(localStorage.endTime = endTime);
    currPage&&(localStorage.currPage = currPage);
    numPerPage&&(localStorage.numPerPage = numPerPage);
    startDayStr&&(localStorage.startDayStr = startDayStr);
    endDayStr&&(localStorage.endDayStr = endDayStr);
}