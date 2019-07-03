// 登录成功
export const loginSuccessCreator = (userName, authList) => {
  return {type: 'LOGIN_SUCCESS', payload: {userName : userName, authList : authList}};
};

/**
 * 关于数据持久化问题
 * 目前现状是当页面强制刷新之后登录状态会变为false，导致重新进入登录页面，解决办法就是记录一个有时效的缓存，根据缓存来更改initState中的登录状态（另外有一种是使用持久化redux-persist，不过没有验证）
 */

/**
 * 会存放入store
 */
const initState = {
  login:  false,         // 是否已登录
  userName: '未登录',    // 登录后的用户名
  authList: [1,2,3],     //权限列表
};

const reducer = (state = initState, action = {}) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      document.cookie="loginState=1";
      return Object.assign({},...state, {login: true},
         {userName: action.payload.userName}, {authList: action.payload.authList});
    default:
      return state;
  }
};

export default {initState, reducer};
