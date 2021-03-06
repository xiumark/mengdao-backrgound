import { message } from 'antd';

export function apiFetch(url, method, querystring, successmsg, cb) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    message.loading('数据请求中...',0);
    fetch(url, {
        credentials: 'include', //发送本地缓存数据
        method: method,
        headers: {
            headers
        },
        body: querystring
    }).then(res => {
        //显示请求数据提示
        // message.loading('数据请求中...',0);
        message.destroy();
        if (res.status !== 200) {
            throw new Error("未知错误")
        }
        return res;
    }).then(res => res.json())
        .then(res => {
            //隐藏请求数据提示
            // message.destroy();
            if (res.state === 1) {
                message.info(successmsg)
                cb && cb(res)
            }
            if (res.state === 0) {
                throw new Error(res.data.msg)
            }
        })
        .catch(err => {
            message.error(err.message ? err.message : "未知错误")
        })
}


export function apiFetchNomsg(url, method, querystring, successmsg, cb) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    message.loading('数据请求中...',0);
    fetch(url, {
        credentials: 'include', //发送本地缓存数据
        method: method,
        headers: {
            headers
        },
        body: querystring
    }).then(res => {
        message.destroy();
        if (res.status !== 200) {
            throw new Error("未知错误")
        }
        return res;
    }).then(res => res.json())
        .then(res => {
            if (res.state === 1) {
                cb && cb(res)
            }
            if (res.state === 0) {
                throw new Error(res.data.msg)
            }
        })
        .catch(err => {
            message.error(err.message ? err.message : "未知错误")
        })
}


export function apiFetchError(url, method, querystring, successmsg, cb,errCb) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    message.loading('数据请求中...',0);
    fetch(url, {
        credentials: 'include', //发送本地缓存数据
        method: method,
        headers: {
            headers
        },
        body: querystring
    }).then(res => {
        message.destroy();
        if (res.status !== 200) {
            throw new Error("未知错误")
        }
        return res;
    }).then(res => res.json())
        .then(res => {
            if (res.state === 1) {
                message.info(successmsg)
                cb && cb(res)
            }
            if (res.state === 0) {
                errCb && errCb()
                throw new Error(res.data.msg)
            }
        })
        .catch(err => {
            message.error(err.message ? err.message : "未知错误")
        })
}

export function apiFetchWithMsg(url, method, querystring, successmsg, cb,errCb) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    message.loading('数据请求中...',0);
    fetch(url, {
        credentials: 'include', //发送本地缓存数据
        method: method,
        headers: {
            headers
        },
        body: querystring
    }).then(res => {
        message.destroy();
        if (res.status !== 200) {
            throw new Error("未知错误")
        }
        return res;
    }).then(res => res.json())
        .then(res => {
            if(res.data&&res.data.msg){
                message.info(res.data.msg)
            }else{
                if (res.state === 1) {
                    message.info(successmsg)
                    cb && cb(res)
                }
                if (res.state === 0) {
                    errCb && errCb()
                    throw new Error(res.data.msg)
                }
            }
            
        })
        .catch(err => {
            message.error(err.message ? err.message : "未知错误")
        })
}

export function requestData(url, method, querystring, successmsg, cb) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    message.loading('数据请求中...',0);
    fetch(url, {
        credentials: 'include', //发送本地缓存数据
        method: method,
        headers: {
            headers
        },
        body: querystring
    }).then(res => {
        //显示请求数据提示
        message.destroy();
        if (res.status !== 200) {
            throw new Error("未知错误")
        }
        return res;
    }).then(res => res.json())
        .then(res => {
            //隐藏请求数据提示
            // message.destroy();
            if (res.state === 1) {
                message.info(successmsg)
                cb && cb(res)
            }
            if (res.state === 0) {
                throw new Error(res.data.msg)
            }
        })
        .catch(err => {
            message.error(err.message ? err.message : "未知错误")
        })
}

/**
 * 可以有成功信息，失败信息，消息返回后特殊处理的请求
 */
export function apiFetchWithSuccessAndLoseMsg(url, method, querystring, successmsg, losemsg, cb, specialCallback) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    message.loading('数据请求中...',0);
    fetch(url, {
        credentials: 'include', //发送本地缓存数据
        method: method,
        headers: {
            headers
        },
        body: querystring
    }).then(res => {
        message.destroy();
        if (res.status !== 200) {
            throw new Error(losemsg?losemsg:"未知错误")
        }
        return res;
    }).then(res => res.json())
        .then(res => {
            if (specialCallback) {
                specialCallback(res);
            } else {
                if (res.state === 1) {
                    successmsg && message.info(successmsg)
                    cb && cb(res)
                }
                if (res.state === 0) {
                    throw new Error(res.data.msg)
                }
            }
        })
        .catch(err => {
            message.error(err.message ? err.message : losemsg)
        })
}