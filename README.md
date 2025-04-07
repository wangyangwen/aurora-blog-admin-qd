# Aurora 博客管理系统前端

这是 Aurora 博客管理系统的前端部分，基于 Vue.js 和 Element UI 构建，用于管理 Hexo 博客的文章和标签。

## 功能特点

- 用户认证系统（登录、注册）
- 文章管理（创建、编辑、删除、预览）
- 标签管理（创建、删除）
- Markdown 编辑器与实时预览
- 响应式设计，适配各种设备
- 深色/浅色主题支持

## 技术栈

- Vue.js 2.x
- Vuex 状态管理
- Vue Router 路由管理
- Element UI 组件库
- Axios HTTP 客户端
- Marked Markdown 解析器

## 安装与使用

### 前提条件

- Node.js (v12.0.0 或更高版本)
- npm 或 yarn
- Aurora 博客管理系统后端 API 服务

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发模式

```bash
# 使用 npm
npm run serve

# 或使用 yarn
yarn serve
```

### 生产构建

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build
```

## 配置

您可以在 `.env` 文件中配置后端 API 地址：

```
VUE_APP_API_URL=http://localhost:3000/api
```

## 目录结构

```
├── public/             # 静态资源
├── src/                # 源代码
│   ├── assets/         # 资源文件
│   ├── components/     # 组件
│   ├── router/         # 路由配置
│   ├── store/          # Vuex 状态管理
│   ├── views/          # 视图组件
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── .env                # 环境变量
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 与后端集成

此前端应用需要搭配 Aurora 博客管理系统后端 API 一起使用。请确保后端服务已启动，并配置正确的 API 地址。

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request 来改进此项目。