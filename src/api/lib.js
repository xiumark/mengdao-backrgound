import moment from 'moment';
/**
 * 工具库
 * 
 */

//为数组设置key,避免react中列表渲染时候报错
export function setKeyForList(itemList){
    let itemKeyList = [];
    for(let i = 0;i<itemList.length;i++){
        let item = itemList[i];
        itemKeyList.push(Object.assign({},item,{key:i}))
    }
    return itemKeyList;
}

//排序

//格式化到某一时刻
export function formatTimeByType(time,type,state){
    let timeStamp = (new Date(time)).getTime();
    let timeFomated  
    if(type==TIME_FORMAT_TYPE.BEFORE_FIVE){      //04:59:59
        timeFomated = state==1?parseInt(timeStamp/86400000+1)*86400000-8*3600*1000-1000+3600*1000*5:timeStamp   //59:59
    }else if(type==TIME_FORMAT_TYPE.FIVE){//05:00:00
        timeFomated = state==1?(parseInt(timeStamp/86400000)*86400000-8*3600*1000 +3600*1000*5):timeStamp   //00:00
    }
    let timeResult = new Date(timeFomated)
    let timer = moment(timeResult).format('YYYY-MM-DD HH:mm:ss'); 
    return timer;
}



export const  TIME_FORMAT_TYPE = {
    BEFORE_FIVE: 0,   //格式化到：04:59:59
    FIVE: 1,    //格式化到：05:00:00
}

