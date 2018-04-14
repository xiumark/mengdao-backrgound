/**
 * 定义sidebar和header中的菜单项
 *
 * 一些约定:
 * 1.菜单最多3层;
 * 2.只有"叶子"节点才能跳转;
 * 3.所有的key都不能重复;
 */

// 其实理论上可以嵌套更多层菜单的, 但是我觉得超过3层就不好看了
// 可用的图标见这里: https://ant.design/components/icon-cn/

// 定义siderbar菜单
const sidebarMenu = [
  {
    key: 'userManagement',  // route时url中的值
    name: '用户管理',  // 在菜单中显示的名称
    // icon: 'smile',  // 图标是可选的
    child: [
      {
        key: 'addUser',
        name: '新增用户',
        // icon: 'play-circle',   // 二级三级菜单也可以带图标
      },
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
      //   name: '重置密码',
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
          },
          {
            key: 'wordsBlock',
            name: '禁言',
          },
          {
            key: 'banAndLift',
            name: '封禁角色',
          },
          {
            key: 'recharge',
            name: '补单',
          },
          {
            key: 'email',
            name: '发送邮件',
          },
        ],
      },
      {
        key: 'gameManagement',  // 最多只能到三级导航
        name: '游戏管理',
        child: [
          {
            key: 'announcementManagement',
            name: '公告管理',
          },
          {
            key: 'gift',
            name: '礼包管理',
          },
          // {
          //   key: 'giftCode',
          //   name: '礼品码管理',
          // },
          {
            key: 'giftCreate',
            name: '创建礼品',
          },
          {
            key: 'giftCard',
            name: '创建礼品卡',
          },

          // {
          //   key: 'serverAnnouncement',
          //   name: '新服公告',
          // },
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
