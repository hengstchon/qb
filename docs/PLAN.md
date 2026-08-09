# qBittorrent WebUI 续开发计划

最后更新：2026-08-09

## 目标与兼容范围

本计划的目标是先恢复项目的可开发、可验证状态，再完成 qBittorrent 5.x 兼容，最后升级前端工具链并开发新功能。

- 主要兼容目标：qBittorrent 4.4.5、qBittorrent 5.2.3。
- 尽力兼容目标：qBittorrent 4.3.9。
- WebAPI 目标：启动时读取 `/api/v2/app/webapiVersion`，不得仅根据应用版本猜测能力。
- 部署形式：保持纯静态 SPA，可作为 qBittorrent Alternate WebUI 部署。
- 升级原则：先恢复构建和测试，再处理 API 兼容，最后升级 React、Vite 和 Tailwind；不同类型的升级不混在一个变更中。

## P0：恢复可靠的开发基线

### 1. 固定运行时和包管理器

工作内容：

- 在 `package.json` 中声明 `packageManager` 和受支持的 Node.js 版本（使用最新的 node lts 版本即可）。
- 确定团队使用的 pnpm 主版本（使用最新的 pnpm 版本），并重新生成与之匹配的依赖安装结果。
- 增加 `lint`、`typecheck`、`test` 脚本；`build` 不隐式修改依赖或 lockfile。
- 确认 `.pnpm-store/`、构建输出、测试输出不会被提交。

验收标准：

- [ ] 全新 clone 后，仅执行文档规定的安装命令即可完成依赖安装。
- [ ] `pnpm install --frozen-lockfile` 成功且 `git status --short` 不产生变更。
- [ ] `pnpm run typecheck`、`pnpm run lint`、`pnpm run build` 均可独立运行。
- [ ] CI 与本机使用相同的 Node.js、pnpm 主版本。

### 2. 修复现有 TypeScript 构建错误

工作内容：

- 恢复 TanStack Table `ColumnMeta.className` 的合法 module augmentation。
- 将 `Row` 等仅作为类型使用的 import 改为 type-only import，消除命名冲突。
- 检查修复是否隐藏了其他被当前错误阻断的类型问题。

验收标准：

- [ ] `pnpm run typecheck` 零错误。
- [ ] `pnpm run build` 成功生成静态产物。
- [ ] torrent、file、peer、tracker 四张表均可打开，列宽、排序、选择和虚拟滚动无明显回归。

### 3. 建立最小自动化测试与 CI

工作内容：

- 引入 Vitest 和 React Testing Library。
- 为状态分类、格式化器、`sync/maindata` 增量合并添加单元测试。
- 使用 MSW 或等价方案保存 qBittorrent 4.x、5.x 的最小 API fixtures。
- 配置 CI 执行安装、lint、typecheck、test、build。

验收标准：

- [ ] 每个 pull request 自动运行所有质量检查。
- [ ] `maindata` 的 full update、partial update、removed 项目均有测试。
- [ ] `pausedDL/pausedUP` 和 `stoppedDL/stoppedUP` 的归一化均有测试。
- [ ] 任一检查失败时 CI 返回非零状态，且不会发布构建产物。

## P0：完成 qBittorrent 4.x / 5.x 核心兼容

### 4. 增加版本探测与 capability 层

工作内容：

- 登录后读取 `/app/version`、`/app/webapiVersion` 和必要时的 `/app/buildInfo`。
- 定义集中式 capability 对象，例如 `supportsStartStop`、`supportsClientData`、`supportsApiKey`、`supportsPieceAvailability`。
- UI 和业务逻辑只读取 capability，不在组件中散落版本字符串比较。
- 对未知的更新版本采用保守、可降级的默认行为。

验收标准：

- [ ] 4.4.5 与 5.2.3 登录后都能显示检测到的应用版本和 WebAPI 版本。
- [ ] 组件源码中不存在新的硬编码 `version.startsWith(...)` 分支。
- [ ] 版本探测失败时有明确错误提示，不进入半登录状态。
- [ ] capability 映射有单元测试覆盖已支持的两个主要版本。

### 5. 建立统一的 qB API client

工作内容：

