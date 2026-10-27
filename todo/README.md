# 我的待办清单

这是一个无需安装依赖的本地 Todo List 小应用。

直接双击 `index.html` 即可运行。计划会自动保存在当前浏览器的本地存储中，支持：

- 添加计划和结束时间
- 勾选完成 / 取消完成
- 编辑计划、删除计划
- 按全部、进行中、已完成筛选
- 自动显示完成进度和逾期提醒

## 在手机上使用

手机浏览器需要通过网址访问页面，不能直接访问电脑的 `localhost`。有两种简单方式：

1. **只在手机本地使用**：把这个文件夹部署到 GitHub Pages、Netlify 或 Vercel，然后用手机打开网址。数据会保存在手机当前浏览器的 `localStorage` 中；在浏览器菜单里选择“添加到主屏幕”后，就可以像 App 一样打开，离线也能使用。
2. **临时在同一 Wi-Fi 下测试**：在电脑项目目录运行 `python -m http.server 8765 --bind 0.0.0.0`，然后用手机访问 `http://电脑局域网IP:8765/`。电脑和手机必须连同一个 Wi-Fi，且 Windows 防火墙可能需要允许该端口。这种临时 HTTP 方式可以在手机浏览器中使用并保存在手机本地，但不支持安装到主屏幕或离线打开；这两项需要 HTTPS 网站。

当前保存方式是“每台设备各自保存一份”。如果希望电脑和手机看到同一份计划，需要再接入云端数据库和登录账号；那就不再是纯本地保存。

## 部署到 GitHub Pages

### 方法一：用 GitHub 网页上传（最简单）

1. 登录 [GitHub](https://github.com)，点击右上角 `+` → `New repository`。
2. 仓库名填写 `todo-list`，选择 `Public`，点击 `Create repository`。
3. 在新仓库页面点击 `Add file` → `Upload files`。
4. 把本项目中的以下 6 个文件拖进去：
   `index.html`、`style.css`、`app.js`、`manifest.json`、`sw.js`、`icon.svg`。
5. 点击 `Commit changes`。
6. 打开仓库的 `Settings` → 左侧 `Pages`。
7. 在 `Build and deployment` 中选择 `Deploy from a branch`，分支选择 `main`，目录选择 `/ (root)`，点击 `Save`。
8. 等待一两分钟，GitHub 会显示网址，格式通常是：
   `https://你的用户名.github.io/todo-list/`

### 方法二：用命令行上传

在本项目目录打开 PowerShell，把 `你的用户名` 和仓库地址替换成自己的：

```powershell
git init
git add index.html style.css app.js manifest.json sw.js icon.svg README.md
git commit -m "创建待办清单"
git branch -M main
git remote add origin https://github.com/你的用户名/todo-list.git
git push -u origin main
```

然后仍然到仓库的 `Settings` → `Pages`，选择 `main` 分支和 `/ (root)` 目录并保存。

### 手机端使用

1. 用手机浏览器打开 GitHub Pages 网址。
2. 先添加一条计划，确认可以正常保存。
3. 在浏览器菜单中选择“添加到主屏幕”或“安装应用”。
4. 以后从手机主屏幕打开即可；计划保存在手机这台设备的浏览器本地，断网时也可以使用。

注意：清除浏览器网站数据会删除手机上的计划。GitHub Pages 只负责发布网页，不会把电脑和手机的计划自动合并同步。
