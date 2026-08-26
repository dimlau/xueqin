# 公孙雅博客 (Gongsun Ya's Blog)

> 甄仁岛市长公孙雅的个人文存与岛民共创专栏。基于 Astro 5 构建，专为部署至 Cloudflare Pages 设计。

---

## 快速开始 (本地开发)

```bash
cd frontend/gongsunya-blog
pnpm install # 或 npm install
pnpm dev     # 或 npm run dev
```

本地预览地址：`http://localhost:4321`

---

## 部署到 Cloudflare Pages

### 方式一：GitHub 仓库自动部署（推荐）
1. 将 `frontend/gongsunya-blog` 作为独立仓库推送到 GitHub（例如 `your-username/gongsunya-blog`）；
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Compute (Workers & Pages)** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**；
3. 选择该仓库，配置构建设置：
   - **Framework preset**: `Astro`
   - **Build command**: `pnpm build` (或 `npm run build`)
   - **Build output directory**: `dist`
4. 点击 **Save and Deploy**，即可获得永久可用的 `*.pages.dev` 全球高速 CDN 域名，支持自定义域名与免费 SSL 证书。

### 方式二：Wrangler CLI 本地直传
```bash
pnpm build
npx wrangler pages deploy dist --project-name gongsunya-blog
```

---

## 目录结构

```
├── src/
│   ├── components/       # Astro 挂件组件 (如 IslandStatusBadge)
│   ├── content/
│   │   └── blog/         # EastWorld 自动生成的 Markdown 文章存放目录
│   ├── layouts/          # 典雅中文字体排版布局
│   ├── pages/            # 页面路由 (首页、岛民一日、关于)
│   └── content.config.ts # Astro 5 强类型 Content Collections 配置
├── astro.config.mjs
└── tailwind.config.mjs
```
