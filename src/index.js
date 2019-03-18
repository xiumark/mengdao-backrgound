/**
 * 程序的入口, 类似java中的main
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import './utils/index.js';  // 引入各种prototype辅助方法
import store from 'redux/store.js';

// import '../public/md5'   //引入root中未能引入的文件的第二种解决方案，js程序的入口引入
import App from './components/App';
import Welcome from './components/Welcome';
import Error from './components/Error';
import Hello from './components/Hello';
import AddUser from './components/User/AddUser';
import EditUser from './components/User/EditUser';
import PasswordReset from './components/User/PasswordReset';
import ThawAccount from './components/User/ThawAccount';
import DeleteUser from './components/User/DeleteUser';
// import PlayerManagement from './components/Player/PlayerManagement';
import PlayerQuery from './components/Player/PlayerQuery';
import WordsBlock from './components/Player/WordsBlock';
import BanAndLift from './components/Player/BanAndLift';
import Recharge from './components/Player/Recharge';
import GiftPackage from './components/Gift/GiftPackage';
import GiftCode from './components/Gift/GiftCode';
import GiftCard from './components/Gift/GiftCard';
import GiftCreate from './components/Gift/GiftCreate';
import ExpireTimeChange from './components/Gift/ExpireTimeChange';
import SendEmail from './components/Player/SendEmail';
import Announcements from './components/AnnouncementManagement/Announcements';

import OrderListInTime from './components/GameReportForms/OrderListInTime';
import PayRankList from './components/GameReportForms/PayRankList';
import DayReport from './components/GameReportForms/DayReport';
import OnlineNumData from './components/OnlineNumData';
import StayReport from './components/GameReportForms/StayReport';
import LtvReport from './components/GameReportForms/LtvReport';
import OnlineTimeData from './components/GameReportForms/OnlineTimeData';

import ActivityManage from './components/Gift/ActivityManage';

import AuthManage from './components/User/AuthManage';          //权限管理
import AuthGroupManage from './components/User/AuthGroupManage';//权限组管理
import Safety from './components/User/Safety';//权限组管理
import NoticeManage from './components/Gift/NoticeManage';      //公告管理
import SendTextEmail from './components/Player/SendTextEmail';      //发送文字邮件
import SendSysDiamond from './components/Player/SendSysDiamond';      //发送元宝


import ServerPageNotice from './components/ServerManagement/ServerPageNotice';     
import ServerPageState from './components/ServerManagement/ServerPageState';     
import ServerPageWhiteList from './components/ServerManagement/ServerPageWhiteList';

import ComponentTest from './components/User/ComponentTest';//通用组件的测试

// 将DBTable组件做成动态路由, 减小bundle size
// 注意不要再import DBTable了, 不然就没意义了
// 一些比较大/不常用的组件, 都可以考虑做成动态路由
const DBTableContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/DBTable').default)
  }, 'DBTable');
};

const RoleContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/Role/RoleContainer').default)
  }, 'RoleContainer');
};
const routes = (
  <Provider store={store}>
    <Router history={hashHistory}>
      {/* <Route path="/logout" component={App}/> */}
      <Route path="/" component={App}>
        <Route path="userManagement">
          <Route path="addUser" component={AddUser} />
          <Route path="authManage" component={AuthManage} />
          <Route path="authGroupManage" component={AuthGroupManage} />
          <Route path="safety" component={Safety} />
          <Route path="componentTest" component={ComponentTest} />
          
          {/* <Route path="editUser" component={EditUser} /> */}
          {/* <Route path="passwordReset" component={PasswordReset} /> */}
          {/* <Route path="thawAccount" component={ThawAccount} /> */}
          {/* <Route path="deleteUser" component={DeleteUser} /> */}
        </Route>
        {/* <Route path="operationManagement">
          <Route path="operator">
            <Route path="addOperator" component={Hello}/>
            <Route path="editOperator" component={Hello}/>
          </Route>
          <Route path="server">
            <Route path="addServer" component={Hello}/>
            <Route path="editServer" component={Hello}/>
          </Route>
        </Route> */}
        {/* <Route path="businessManagement"> */}
        <Route path="playerManagement">
          {/* <Route path="playerQuery" tableName="testAction" getComponent={RoleContainer}/> */}
          <Route path="playerQuery" component={PlayerQuery} />
          <Route path="wordsBlock" component={WordsBlock} />
          <Route path="banAndLift" component={BanAndLift} />
          <Route path="recharge" component={Recharge} />
          <Route path="sendEmail" component={SendEmail} />
          <Route path="sendSysDiamond" component={SendSysDiamond} />
          <Route path="sendTextEmail" component={SendTextEmail} />
        </Route>
        <Route path="gameManagement">
          <Route path="announcementManagement" component={Announcements} />{/* 发送公告 */}
          <Route path="noticeManage" component={NoticeManage} />{/* 管理公告 */}
          <Route path="giftPackage" component={GiftPackage} />
          <Route path="giftCode" component={GiftCode} />
          <Route path="giftCard" component={GiftCard} />
          {/* <Route path="giftCard" component={GiftCard} /> */}
          <Route path="giftCreate" component={GiftCreate} />
          <Route path="activityManage" component={ActivityManage} />
          <Route path="expireTimeChange" component={ExpireTimeChange} />
        </Route>
        <Route path="serverManagement">
          <Route path="serverPageNotice" component={ServerPageNotice} />
          <Route path="serverPageState" component={ServerPageState} />
          <Route path="serverPageWhiteList" component={ServerPageWhiteList} />
        </Route>
        <Route path="gameReportForms">
          <Route path="orderListInTime" component={OrderListInTime} />
          <Route path="payRankList" component={PayRankList} />
          <Route path="dayReport" component={DayReport} />
          <Route path="onlineNumData" component={OnlineNumData} />
          <Route path="stayReport" component={StayReport} />
          <Route path="ltvReport" component={LtvReport} />
          <Route path="onlineTimeData" component={OnlineTimeData} />
        </Route>
        {/* </Route> */}
        {/* <Route path="userMenu">
          <Route path="createUser" component={Hello}/>
          <Route path="modifyUser" component={Hello}/>
        </Route> */}
        <Route path="*" component={Error} />
      </Route>
      <Route path="logout" component={Hello} />
    </Router>
  </Provider>
);

ReactDOM.render(routes, document.getElementById('root'));
