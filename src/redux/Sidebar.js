/**
 * 一些约定:
 * 1. redux相关的action/reducer都放到redux文件夹中, 每个组件一个文件, 文件名和组件名相同
 * 2. 在这个文件中, 要先定义action creator, 再定义组件的initState, 最后定义reducer
 * 3. 所有action creator function的名称都是XXXCreator, 采用camelCase风格, e.g., "sidebarCollapseCreator"
 * 4. 一般而言, creator返回的action的type字段, 跟creator函数的名字是对应的, 全部大写, 下划线风格, e.g., "SIDEBAR_COLLAPSE"
 * 5. action的格式采用社区的规范: https://github.com/acdlite/flux-standard-action
 * 6. 每个组件只有一个reducer
 */



/* 定义action creator */
export const sidebarCollapseCreator = () => ({type: 'SIDEBAR_COLLAPSE'})

/* 定义初始状态, 每个组件只需要关心自己的状态 */
const initState = {
  collapse: false,  // 是否折叠
};

/* 定义reducer, 每个组件只有一个reducer */
const reducer = (state = initState, action = {}) => {
  switch (action.type) {
    case 'SIDEBAR_COLLAPSE':
      return {...state, collapse: !state.collapse};
    default: // 注意必须要有default语句
      return state;
  }
};

/* 导出的字段名称固定, 方便后续的store去处理 */
export default {initState, reducer};
