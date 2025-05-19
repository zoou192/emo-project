# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# 移动端应用

这是一个基于 Vue 3 开发的移动端应用，包含引导页、会话页和个人中心三个主要页面。

## 功能特点

- 引导页：首次使用时展示应用功能介绍
- 会话页：与AI助手进行对话
- 个人中心：查看个人信息和设置

## 技术栈

- Vue 3
- Vue Router
- CSS3

## 项目结构

```
src/
  ├── assets/         # 静态资源
  ├── components/     # 组件
  ├── router/         # 路由配置
  ├── views/          # 页面
  │   ├── Guide.vue   # 引导页
  │   ├── Chat.vue    # 会话页
  │   └── Profile.vue # 个人中心
  ├── App.vue         # 根组件
  └── main.js         # 入口文件
```

## 安装和运行

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产环境
npm run build
```

## 使用说明

1. 首次打开应用会显示引导页
2. 点击"开始使用"进入会话页
3. 通过底部导航栏可以在会话页和个人中心之间切换
4. 在个人中心可以查看个人信息和设置

## 后续开发计划

- 完善会话功能，接入实际的AI对话服务
- 添加用户注册和登录功能
- 优化UI和交互体验
- 添加更多个性化设置选项
