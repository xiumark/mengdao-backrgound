

/**
 * 管理页签对应的权限开启
 * 一般是一对一，偶尔是一对多
 */
// const authList =
//   [
//     {key: 1, authId: 1, authName: "创建账号"},
//     {key: 2, authId: 2, authName: "删除账号"},
//     {key: 4, authId: 4, authName: "发放礼包"},
//     {key: 5, authId: 5, authName: "玩家信息查询"},
//     {key: 6, authId: 6, authName: "禁言"},
//     {key: 7, authId: 7, authName: "补单"},
//     {key: 8, authId: 8, authName: "发送系统公告"},
//     {key: 9, authId: 9, authName: "封禁玩家"}, 
//     {key: 10, authId: 10, authName: "设置更新公告"},
//     {key: 11, authId: 11, authName: "发送邮件"},
//     {key: 12, authId: 12, authName: "查询服务器列表"},
//     {key: 13, authId: 13, authName: "查询渠道标识列表"},
//     {key: 14, authId: 14, authName: "创建礼品"},
//     {key: 15, authId: 15, authName: "修改礼品过期时间"},
//     {key: 16, authId: 16, authName: "生成礼品码"},
//     {key: 17, authId: 17, authName: "获取礼品列表"},
//     {key: 18, authId: 18, authName: "获得玩家累计充值前20名"},
//     {key: 19, authId: 19, authName: "获得指定时间段充值订单"},  
//     {key: 20, authId: 20, authName: "获得指定区服指定日期的在线人数数据"},
//     {key: 21, authId: 21, authName: "获得指定区服指定日期的运营日报"},
//     {key: 22, authId: 22, authName: "获得指定区服指定日期的留存统计"},
//     {key: 23, authId: 23, authName: "获得指定区服指定日期的LTV统计"},
//     {key: 24, authId: 24, authName: "获得指定区服指定日期的在线时长数据"},
//     {key: 25, authId: 25, authName: "开启活动"},
//   ]

// const authIdxMap = 
//   [    
//     {key: 1, authId: 1, authName: "创建账号",indexArray:[1]},
//     {key: 2, authId: 2, authName: "删除账号",indexArray:[2]},
//     {key: 4, authId: 4, authName: "发放礼包",indexArray:[4]},
//     {key: 5, authId: 5, authName: "玩家信息查询",indexArray:[5]},
//     {key: 6, authId: 6, authName: "禁言",indexArray:[6]},
//     {key: 7, authId: 7, authName: "补单",indexArray:[7]},
//     {key: 8, authId: 8, authName: "发送系统公告",indexArray:[8,10]},
//     {key: 9, authId: 9, authName: "封禁玩家",indexArray:[9]}, 
//     {key: 10, authId: 10, authName: "设置更新公告",indexArray:[8,10]},
//     {key: 11, authId: 11, authName: "发送邮件",indexArray:[11]},
//     {key: 12, authId: 12, authName: "查询服务器列表",indexArray:[12]},
//     {key: 13, authId: 13, authName: "查询渠道标识列表",indexArray:[13]},
//     {key: 14, authId: 14, authName: "创建礼品",indexArray:[14]},
//     {key: 15, authId: 15, authName: "修改礼品过期时间",indexArray:[15]},
//     {key: 16, authId: 16, authName: "生成礼品码",indexArray:[16]},
//     {key: 17, authId: 17, authName: "获取礼品列表",indexArray:[17]},
//     {key: 18, authId: 18, authName: "获得玩家累计充值前20名",indexArray:[18]},
//     {key: 19, authId: 19, authName: "获得指定时间段充值订单",indexArray:[19]},  
//     {key: 20, authId: 20, authName: "获得指定区服指定日期的在线人数数据",indexArray:[20]},
//     {key: 21, authId: 21, authName: "获得指定区服指定日期的运营日报",indexArray:[21]},
//     {key: 22, authId: 22, authName: "获得指定区服指定日期的留存统计",indexArray:[22]},
//     {key: 23, authId: 23, authName: "获得指定区服指定日期的LTV统计",indexArray:[23]},
//     {key: 24, authId: 24, authName: "获得指定区服指定日期的在线时长数据",indexArray:[24]},
//     {key: 25, authId: 25, authName: "开启活动",indexArray:[25]},
// ]

export class Authmanager{
  