- 将请求集中到 typed API client，统一 base URL、超时、取消、编码和错误转换。
- 区分 JSON、text、void/204、blob 响应。
- 所有 mutation 使用正确的 POST 和表单编码；查询参数通过 `URLSearchParams` 或等价安全方式生成。
- 定义统一错误类型，至少保留 HTTP status、endpoint、服务端消息和原始 cause。

验收标准：

- [ ] 用户名、密码、分类、标签含 `&`、`+`、空格及非 ASCII 字符时仍能正确传输。
- [ ] `200`、`202`、`204`、`400`、`401`、`403`、`404`、`405`、`409`、`415` 均有预期处理。
- [ ] mutation 不会尝试把 `204 No Content` 解析成 JSON。
- [ ] 组件不再直接拼接 API query string 或登录 form body。

### 6. 统一 torrent 状态、筛选和启停操作

工作内容：

- 定义严格的 `TorrentState` union/enum，替换当前的任意 `string`。
- 在 API 边界将 4.x 的 `pausedDL/pausedUP` 归一化为内部 stopped 状态。
- 4.x 使用 `pause/resume`，5.x 使用 `stop/start`。
- 4.x 的 `paused/resumed` 与 5.x 的 `stopped/running` 筛选通过 adapter 映射。
- 所有状态分组使用共享谓词，避免 sidebar、表格和操作栏各自维护一套规则。

验收标准：

- [ ] 在 4.4.5 和 5.2.3 中，停止、启动单个 torrent 和批量操作均成功。
- [ ] All、Downloading、Seeding、Completed、Running、Stopped、Active、Inactive、Stalled、Checking、Errored 分类结果正确。
- [ ] `stoppedDL` 和 `stoppedUP` 不会出现在 Running 分类。
- [ ] 未知状态显示为 Unknown，不导致列表或详情页崩溃。

### 7. 修复认证与安全配置

工作内容：

- 不再把 `isAuthed` 持久化到 localStorage，以服务器会话为准。
- 正确处理登录失败的 401、访问禁止的 403、会话过期和 IP ban。
- 开发代理正确处理 Host、Origin、Referer，使日常开发无需关闭 CSRF。
- 更新 README，删除“默认关闭 CSRF 和登录失败封禁”的做法。
- SID cookie 模式作为 Alternate WebUI 默认认证；API key/Basic Auth 作为独立部署的可选能力。

验收标准：

- [ ] 刷新页面后通过实际 API 请求恢复登录状态，而不是读取本地布尔值。
- [ ] 错误密码、会话过期、被 ban 分别显示可理解且不泄露敏感信息的提示。
- [ ] 在保持 qBittorrent CSRF、Host header validation 开启时，本地开发代理可以登录和调用 API。
- [ ] 日志、错误 UI、localStorage 中均不出现密码、SID 或 API key。

### 8. 更新 Add Torrent 流程

工作内容：

- WebAPI 2.11.3+ 不再向 `/torrents/add` 发送已移除的 `cookie` 字段。
- 兼容旧版 text 响应与新版结构化 add 响应，以及 `202`、`409`、`415`。
- 明确区分已添加、后台处理中、重复、全部失败和无效 torrent。
- 在关闭对话框或重复提交前提供确定的状态反馈。

验收标准：

- [ ] 4.4.5 和 5.2.3 均可通过 magnet URL 与 `.torrent` 文件添加任务。
- [ ] 文件名、URL、分类、标签包含特殊字符时添加成功。
- [ ] 重复 torrent、无效文件、部分成功、后台处理中都有正确 UI 反馈。
- [ ] 5.2.3 请求中不包含已移除的 `cookie` 字段。

### 9. 修正 5.x 响应类型差异

工作内容：

- peer 支持 `i2p_dest`，并允许 I2P peer 缺少 `ip`、`port`。
- category 的 `downloadPath` 接受 `null`。
- tracker 支持新状态 5/6、announce 时间和 endpoints。
- torrent、server state 类型补齐当前 UI 实际使用的新字段；未保证出现的字段标记为 optional。
- 对来自 API 的不可信数据在关键边界做轻量运行时校验。

验收标准：

- [ ] I2P peer 可显示且不会因缺少 IP 崩溃。
- [ ] 无 download path 的 category 可正常显示、编辑和删除。
- [ ] Tracker Error 与 Unreachable 有独立、正确的展示状态。
- [ ] fixtures 中删掉任一 optional 字段时页面不会崩溃。

