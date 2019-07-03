import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import globalConfig from 'config';
import ajax from '../../utils/ajax';
import Logger from '../../utils/Logger';
import { message } from 'antd';
import './index.less';
import { loginSuccessCreator } from '../../redux/Login.js';
import { setTimeout } from 'timers';

const logger = Logger.getLogger('Login');

/**
 * 定义Login组件
 */
class Login extends React.PureComponent {

  state = {
    userName:'', //'admin',                             // 当前输入的用户名
    password: '',//'a384b6463fc216a5f8ecb6670f86456a',  // 当前输入的密码
    command: 'login',                              // post 一起传入的参数
    requesting: false,                             // 当前是否正在请求服务端接口
    isPassWordIn: false,                           // 默认不填充password
  };




  handleUsernameInput = (e) => {
    this.setState({ userName: e.target.value });
  };

  handlePasswordInput = (e) => {
    // if(!this.state.isPassWordIn){
    //   this.setState({ password: '', isPassWordIn: true });
    // }else{
    //   this.setState({ password: e.target.value });
    // }
    this.setState({ password: e.target.value });
  };

  hide = () => {
    setTimeout(message.destroy(), 3000);
  }

  /**
   * 登陆请求回调处理
   * 会调用reducer中的loginSuccessCreator方法
  */
  handleAfterLogin = (json, param) => {
    let authList = json.data.auths&&json.data.auths.split(':');   //权限标识列表：1,2,3,4...23
    let state = json.state;

    if (state == "1") {// 登陆成功，设置locaStorage过期时间为两小时
      localStorage.expireTime=(new Date((new Date()).getTime()+2*3600*1000)).getTime();
      message.success('登录成功');
      this.hide();
      this.setState({ requesting: false, login: true });
      this.props.handleLoginSuccess(param.userName, authList); //传入redux 的值有；userName,authListArray
    } else {           // 登陆失败
      message.error(`登录失败: ${json.msg}, 请联系管理员`);
      this.hide();
      this.setState({ requesting: false });
    }
  }

  // 登陆请求出错处理
  handleAfterLoginFail = (param) => {
    message.error("登陆出错");
    logger.error('login error');
    this.hide();
    this.setState({ requesting: false });
  }

  /**
   * 请求登录
   */
  handleSubmit = (e) => {
    e.preventDefault();                    // 这个很重要, 防止跳转
    this.setState({ requesting: true });
    message.loading('正在验证...', 0);
    const userName = this.state.userName;
    const password = this.state.password;
    const command = this.state.command;
    logger.debug('userName = %s, password = %s, command = %s', userName, password, command);

    try {
      // 尝试登陆
      let param = {
        userName: userName,
        password: password,
        command: command
      };
      ajax.login(userName, password, command, this.handleAfterLogin, param, this.handleAfterLoginFail, param);
    } catch (exception) {
      message.error(`网络请求出错: ${exception.message}`);
      logger.error('login error, %o', exception);
      this.hide();
      this.setState({ requesting: false });
    }
  };

  render() {
    return (
      <div id="loginDIV">
        <div className="login">
          <h1>{globalConfig.name}</h1>
          <form onSubmit={this.handleSubmit}>
            <input className="login-input" type="text" value={this.state.userName}
              onChange={this.handleUsernameInput} placeholder="用户名" required="required" />
            <input className="login-input" type="password" value={this.state.password}
              onChange={this.handlePasswordInput} placeholder="密码" required="required" />
            <button className="btn btn-primary btn-block btn-large"
              type="submit" disabled={this.state.requesting}>
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.Login.login,
    userName: state.Login.userName,
    authList: state.Login.authList,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoginSuccess: bindActionCreators(loginSuccessCreator, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