  constructor(){
    this._instance,
    this.authList =
      [
        {key: 1, authId: 1, authName: "创建账号"},
        {key: 2, authId: 2, authName: "删除账号"},
        {key: 4, authId: 4, authName: "发放礼包"},
        {key: 5, authId: 5, authName: "玩家信息查询"},
        {key: 6, authId: 6, authName: "禁言"},
        {key: 7, authId: 7, authName: "补单"},
        {key: 8, authId: 8, authName: "发送系统公告"},
        {key: 9, authId: 9, authName: "封禁玩家"}, 
        {key: 10, authId: 10, authName: "设置更新公告"},
        {key: 11, authId: 11, authName: "发送邮件"},
        {key: 12, authId: 12, authName: "查询服务器列表"},
        {key: 13, authId: 13, authName: "查询渠道标识列表"},
        {key: 14, authId: 14, authName: "创建礼品"},
        {key: 15, authId: 15, authName: "修改礼品过期时间"},
        {key: 16, authId: 16, authName: "生成礼品码"},
        {key: 17, authId: 17, authName: "获取礼品列表"},
        {key: 18, authId: 18, authName: "获得玩家累计充值前20名"},
        {key: 19, authId: 19, authName: "获得指定时间段充值订单"},  
        {key: 20, authId: 20, authName: "获得指定区服指定日期的在线人数数据"},
        {key: 21, authId: 21, authName: "获得指定区服指定日期的运营日报"},
        {key: 22, authId: 22, authName: "获得指定区服指定日期的留存统计"},
        {key: 23, authId: 23, authName: "获得指定区服指定日期的LTV统计"},
        {key: 24, authId: 24, authName: "获得指定区服指定日期的在线时长数据"},
        {key: 25, authId: 25, authName: "开启活动"},
      ]
  
  this.authIdxMap = 
      [    
        {key: 1, authId: 1, authName: "创建账号",indexArray:[1]},
        {key: 2, authId: 2, authName: "删除账号",indexArray:[2]},
        {key: 4, authId: 4, authName: "发放礼包",indexArray:[4]},
        {key: 5, authId: 5, authName: "玩家信息查询",indexArray:[5]},
        {key: 6, authId: 6, authName: "禁言",indexArray:[6]},
        {key: 7, authId: 7, authName: "补单",indexArray:[7]},
        {key: 8, authId: 8, authName: "发送系统公告",indexArray:[8,10]},
        {key: 9, authId: 9, authName: "封禁玩家",indexArray:[9]}, 
        {key: 10, authId: 10, authName: "设置更新公告",indexArray:[8,10]},
        {key: 11, authId: 11, authName: "发送邮件",indexArray:[11]},
        {key: 12, authId: 12, authName: "查询服务器列表",indexArray:[12]},
        {key: 13, authId: 13, authName: "查询渠道标识列表",indexArray:[13]},
        {key: 14, authId: 14, authName: "创建礼品",indexArray:[14]},
        {key: 15, authId: 15, authName: "修改礼品过期时间",indexArray:[15]},
        {key: 16, authId: 16, authName: "生成礼品码",indexArray:[16]},
        {key: 17, authId: 17, authName: "获取礼品列表",indexArray:[17]},
        {key: 18, authId: 18, authName: "获得玩家累计充值前20名",indexArray:[18]},
        {key: 19, authId: 19, authName: "获得指定时间段充值订单",indexArray:[19]},  
        {key: 20, authId: 20, authName: "获得指定区服指定日期的在线人数数据",indexArray:[20]},
        {key: 21, authId: 21, authName: "获得指定区服指定日期的运营日报",indexArray:[21]},
        {key: 22, authId: 22, authName: "获得指定区服指定日期的留存统计",indexArray:[22]},
        {key: 23, authId: 23, authName: "获得指定区服指定日期的LTV统计",indexArray:[23]},
        {key: 24, authId: 24, authName: "获得指定区服指定日期的在线时长数据",indexArray:[24]},
        {key: 25, authId: 25, authName: "开启活动",indexArray:[25]},
    ]

  }


  //判断某一个权限是否开启
   isAuthOpen = (idx)=>{

    return true
   }

   //获取权限id对应的权限信息
   getAuthByIndex = (index)=>{
     for(let i=0;i<this.authList.length;i++){
        let item = this.authList[i];
        if(item.index==index){
          return item;
        }
        return null;
     }
   }

   Instance = ()=>{
      if(!this._instance){
        this._instance = new Authmanager()
      }
   }


}

