# React后台管理系统

(react+antd+webpack+redux+react-router)

## 需求背景

* 侧边栏：上面是一个logo，下面是可展开的各级菜单。点击菜单项时，右边会展示相应的内容。
* Header：展示当前登录的用户名和面包屑导航，还可能有自定义的一些菜单之类
* 内容区：展示具体的内容，跟业务有关的
* Footer：展示copyright之类的
* 还有些看不到的，比如登录、注销等

## Quick Start

在自己的机器上调试：

1. 保证node版本5.3+，npm版本3.3+
2. clone下来后，`npm install`，安装必要的依赖
3. `npm run dev`，启动webpack-dev-server，打开浏览器`http://localhost:8000`查看效果。(debug模式下，不会请求后端接口，所有数据都是mock的，相关配置见[src/config.js](src/config.js))
4. 如果有必要的话可以把logLevel设置为debug（见[src/config.js](src/config.js)），会输出详细的debug日志，打开chrome的console就可以看到。

用在自己的项目中：

1. 保证node版本5.3+，npm版本3.3+
2. clone下来后，`npm install`，安装必要的依赖
3. 参考[src/menu.js](src/menu.js)，按自己的需要配置侧边栏和顶部菜单
4. 修改[src/index.js](src/index.js)中的路由表，保证和menu.js中的菜单项一致，否则可能404
5. 如果要用DBTable组件的话，参考[src/schema](src/schema)下的例子，编写自己的querySchema和dataSchema文件。在路由表中配置DBTable组件时，要把表名作为props传入，类似`<Route path="option1" tableName="test" component={DBTable}/>`。
6. 修改[src/config.js](src/config.js)中相关配置，比如项目名、footer、单点登录等等。
7. `npm run prod`，编译js文件，然后将dist目录下的所有js/css/html文件拷贝到自己的工程中，前端的工作就完成了。一般会有一个index.html，一个bundle.min.css，以及多个js文件，跟是否使用动态路由有关。
8. 开发后端接口......。
9. 启动你的web服务，访问`index.html`查看效果。

## 一些说明

### 安全/权限问题

目前对安全&权限都没考虑进去，如果有这方面的要求，只能后端校验了。在请求后端接口时校验用户的身份和权限。

权限问题也很麻烦，感觉不太好做成通用的东西，如果有需求的话，还是定制开发比较好。
 
### 兼容性

目前只能保证chrome中正常使用。。。话说在各种内部系统中，要求只能用chrome也挺常见吧。

### bundle size

单页应用的首屏渲染一直都是个大问题。webpack打包出来的bundle.js一般都很大，虽然我想了很多办法去优化，但总是还会有1M多，实在减不下去了。。。所以应用到外网时要小心，初次加载时可能比较慢。内网的话就无所谓了，一般网速都不是问题。
### webpack版本问题
本项目用的是webpack1版本，目前已经到webpack4了,在这个项目中相对于用的其他的技术栈版本，算是很旧了，感觉至少应该用webpack3才行，4的变化太大，做多的考虑，有时间在升级webpack吧。

