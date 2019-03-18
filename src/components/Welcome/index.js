import React from 'react';
import './index.less';

/**
 * 展示欢迎界面
 */
class Welcome extends React.PureComponent {

  render() {
    return (
      <div>
        <h1 className="welcome-text">
          <a target="_blank" href="http:www.baidu.com">敬请期待</a>
          <br />
        </h1>
      </div>
    );
  }
}

export default Welcome;
