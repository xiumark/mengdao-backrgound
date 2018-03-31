import { message } from 'antd';

export function apiFetch(url, method, querystring, successmsg, cb) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    fetch(url, {
        credentials: 'include', //发送本地缓存数据
        method: method,
        headers: {
            headers
        },
        body: querystring
    }).then(res => {
        // console.log("here")
        if (res.status !== 200) {
            throw new Error("未知错误")
        }
        return res;
    }).then(res => res.json())
        .then(res => {
            // console.log("res", res)
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
    fetch(url, {
        credentials: 'include', //发送本地缓存数据
        method: method,
        headers: {
            headers
        },
        body: querystring
    }).then(res => {
        // console.log("here")
        if (res.status !== 200) {
            throw new Error("未知错误")
        }
        return res;
    }).then(res => res.json())
        .then(res => {
            // console.log("res", res)
            if (res.state === 1) {
                // message.info(successmsg)
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