## P1：提升同步可靠性和可维护性

### 10. 重构 `sync/maindata` 和 `sync/torrentPeers` 循环

工作内容：

- 使用专门的同步控制器管理 rid、定时、AbortController、重试和 full update。
- 页面隐藏时降低或暂停轮询，恢复时主动同步。
- 网络恢复、登录失效、rid 重置和组件卸载都有确定行为。
- SWR 保留给普通详情查询；增量同步不再依赖不断改变 SWR key 来驱动。

验收标准：

- [ ] 连续运行 30 分钟不产生重复 timer、重复请求或持续增长的监听器。
- [ ] 网络断开后使用有上限的退避重试，恢复后自动得到一致状态。
- [ ] tab 隐藏再恢复后，torrent 列表与 qB 服务端一致。
- [ ] 切换 torrent 详情时，旧 peer 请求会被取消且不会覆盖新 torrent 数据。

### 11. 明确本地 UI 状态与服务端状态边界

工作内容：

- Jotai 只管理 UI 状态和必要的增量快照。
- 不持久化认证状态、临时选择状态和服务端可重新获取的数据。
- 为 localStorage 数据增加 schema version 和迁移/重置机制。
- 5.2+ 可选使用 `clientdata/load/store` 同步列宽、列顺序、主题和刷新间隔。

验收标准：

- [ ] 清空 localStorage 后应用仍可完整工作。
- [ ] 旧 schema 或损坏 JSON 不会阻止应用启动。
- [ ] 同一 qB 实例在另一浏览器载入时可恢复允许共享的 UI 设置。
- [ ] 不同 qB 实例的 UI 设置不会意外相互覆盖。

### 12. 增加端到端兼容测试环境

工作内容：

- 为 qBittorrent 4.4.5、5.2.3 建立独立、固定 tag 的 Docker profiles。
- 使用独立配置和下载目录，测试数据可重复创建。
- 添加 Playwright 冒烟测试：登录、列表同步、筛选、添加、停止、启动、删除但保留文件。
- 禁止测试使用 `latest` 镜像标签。

验收标准：

- [ ] 一条文档化命令可启动任一版本测试环境。
- [ ] 两个版本均通过相同的核心 E2E 场景。
- [ ] 测试结束后不会在仓库中留下 torrent 数据、凭据或变化文件。
- [ ] 版本升级必须先更新 fixtures 并通过兼容测试。

## P2：升级前端技术栈

### 13. 更新 lint、format 和测试工具链

工作内容：

- 迁移到 ESLint flat config，再升级 ESLint、typescript-eslint 和 React plugins。
- 保持 Prettier 与 Tailwind import/class sorting 兼容。
- 清理不再需要的临时规则和注释。

验收标准：

- [ ] 仓库中不再依赖 `.eslintrc.*`。
- [ ] `pnpm run lint` 覆盖所有 TS/TSX 文件且零 warning。
- [ ] 编辑器和 CLI 使用同一配置，保存格式化不会与 CI 打架。

### 14. 升级 React、Vite 和 TypeScript

工作内容：

- 先更新 TypeScript 和类型包，再分 major 升级 Vite，最后升级 React 19。
- 核对 `@vitejs/plugin-react-swc`、Radix、Jotai、SWR、Virtua、TanStack Table 的 peer dependencies。
- 根据 React 19 行为修复 effect、ref 和 StrictMode 下暴露的问题。
- 每一个 major 升级单独提交，便于回退和定位回归。

验收标准：

- [ ] 使用目标 Node LTS 完成 dev、test、build 和 preview。
- [ ] React StrictMode 下不产生重复 mutation、timer 或同步循环。
- [ ] 生产构建可作为 qB Alternate WebUI 加载，静态资源路径正确。
- [ ] E2E 在 4.4.5 与 5.2.3 上全部通过。

### 15. 单独迁移 Tailwind CSS 4

工作内容：

- 使用 Tailwind 一方 Vite plugin。
- 将 JS/CJS 配置迁移到 CSS-first theme，保留现有 CSS variables 和暗色主题。
- 核对 Radix data-state、动画、动态 class 和虚拟列表样式。
- 删除不再需要的 PostCSS、Autoprefixer 或动画依赖。

