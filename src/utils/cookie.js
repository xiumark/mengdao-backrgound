// /**
//  * 设置cookie
//  * @param key
//  * @param value
//  */
// export function setCookie(key, value) {
//       let cookie = document.cookie;
//       if (getCookie(key)) {
//         return;
//       }
//       document.cookie = key + '=' + JSON.stringify(value) + '; path=/';
//   }
//   export function getCookie(key) {
//     switch (key) {
//     case 'loginState':
//       return {'id':'Lx8ve8jEJLJddyp7fW2Ayv1NSQ', 'ttl':1209600, 'created':'2017-09-27T00:23:14.910Z', 'userId':1, 'role':'admin'};
//     }
//   }
  
//   export function deleteCookie(key) {
//     try {
//       document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
//     } catch (err) {
//       console.log('删cookie错误:' + key);
//     }
//   }
  