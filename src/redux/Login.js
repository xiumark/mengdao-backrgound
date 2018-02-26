// 登录成功的事件
export const loginSuccessCreator = (userName, responseJson) => {//通过handleSuccess传入的参数
  console.log("res:", responseJson);
  return {type: 'LOGIN_SUCCESS', payload: {userName : userName, responseJson : responseJson}};
};

const initState = {
  login: false,  // 是否已登录
  userName: '未登录', // 登录后的用户名
};


// function setCookie(key, value) {
//   let cookie = document.cookie;
//   if (getCookie(key)) {
//     return;
//   }
//   document.cookie = key + '=' + JSON.stringify(value) + '; path=/';
// }
// function getCookie(key) {
//   switch (key) {
//     case 'loginState':
//       return {'id':'Lx8ve8jEJLJddyp7fW2Ayv1NSQ', 'ttl':1209600, 'created':'2017-09-27T00:23:14.910Z', 'userId':1, 'role':'admin'};
//     }
// }


const reducer = (state = initState, action = {}) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // return {...state, login: true, userName: action.payload.userName};
      //存入cookie:loginstate值为1;
      document.cookie="loginState=1";
      return Object.assign({},...state, {login: true}, {userName:action.payload.userName});
    default:
      return state;
  }
};

export default {initState, reducer};
