import React from 'react';
import {connect, connectAdvanced} from 'react-redux'
import {bindActionCreators} from 'redux'
import globalConfig from 'config';
import ajax from '../../utils/ajax';
import Logger from '../../utils/Logger';
import {message} from 'antd';
import './index.less';
import {loginSuccessCreator} from '../../redux/Login.js';
import { setTimeout } from 'timers';

const logger = Logger.getLogger('Login');

/**
 * 定义Login组件
 */
class Login extends React.PureComponent {

  // 这个login样式是直接从网上找的: https://colorlib.com/wp/html5-and-css3-login-forms/
  // 一般而言公司内部都会提供基于LDAP的统一登录, 用到这个登录组件的场景应该挺少的

  // state = {
  //   userName: 'h1',  // 当前输入的用户名
  //   password: '123',  // 当前输入的密码
  //   requesting: false, // 当前是否正在请求服务端接口
  // };
  state = {
    userName: 'admin',  // 当前输入的用户名
    password: 'a384b6463fc216a5f8ecb6670f86456a',  // 当前输入的密码
    command: 'login', // post 一起传入的参数
    requesting: false, // 当前是否正在请求服务端接口
  };

  // controlled components

  handleUsernameInput = (e) => {
    this.setState({userName: e.target.value});
  };

  handlePasswordInput = (e) => {
    this.setState({password: e.target.value});
  };

  hide = () => {
    setTimeout(message.destroy(),3000);
  }

  // 登陆请求回调处理
  handleAfterLogin = (json, param) => {
    console.log("handleAfterLogin", json);
    let {login} = this.props;
    let state = json.state;
    let requesting = this.state.requesting;

    if (state == "1") {
      // 登陆成功
      message.success('登录成功');
      this.hide();
      this.setState({requesting: false, login: true },()=>{
      console.log("login:", this.state.login);
    });

      console.log("千呼万唤的cookie:", document.cookie);

      this.props.handleLoginSuccess(param.userName, json); //传入redux 的值有；userName,responseJson
    } else {
      // 登陆失败
      message.error(`登录失败: ${json.msg}, 请联系管理员`);
      this.hide();
      this.setState({requesting: false});
    }
  }

  // 登陆请求出错处理
  handleAfterLoginFail = (param) => {
    console.log("handleAfterLoginFail", param);
    message.error("登陆出错");
    logger.error('login error');
    this.hide();
      this.setState({requesting: false});
  }

  /**
   * 处理表单的submit事件
   *
   * @param e
   */
  handleSubmit = (e) => {  // async可以配合箭头函数
    e.preventDefault();  // 这个很重要, 防止跳转
    this.setState({requesting: true});

    // 显示正在验证文字,且在请求回来之前,一直显示
    message.loading('正在验证...', 0);
    const userName = this.state.userName;
    const password = this.state.password;
    const command = this.state.command;
    logger.debug('userName = %s, password = %s, command = %s', userName, password, command);

    try {
      // 尝试登陆
      let param = {
        userName : userName, 
        password : password, 
        command : command
      };
      ajax.login(userName, password, command, this.handleAfterLogin, param, this.handleAfterLoginFail, param);
    } catch (exception) {
      message.error(`网络请求出错: ${exception.message}`);
      logger.error('login error, %o', exception);
      this.hide();
      this.setState({requesting: false});
    }
  };

  render() {
    // 整个组件被一个id="loginDIV"的div包围, 样式都设置到这个div中
    return (
      <div id="loginDIV">

        {/*debug模式下显示fork me on github*/}
        {globalConfig.debug &&
        <a href="https://github.com/jiangxy/react-antd-admin">
          {/* <img style={{position: 'absolute', top: 0, right: 0, border: 0}}
               src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67"
               alt="Fork me on GitHub"
               data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"/> */}
        </a>}

        <div className="login">
          <h1>{globalConfig.name}</h1>
          <form onSubmit={this.handleSubmit}>
            <input className="login-input" type="text" value={this.state.userName}
                   onChange={this.handleUsernameInput} placeholder="用户名" required="required"/>
            <input className="login-input" type="password" value={this.state.password}
                   onChange={this.handlePasswordInput} placeholder="密码" required="required"/>
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
    userName: state.Login.login
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoginSuccess: bindActionCreators(loginSuccessCreator, dispatch),
  };
};

// 不需要从state中获取什么, 所以传一个null
export default connect(mapStateToProps, mapDispatchToProps)(Login);
