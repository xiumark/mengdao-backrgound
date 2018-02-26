import Logger from './Logger';
import superagent from 'superagent';
import globalConfig from '../config';

const logger = new Logger('Ajax');

/**
 * 封装所有ajax逻辑, 为了配合async/await, 所有ajax请求都要返回promise对象
 */
class Ajax {

  // Ajax工具类提供的方法可以分为2种:
  // 1. 基础的get/post方法, 这些是通用的
  // 2. 在get/post基础上包装的业务方法, 比如getCurrentUser, 这些方法是有业务含义的

  // 作为缓存
  tableCache = new Map();

  /**
   * 生成POST字符串
   */
  generatePostParam(data) {
    let rtn = "";
    for (var key in data) {
      if (rtn != "") {
        rtn = rtn + "&";
      }
      rtn = rtn + key + "=" + data[key];
    }
    return rtn;
  }

  /**
   * 内部方法, 在superagent api的基础上, 包装一些全局的设置
   *
   * @param method 要请求的方法
   * @param url 要请求的url
   * @param params GET参数
   * @param data POST参数
   * @param headers 额外设置的http header
   * @param responseCall 响应回调函数
   * @param responseParam 响应回调参数
   * @param errorCall 错误回调函数
   * @param errorParam 错误回调参数
   * @returns {Promise}
   */
  requestWrapper(method, url, {params, data, headers} = {}, responseCall, responseParam, errorCall, errorParam) {
    // 记录请求日志
    logger.debug('method=%s, url=%s, params=%o, data=%o, headers=%o', method, url, params, data, headers);
    
    // 请求属性
    headers = Object.assign({}, headers, {'Content-Type' : 'application/json', 'Accept' : 'application/json'});
    let option = {
      credentials: 'include',
      headers: headers, // 请求头
      method: method,   // 请求方式
    };
    if (method == "POST" || method == "post") {
      // POST请求时,填充body(POST参数)
      option = Object.assign({}, option, {body: this.generatePostParam(data)}); // 请求POST参数
    }
    
    // 进行请求
    let promise = new Promise((resolve, reject)=>{
        fetch(url, option)
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            // 正常返回 200 OK
            console.log("response:", response);
            return response.json();
          } else if (response.status >= 500 && response.status < 600) {
            // 其他状态码
            return null;
          }
        })
        .then((json) => {
          if (json != null) {
            // 获取到了json数据
            console.log("返回的json:", json, ",responseParam:", responseParam);
            responseCall && responseCall.apply(null, [json, responseParam]);
          } else {
            // 错误处理
            errorCall && errorCall.apply(null, [errorParam]);
          }
        });
    });
    return promise;
  }

  // 发送get请求
  get(url, opts = {}, responseCall, responseParam, errorCall, errorParam) {
    return this.requestWrapper('GET', url, {...opts}, responseCall, responseParam, errorCall, errorParam);
  }

  // 发送post请求
  post(url, data, opts = {}, responseCall, responseParam, errorCall, errorParam) {
    return this.requestWrapper('POST', url, {...opts, data}, responseCall, responseParam, errorCall, errorParam);
  }

  // 业务方法

  /**
   * 获取当前登录的用户
   *
   * @returns {*}
   */
  getCurrentUser() {
    return this.get(`${globalConfig.getAPIPath()}${globalConfig.login.getCurrentUser}`);
  }

  /**
   * 用户登录
   *
   * @param userName
   * @param password
   * @param command
   * @param callback
   * @param param
   * @param errorCall
   * @param errorParam
   */
  // login(userName, password) {
  login(userName, password, command, callback, param, errorCall, errorParam) {
    let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    this.post(`${globalConfig.getAPIPath()}` + 
                                `${globalConfig.login.validate}` +
                                `?command=${command}&userName=${userName}&password=${password}`,
                              {command : command, userName : userName, password : password}, 
                              {headers},
                              callback,
                              param,
                              errorCall,
                              errorParam);
  }

  /**
   *  封装CRUD相关操作
   *
   * @param tableName 要操作的表名
   * @returns {*}
   */
  CRUD(tableName) {
    if (this.tableCache.has(tableName)) {
      return this.tableCache.get(tableName);
    }

    const util = new CRUDUtil(tableName);
    util.ajax = this;
    this.tableCache.set(tableName, util);
    return util;
  }
}

/**
 * 封装CRUD相关操作, 有点内部类的感觉
 */
class CRUDUtil {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * 查询某个表
   *
   * @param queryObj 查询条件封装为一个对象
   * @returns {*}
   */
  select(queryObj) {
    return this.ajax.post(`${globalConfig.getAPIPath()}/${this.tableName}/select`, queryObj);
  }

  /**
   * 给某个表新增一条数据
   *
   * @param dataObj 要新增的数据
   * @returns {*}
   */
  insert(dataObj) {
    return this.ajax.post(`${globalConfig.getAPIPath()}/${this.tableName}/insert`, dataObj);
  }

  /**
   * 更新某个表的数据, 可以批量, 也可以单条
   *
   * @param keys 要更新的记录的主键
   * @param dataObj 要更新哪些字段
   * @returns {*}
   */
  update(keys = [], dataObj) {
    const tmp = keys.join(',');
    return this.ajax.post(`${globalConfig.getAPIPath()}/${this.tableName}/update`, dataObj, {params: {keys: tmp}});
  }

  /**
   * 删除某个表的数据, 可以批量, 也可以单条
   *
   * @param keys 要删除的记录的主键
   * @returns {*}
   */
  delete(keys = []) {
    const tmp = keys.join(',');
    return this.ajax.get(`${globalConfig.getAPIPath()}/${this.tableName}/delete`, {params: {keys: tmp}});
  }

  /**
   * 从服务端获取某个表的schema, 会merge到本地的schema中
   *
   * @returns {*}
   */
  getRemoteSchema() {
    return this.ajax.get(`${globalConfig.getAPIPath()}/${this.tableName}/schema`);
  }
}

export default Ajax;