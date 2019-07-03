import moment from 'moment';
/**
 * 工具库
 * 
 */

/**
 * 局格式化后台返回的数据,设置key
 * @param res      对象，可能包含rtnList名称的数组
 * @param rtnList  数组的名称   字符串
 */
export function getFormatedRtnData(res,rtnList){
    let list =[];
    if(res.data[rtnList]&&res.data[rtnList].length>0){
        list = setKeyForList(res.data[rtnList]);
    }
    return list;
}


/**
 * 为数组设置key,避免react中列表渲染时候报错
 * @param itemList 数组，设置key
 */
export function setKeyForList(itemList){
    let itemKeyList = [];
    for(let i = 0;i<itemList.length;i++){
        let item = itemList[i];
        if(item.playerName){ //有playerName字段的时候要做特殊处理
            let playerNameStrArray = item.playerName.split('_');
            if(!playerNameStrArray[1]) { playerNameStrArray[1] = '' }
            itemKeyList.push(Object.assign({}, item, {key:i, playerName: playerNameStrArray[0], userId: playerNameStrArray[1]}));
        }else{
            itemKeyList.push(Object.assign({},item,{key:i}));
        }
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

//用于判断有IDList中有没有指定的id
export function hasId(idListString,id){
    if(idListString.indexOf(id)>0){
        return true;
    }
    return false;
}


export const  TIME_FORMAT_TYPE = {
    BEFORE_FIVE: 0,   //格式化到：04:59:59
    FIVE: 1,    //格式化到：05:00:00
}