验收标准：

- [ ] light、dark、system 三种主题与迁移前视觉一致。
- [ ] Dialog、Popover、Dropdown、Context Menu、Tooltip 的位置和动画正常。
- [ ] production CSS 中包含所有运行时需要的 class，且没有因自动扫描丢失样式。
- [ ] Chrome、Firefox、Safari 当前稳定版完成桌面与窄屏视觉检查。

### 16. 清理和收敛依赖

工作内容：

- 删除未使用依赖和重复能力。
- 评估用 typed fetch 替换 Wretch；若保留，记录原因。
- 保留 Virtua 与 TanStack Table 的明确分工，避免同时引入第二套虚拟化方案。
- 检查 bundle 构成并处理明显的大依赖或重复模块。

验收标准：

- [ ] 每个 production dependency 在源码或构建配置中都有实际用途。
- [ ] `pnpm install --frozen-lockfile` 无 peer dependency warning。
- [ ] 主 bundle 大小有记录，并设置合理的回归阈值。
- [ ] 删除依赖后核心 E2E 和视觉检查无回归。

## P3：利用 qBittorrent 5.2 新能力

### 17. 增强 torrent metadata 添加体验

工作内容：

- capability 支持时使用 `fetchMetadata`、`parseMetadata`、`saveMetadata`。
- 添加前展示文件树、总大小和文件优先级。
- 旧版本继续使用当前直接添加流程。

验收标准：

- [ ] 5.2.3 可在正式添加前选择/忽略文件并正确保存优先级。
- [ ] metadata 获取失败可重试或退回直接添加，不丢失表单内容。
- [ ] 4.4.5 不显示不可用入口，原添加流程继续工作。

### 18. 增强 tracker、piece 和 peer 可视化

工作内容：

- 展示 tracker endpoint、next/min announce、warning/error/unreachable。
- 使用 `pieceAvailability` 绘制 availability bar。
- 支持 I2P peer 展示和 host name。
- 大数据量下继续使用虚拟列表并避免高频整表重渲染。

验收标准：

- [ ] tracker 状态与服务端响应一致，未知新状态有降级显示。
- [ ] availability bar 能区分 piece state 与 piece availability。
- [ ] 5,000 个 peer 或多文件 torrent 下滚动仍可用，无明显 UI 锁死。
- [ ] capability 不支持时相关功能隐藏或使用旧数据，不发出 404 请求。

### 19. 完善批量操作和共享设置

工作内容：

- 完成 README 已规划的批量 category、tag、限速、share limit、location、recheck、reannounce 操作。
- 支持 5.2 的 share limit action 和单 tracker reannounce。
- 使用 `clientdata` 持久化允许共享的表格与界面偏好。

验收标准：

- [ ] 所有批量操作在 0、1、多个选择项时按钮状态正确。
- [ ] 危险操作有清晰确认，删除 torrent 与删除数据不可混淆。
- [ ] 部分失败会列出成功与失败项，不把整批显示为完全成功。
- [ ] 4.4.5 不发送仅 5.x 支持的参数或 endpoint。

## 发布前统一验收门槛

每个可发布版本必须同时满足：

- [ ] `pnpm install --frozen-lockfile`、lint、typecheck、unit test、build 全部通过。
- [ ] qBittorrent 4.4.5 与 5.2.3 核心 E2E 全部通过。
- [ ] Alternate WebUI 部署路径下完成一次真实安装验证。
- [ ] 不要求用户关闭 CSRF、Host header validation 或认证保护。
- [ ] 没有凭据、SID、API key、下载数据或本机配置进入 Git。
- [ ] 变更涉及 WebAPI 时同步更新 capability、fixtures、类型和兼容测试。
- [ ] 变更涉及 UI 时完成 light/dark 和桌面/窄屏检查。

## 建议的首个里程碑

第一个里程碑只包含第 1–9 项。完成定义是：项目可重复安装和构建，并能在 qBittorrent 4.4.5、5.2.3 上完成登录、同步列表、筛选、添加、停止和启动 torrent。此前不进行 Tailwind 4 迁移，也不开发新的 5.2 专属功能。
