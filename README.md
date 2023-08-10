<p>
<strong><h2>Snavigation</h2></strong>
一个简约的起始页
</p>

![Snavigation.png](https://s2.loli.net/2022/07/15/FE6U2BJCynHDep8.jpg)

> 重构中，尚未完成

### Demo

> 由于 `CDN` 缓存原因，查看最新效果可能需要 `Ctrl` + `F5` 强制刷新浏览器缓存

- [Snavigation](https://nav.imsyy.top)
- [Snavigation Dev](https://snavigation-git-dev-imsyy.vercel.app/)

### 功能

- [x] 载入动画
- [x] 时间及天气显示
- [x] 快捷方式自定义
- [x] 网站背景自定义
- [x] 数据备份及恢复
- [x] 移动端适配
- [x] 切换搜索引擎
- [x] 设置
- [x] 备份

* [ ] 一言
* [ ] 书签
* [ ] 备忘

### 配置

修改项目的部分默认设置可前往根目录下的 `.env` 文件中修改

### 部署

- **安装** [node.js](https://nodejs.org/zh-cn/) **环境**

  > node > 16.16.0  
  > npm > 8.15.0

- 然后以 **管理员权限** 运行 `cmd` 终端，并 `cd` 到 项目根目录
- 在 `终端` 中输入：

  ```bash
  # 安装 pnpm
  npm install -g pnpm

  # 安装依赖
  pnpm install

  # 开发
  pnpm dev

  # 构建
  pnpm build
  ```

  > 构建完成后，静态资源会在 **`dist` 目录** 中生成，可将 **`dist` 文件夹下的文件**上传至服务器，
  > 也可使用 [Vercel](https://vercel.com/) 或 [Cloudflare Pages](https://pages.cloudflare.com/) 等托管平台一键自动部署

### 技术栈

- [Vue](https://cn.vuejs.org/)
- [Vite](https://vitejs.cn/vite3-cn/)
- [Pinia](https://pinia.vuejs.org/zh/)
- [iconfont](https://www.iconfont.cn/)

### API

- [小歪 API](https://api.ixiaowai.cn/)
- [缙哥哥 API](https://www.dujin.org/3618.html)
- [Hitokoto 一言](https://hitokoto.cn/)

### 鸣谢

本站部分样式及功能参考自

- [青柠起始页](https://limestart.cn/)

<a title="SSL" target="_blank" href="https://myssl.com/seal/detail?domain=blog.imsyy.top"><img src="https://img.shields.io/badge/MySSL-安全认证-brightgreen"></a>&nbsp;<a title="CDN" target="_blank" href="https://cdnjs.com/"><img src="https://img.shields.io/badge/CDN-Cloudflare-blue"></a>&nbsp;<a title="Copyright" target="_blank" href="https://imsyy.top/"><img src="https://img.shields.io/badge/Copyright%20%C2%A9%202020--2023-%E7%84%A1%E5%90%8D-red"></a>
