import { message } from 'antd';
import { apiFetch } from './api.js';

/**
 * 与后台交互函数，获取后台服务器数据
 */

// export function getServiceList() {//获取游戏服列表post方式
//     let querystring = '';
//     let url = "/root/getServerList.action";
//     let method = 'POST';
//     let successmsg = null;
//     return apiFetch(url, method, querystring, successmsg,
//         (res) => {
//             console.log("服务器列表数据:", res)
//             res = res.data.serverInfos
//         })
// }


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


export function getYxList(data, cb) {
        //获取版署列表
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