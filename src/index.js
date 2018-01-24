/**
 * 程序的入口, 类似java中的main
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute, browserHistory,hashHistory} from 'react-router';
import './utils/index.js';  // 引入各种prototype辅助方法
import store from 'redux/store.js';  // redux store

// 开始引入各种自定义的组件
import App from './components/App';
import Welcome from './components/Welcome';
import Error from './components/Error';
import Hello from './components/Hello';
import AddUser from './components/User/AddUser';
import EditUser from './components/User/EditUser';
import PasswordReset from './components/User/PasswordReset';
import ThawAccount from './components/User/ThawAccount';
import DeleteUser from './components/User/DeleteUser';
import PlayerManagement from './components/Player/PlayerManagement';
import GiftPackage from './components/Gift/GiftPackage';
import GiftCode from './components/Gift/GiftCode';
//import DBTable from './components/DBTable';

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
// 路由表, 只要menu.js中所有的叶子节点配置了路由就可以了
// 我本来想根据menu.js自动生成路由表, 但那样太不灵活了, 还是自己配置好些
const routes = (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Welcome}/>

        <Route path="userManagement">
          <Route path="addUser" component={AddUser}/>
          <Route path="editUser" component={EditUser}/>
          <Route path="passwordReset" component={PasswordReset}/>
          <Route path="thawAccount" component={ThawAccount}/>
          <Route path="deleteUser" component={DeleteUser}/>
          {/* <Route path="passwordReset" tableName="testAction" getComponent={DBTableContainer}/>
          <Route path="unfreeze" tableName="testAction" getComponent={DBTableContainer}/>
          <Route path="deleteUser" tableName="testAction" getComponent={DBTableContainer}/> */}
        </Route>

        <Route path="operationManagement">
          <Route path="operator">
            <Route path="addOperator" component={Hello}/>
            <Route path="editOperator" component={Hello}/>
          </Route>
          <Route path="server">
            <Route path="addServer" component={Hello}/>
            <Route path="editServer" component={Hello}/>
          </Route>
        </Route>

        <Route path="businessManagement">
          <Route path="gameManagement">
            {/* <Route path="playerManagement" component={PlayerManagement}/> */}
            <Route path="playerManagement" getComponent={DBTableContainer}/>
            {/* <Route path="roleQuery" tableName="testAction" getComponent={DBTableContainer}/> */}
            <Route path="roleQuery" tableName="testAction" getComponent={RoleContainer}/>
            <Route path="wordsBlock" component={Hello}/>
            <Route path="announcementManagement" component={Hello}/>
            <Route path="serverAnnouncement" component={Hello}/>
            <Route path="recharge" component={Hello}/>
          </Route>
          <Route path="giftManagement">
            <Route path="gift" component={GiftPackage}/>
            <Route path="giftCode" component={GiftCode}/>
          </Route>
        </Route>

        {/* 账户管理 */}
        <Route path="userMenu">
          <Route path="createUser" component={Hello}/>
          <Route path="modifyUser" component={Hello}/>
        </Route>

        {/* <Route path="headerMenu5">
          <Route path="headerMenu5000000" component={Hello}/>
          <Route path="headerMenu51111">
            <Route path="headerMenu51111aa" component={Hello}/>
            <Route path="headerMenu51111bb" component={Hello}/>
          </Route>
          <Route path="headerMenu52222">
            <Route path="headerMenu52222aa" component={Hello}/>
            <Route path="headerMenu52222bb" component={Hello}/>
          </Route>
        </Route>

        <Route path="headerMenu4" component={Hello}/>
        <Route path="alone" component={Hello}/>
        <Route path="alone2" component={Hello}/> */}

        <Route path="*" component={Error}/>

      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(routes, document.getElementById('root'));
