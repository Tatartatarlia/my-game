# 部署到 GitHub Pages（让别人在线玩）

## 一键自动部署（推荐）

1. 在 GitHub 上新建仓库，把本项目 `push` 上去（默认分支名 `main` 或 `master` 均可）。
2. 打开仓库 **Settings → Pages**：
   - **Build and deployment → Source** 选 **GitHub Actions**（不要选 Branch）。
3. 推送代码后，在 **Actions** 里会看到 “Deploy to GitHub Pages”，等它变绿即部署成功。
4. 访问地址一般为：  
   `https://<你的用户名>.github.io/<仓库名>/`

> 若打开是空白页：确认仓库名与 `BASE_PATH` 一致（工作流里已自动用仓库名）；本地可用  
> `BASE_PATH=/你的仓库名/ npm run build` 再 `npx vite preview` 检查。

> **Actions 报错 “Dependencies lock file is not found”**：  
> 不要用 `cache: npm` 却没有 `package-lock.json`。当前工作流已改为 **pnpm** + `pnpm-lock.yaml`；若你只用 npm，可删掉 `cache` 行并保留 `npm install`。

## 本地模拟生产构建

```bash
set BASE_PATH=/你的仓库名/
npm run build
npx vite preview
```

（PowerShell 用 `$env:BASE_PATH="/你的仓库名/"; npm run build`）

## 其他方式

- **Netlify / Vercel**：连接 GitHub 仓库，构建命令 `npm run build`，输出目录 `dist`；若子路径部署，同样需设置与 Vite `base` 一致的路径环境变量。
