import React from 'react';
import {Breadcrumb} from 'antd';
import sidebarMenu, {headerMenu} from 'menu.js';
import Logger from '../../utils/Logger';
import './index.less';

const Item = Breadcrumb.Item;
const logger = Logger.getLogger('Breadcrumb');

/**
 * 定义面包屑导航
 */
class Bread extends React.PureComponent {

  /**
   * static inited = false;  // 表示下面两个map是否初始化
   * static iconMap = new Map();  // 暂存menu.js中key->icon的对应关系
   * static nameMap = new Map();  // 暂存menu.js中key->name的对应关系
   */
  componentWillMount() {
    const iconMap = new Map();
    const nameMap = new Map();

    //递归遍历, 本质是dfs
    const browseMenu = (item) => {
      nameMap.set(item.key, item.name);
      logger.debug('nameMap add entry: key=%s, value=%s', item.key, item.name);
      iconMap.set(item.key, item.icon);
      logger.debug('iconMap add entry: key=%s, value=%s', item.key, item.icon);
      if (item.child) {
        item.child.forEach(browseMenu);
      }
    };
    sidebarMenu.forEach(browseMenu);
    headerMenu.forEach(browseMenu);

    this.iconMap = iconMap;
    this.nameMap = nameMap;
  }

  render() {
    const itemArray = [];
    itemArray.push(<Item key="systemHome" href="#">首页</Item>);
    for (const route of this.props.routes) {// this.props.routes是react-router传进来的
      logger.debug('path=%s, route=%o', route.path, route);
      const name = this.nameMap.get(route.path);
      if (name) {
        const icon = this.iconMap.get(route.path);
        if (icon) {
          // itemArray.push(<Item key={name}><Icon type={icon}/> {name}</Item>);  // 有图标的话带上图标
          itemArray.push(<Item key={name}>{name}</Item>);
        } else {
          // 这个key属性不是antd需要的, 只是react要求同一个array中各个元素要是不同的, 否则有warning
          itemArray.push(<Item key={name}>{name}</Item>);
        }
      }
    }

    // 这个面包屑是不可点击的(除了第一级的home图标), 只是给用户一个提示
    return (
      <div className="ant-layout-breadcrumb">
        <Breadcrumb>{itemArray}</Breadcrumb>
      </div>
    );
  }
}

export default Bread;
