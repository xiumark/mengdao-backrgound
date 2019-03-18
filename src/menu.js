/**
 * 定义sidebar和header中的菜单项
 *
 * 一些约定:
 * 1.菜单最多3层;
 * 2.只有"叶子"节点才能跳转;
 * 3.所有的key都不能重复;
 */

// 定义siderbar菜单
const sidebarMenu = [
  {
    key: 'userManagement',  // route时url中的值
    name: '用户管理',  // 在菜单中显示的名称
    // icon: 'smile',  // 图标是可选的
    child: [
      {
        key: 'addUser',
        name: '用户管理',
        authIndex:'1',
        // icon: 'play-circle',   // 二级三级菜单也可以带图标
      },
      // {
      //   key: 'AuthManage',
      //   name: '权限管理',
      //   authIndex:'26',            //====26=====================================待更新
      // },
      {
        key: 'AuthGroupManage',
        name:'权限组管理',
        authIndex:'26',            //=========26================================待更新
      },
      {
        key: 'safety',
        name:'安全中心',            //修改密码（使用用户管理的权限）
        authIndex:'1',            
      },
      // {
      //   key: 'componentTest',
      //   name:'组件封装测试',            //创建一个通用组件的测试容器
      //   authIndex:'1',            
      // },
      // {
      //   key: 'getAuthList',
      //   name: '获取权限列表',
      // },
      // {
      //   key: 'editUser',
      //   name: '编辑用户',
      //   // icon: 'android',
      // },
      // {
      //   key: 'passwordReset',
      //   name: '重置密码',   //34
      //   // icon: 'bulb',
      // },
      // {
      //   key: 'thawAccount',
      //   name: '冻结解冻',
      //   // icon: 'bulb',
      // },
      // {
      //   key: 'deleteUser',
      //   name: '删除用户',
      //   // icon: 'bulb',
      // },
    ],
  },
  // {
  //   key: 'operationManagement',
  //   name: '运维管理',
  //   child: [
  //     {
  //       key: 'operator',
  //       name: '运营商管理',
  //       child: [
  //         {
  //           key: 'addOperator',
  //           name: '新增运营商',
  //           // icon: 'check',
  //         },
  //         {
  //           key: 'editOperator',
  //           name: '编辑运营商',
  //           // icon: 'close',
  //         }
  //       ]
  //     },
  //     {
  //       key: 'server',  // 最多只能到三级导航
  //       name: '服务器管理',
  //       // icon: 'laptop',
  //       child: [
  //         {
  //           key: 'addServer',
  //           name: '新增服务器',
  //           // icon: 'check',
  //         },
  //         {
  //           key: 'editServer',
  //           name: '编辑服务器',
  //           // icon: 'close',
  //         }
  //       ]
  //     },
  //   ],
  // },
  // {
  //   key: 'businessManagement',
  //   name: '运营管理',
  //   child: [
      {
        key: 'playerManagement',  // 最多只能到三级导航
        name: '玩家管理',
        child: [
          // {
          //   key: 'playerManagement',
          //   name: '玩家管理',
          // },
          {
            key: 'playerQuery',
            name: '玩家查询',
            authIndex:'5',
          },
          {
            key: 'wordsBlock',
            name: '禁言',
            authIndex:'6',
          },
          {
            key: 'banAndLift',
            name: '封禁角色',
            authIndex:'9',
          },
          {
            key: 'recharge',
            name: '补单',
            authIndex:'7',
          },
          {
            key: 'sendEmail',
            name: '发送邮件',
            authIndex:'11',
          },
          {
            key: 'sendSysDiamond',
            name: '发送元宝',
            authIndex:'11',
          },
          {
            key: 'sendTextEmail',
            name: '发送文字邮件',
            authIndex:'27',
          },
        ],
      },
      {
        key: 'gameManagement', 
        name: '游戏管理',
        child: [
          {
            key: 'announcementManagement',
            name: '发送公告',
            authIndex:'10',
          },
          {
            key: 'noticeManage',
            name: '公告管理',
            authIndex:'10',//---------------------------------------权限待完善--------//
          },
          {
            key: 'giftPackage',
            name: '礼包管理',
            authIndex:'4',
          },
          // {
          //   key: 'giftCode',
          //   name: '礼品码管理',
          // },
          {
            key: 'giftCreate',
            name: '创建礼品',
            authIndex:'14',
          },
          {
            key: 'expireTimeChange',
            name: '修改礼品过期时间',
            authIndex:'15',
          },
          {
            key: 'giftCard',
            name: '生成礼品码',
            authIndex:'16',
          },
          {
            key: 'activityManage',
            name: '活动管理',
            authIndex: '25',
          },
        ],
      },
      {
        key: 'serverManagement', 
        name: '游戏服管理',
        child: [
          {
            key: 'serverPageNotice',
            name: '选服页公告',    //服务器更新升级公告
            authIndex:'30',
          },
          {
            key: 'serverPageState',
            name: '游戏服',   //获取和修改游戏服状态
            authIndex:'28',
          },
          {
            key: 'serverPageWhiteList',
            name: '白名单',
            authIndex:'31',
          },
        ],
      },
      {
        key: 'gameReportForms',  // 最多只能到三级导航
        name: '游戏报表',
        child: [
          {
            key: 'payRankList',
            name: '充值排行',
            authIndex:'18',
          },
          {
            key: 'orderListInTime',
            name: '订单查询',
            authIndex:'19',
          },
          {
            key: 'onlineNumData',
            name: '在线人数',
            authIndex:'20',
          },
          {
            key: 'dayReport',
            name: '运营日报',
            authIndex:'21',
          },

          {
            key: 'stayReport',
            name: '留存统计',
            authIndex:'21',
          },
          {
            key: 'ltvReport',
            name: 'LTV统计',
            authIndex:'23',
          },
          {
            key: 'onlineTimeData',
            name: '在线时长',
            authIndex:'24',
          },
        ],
      },
  //   ],
  // },
];

export default sidebarMenu;

// 定义header菜单, 格式和sidebar是一样的
// 特殊的地方在于, 我规定header的最右侧必须是用户相关操作的菜单, 所以定义了一个特殊的key
// 另外注意这个菜单定义的顺序是从右向左的, 因为样式是float:right
export const headerMenu = [
  {
    // 一个特殊的key, 定义用户菜单, 在这个submenu下面设置icon/name不会生效
    key: 'userMenu',
    // child: [
    //   {
    //     key: 'createUser',
    //     name: '创建账户',

    //     // icon: 'bulb',
    //     // 对于headerMenu的菜单项, 可以让它跳到外部地址, 如果设置了url属性, 就会打开一个新窗口
    //     // 如果不设置url属性, 行为和sidebarMenu是一样的, 激活特定的组件, 注意在index.js中配置好路由, 否则会404
    //     // url: 'http://.me',
    //   },
    //   {
    //     key: 'modifyUser',
    //     name: '修改账户',
    //   },
    // ],
  },
]
