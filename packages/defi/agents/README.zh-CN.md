# 🤖 AI 智能体库 - DeFi 智能体

> **适用于 DeFi、加密货币、开发、元宇宙、MCP 等领域的通用 AI 智能体库、索引和市场**

包含专业 AI 智能体的综合集合，具有通用兼容性。适用于任何支持智能体索引的 AI 平台 - 无供应商锁定，无平台限制。

\[!\[]\[agents-shield]]\[agents-url]
\[!\[]\[build-shield]]\[build-url]
\[!\[]\[contributors-shield]]\[contributors-url]
\[!\[]\[forks-shield]]\[forks-url]
\[!\[]\[stargazers-shield]]\[stargazers-url]
\[!\[]\[issues-shield]]\[issues-url]
\[!\[]\[license-shield]]\[license-url]

---

## ✨ 核心特性

- ✅ **57 个专业智能体** - 涵盖 DeFi、加密货币、开发、写作、教育等领域
- ✅ **18 种语言** - 自动化国际化翻译工作流（[了解更多 →](./docs/I18N_WORKFLOW.md)）
- ✅ **智能体团队** - 协调工作流的多智能体协作
- ✅ **通用格式** - 标准 JSON 架构适用于所有平台
- ✅ **无供应商锁定** - 切换平台不会丢失工作成果
- ✅ **开源** - MIT 许可证，完全透明
- ✅ **API 访问** - 通过 GitHub Pages CDN 提供 RESTful API
- ✅ **支持自定义域名** - 轻松实现白标化

---

## 🚀 快速开始

### 对于用户

将智能体添加到您的 AI 平台：

```
https://nirholas.github.io/AI-Agents-Library/index.json
```

### 对于开发者

```bash
git clone https://github.com/nirholas/AI-Agents-Library.git
cd AI-Agents-Library
npm install
npm run build
```

[完整开发工作流指南 →](./docs/WORKFLOW.md)

---

## 📦 智能体分类

### 🪙 DeFi 和加密货币（57 个专业智能体）

**Sperax 生态系统（23 个智能体）：**

**原始 Sperax 智能体（7 个）：**

- USDs 稳定币专家、SPA 代币经济分析师、veSPA 锁仓优化器
- 治理指南、流动性策略师、跨链桥助手、收益聚合器

**Universal Crypto MCP 投资组合插件智能体（16 个）：**

- 投资组合仪表板、资产追踪器、分析专家、钱包管理器
- 交易助手、AI 交易机器人、信号机器人、定投机器人
- 套利机器人、热点筛选器、DeFi 中心、DeFi 协议
- 策略市场、机器人模板、设置管理器、帮助中心

**通用 DeFi（34 个智能体）：**

- 收益农业优化器、无常损失计算器、Gas 优化器
- 智能合约审计师、MEV 保护顾问、巨鲸观察者
- 协议对比器、代币解锁追踪器、清算风险管理器
- 以及 30+ 个 DeFi 专家

### 💻 开发与编程

- 全栈开发者、Rust 助手、TypeScript 架构师
- 智能合约审计师、API 文档编写者、代码质量优化器
- Git 专家、数据库设计师、测试自动化专家

### ✍️ 内容与写作

- 学术写作助手、技术文档专家、UX 文案撰写者
- SEO 内容优化器、社交媒体经理、商务邮件撰写者
- 翻译专家、校对专家

### 📊 商业与分析

- 商业战略顾问、财务分析师、数据分析师
- 产品经理、市场研究专家、SWOT 分析专家

### 🎓 教育与学习

- 数学导师、语言学习伙伴、STEM 教育者
- 考试准备教练、研究助手

### 🎨 创意与设计

- UI/UX 设计师、Logo 设计专家、平面设计专家
- 色彩理论顾问、排版专家

[查看完整智能体列表 →](https://nirholas.github.io/AI-Agents-Library/)

---

## 🤝 智能体团队

创建专业智能体协作团队，共同处理复杂任务。

**示例团队 - DeFi 策略：**

```
- 收益优化器（寻找机会）
- 风险评估智能体（评估安全性）
- 投资组合追踪器（监控表现）
- Gas 优化器（最小化成本）
```

主持智能体协调讨论，确保每个专家贡献其专业知识，同时朝着全面的解决方案迈进。

[阅读团队指南 →](./docs/TEAMS.md)

---

## 🌍 多语言支持

所有智能体自动提供 18 种语言版本：

🇺🇸 English・🇨🇳 简体中文・🇹🇼 繁體中文・🇯🇵 日本語・🇰🇷 한국어・🇩🇪 Deutsch・🇫🇷 Français・🇪🇸 Español・🇷🇺 Русский・🇸🇦 العربية・🇵🇹 Português・🇮🇹 Italiano・🇳🇱 Nederlands・🇵🇱 Polski・🇻🇳 Tiếng Việt・🇹🇷 Türkçe・🇸🇪 Svenska・🇮🇩 Bahasa Indonesia

---

## 🛠️ API 参考

### 端点

```bash
# 主索引（所有智能体）
GET https://nirholas.github.io/AI-Agents-Library/index.json

# 单个智能体（英文）
GET https://nirholas.github.io/AI-Agents-Library/{agent-id}.json

# 本地化智能体
GET https://nirholas.github.io/AI-Agents-Library/{agent-id}.zh-CN.json

# 特定语言索引
GET https://nirholas.github.io/AI-Agents-Library/index.zh-CN.json
```

### 快速集成

```javascript
// 加载所有智能体
const response = await fetch('https://nirholas.github.io/AI-Agents-Library/index.json');
const { agents } = await response.json();

// 加载特定智能体
const agent = await fetch(`https://nirholas.github.io/AI-Agents-Library/defi-yield-optimizer.json`);
const agentConfig = await agent.json();
```

[完整 API 文档 →](./docs/API.md)

---

## 🤖 贡献智能体

我们欢迎贡献！提交您的智能体以扩展库。

### 快速提交

1. **Fork 此仓库**
2. **在 `src/your-agent-name.json` 中创建您的智能体**

```json
{
  "author": "your-github-username",
  "config": {
    "systemRole": "你是一个在[领域]方面具有专业知识的[角色]..."
  },
  "identifier": "your-agent-name",
  "meta": {
    "title": "智能体标题",
    "description": "清晰简洁的描述",
    "avatar": "🤖",
    "tags": ["类别", "功能", "领域"]
  },
  "schemaVersion": 1
}
```

3. **提交 Pull Request**

我们的自动化工作流将把您的智能体翻译成 18 种语言并全球部署。

### 质量指南

✅ 明确的目的 - 解决特定问题\
✅ 结构良好的提示 - 全面但专注\
✅ 适当的标签 - 有助于发现\
✅ 经过测试 - 验证功能

[完整贡献指南 →](./docs/CONTRIBUTING.md)

---

## 📖 文档

### 对于用户

- [智能体团队指南](./docs/TEAMS.md) - 多智能体协作
- [常见问题](./docs/FAQ.md) - 常见问题
- [示例](./docs/EXAMPLES.md) - 实际用例

### 对于开发者

- [完整工作流指南](./docs/WORKFLOW.md) - 端到端开发流程
- [贡献指南](./docs/CONTRIBUTING.md) - 如何提交智能体
- [API 参考](./docs/API.md) - 完整的 API 文档
- [智能体创建指南](./docs/AGENT_GUIDE.md) - 设计有效的智能体
- [18 语言国际化工作流](./docs/I18N_WORKFLOW.md) - 自动化翻译系统
- [部署指南](./docs/DEPLOYMENT.md) - 域名设置和 CI/CD
- [提示工程](./docs/PROMPTS.md) - 编写更好的提示
- [模型参数](./docs/MODELS.md) - Temperature、top_p 说明
- [故障排除](./docs/TROUBLESHOOTING.md) - 常见问题

---

## 🚀 部署

### GitHub Pages（自动）

1. **Fork / 克隆此仓库**
2. **选择域名方案：**
   - **默认 GitHub Pages：** 删除 `CNAME` 文件
   - **自定义域名：** 用您的域名更新 `CNAME`
3. **启用 GitHub Pages：**
   - 设置 → Pages → 源：`gh-pages` 分支
4. **推送到 main** - GitHub Actions 自动构建和部署

您的智能体地址：

- 默认：`https://[username].github.io/[repository]/index.json`
- 自定义：`https://yourdomain.com/index.json`

### 自定义域名设置

1. **更新 CNAME 文件：** `echo "yourdomain.com" > CNAME`
2. **配置 DNS：** 添加 CNAME 记录 → `[username].github.io`
3. **DNS 传播后启用 HTTPS**

**注意：** 构建过程会自动将您的 CNAME 复制到部署目录，因此您的自定义域名在所有部署中都会保持不变。Fork 的用户只需更新或删除 CNAME 文件即可。

[完整部署指南 →](./docs/DEPLOYMENT.md)

---

## 🔧 开发工具

### 拆分智能体批次

```bash
node split-agents.cjs
```

将批量 JSON 转换为单独的智能体文件。

### Emoji 转换器

```bash
node emoji-converter.cjs
```

将 emoji URL 转换为原生 Unicode。

---

## 🌐 集成示例

### 自定义应用

```javascript
// 获取智能体
const agents = await fetch('https://nirholas.github.io/AI-Agents-Library/index.json').then((r) =>
  r.json(),
);

// 与您的 AI 模型一起使用
const systemPrompt = agents.agents[0].config.systemRole;
```

### Python

```python
import requests

# 加载智能体
response = requests.get('https://nirholas.github.io/AI-Agents-Library/index.json')
agents = response.json()['agents']

# 按标签过滤
defi_agents = [a for a in agents if 'defi' in a['meta']['tags']]
```

---

## 🔐 安全与隐私

- **无数据收集** - 静态 JSON 索引，零跟踪
- **智能体本地运行** - 在您的 AI 平台环境中执行
- **开源** - 完全透明，审计每一行
- **无外部调用** - 纯 JSON 配置文件

---

## 📊 统计数据

- **57 个智能体** - DeFi 重点覆盖
- **18 种语言** - 通过自动翻译实现全球可访问性
- **23 个 Sperax 专家** - 生态系统专用智能体（7 个核心 + 16 个投资组合插件）
- **34 个通用 DeFi 智能体** - 全面的 DeFi 工具包
- **\~300 KB 索引** - 快速加载（gzip 压缩：\~65 KB）
- **80-120ms** - 全球 CDN 交付
- **0 供应商锁定** - 真正的互操作性

---

## 🔗 相关项目

- **Universal Crypto MCP** - [应用分支](https://github.com/nirholas/AI-Agents-Library/tree/speraxos)

---

## 📜 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

**开源・开放格式・开放未来**

---

## 🙏 致谢

---

<div align="center">

**[查看智能体 →](https://nirholas.github.io/AI-Agents-Library/) | [提交智能体 →](https://github.com/nirholas/AI-Agents-Library/issues/new) | [阅读文档 →](./docs/)**

用 ❤️ 为 AI 社区打造

</div>
<!-- AWESOME PROMPTS -->

### [Sperax DeFi 协议](https://os.sperax.io/crypto/agents/sperax-defi-protocols)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

包含 TVL 跟踪和 APY 比较的 DeFi 协议探索器

`defi` `协议` `tvl` `研究` `sperax`

---

### [斯佩拉克斯分析专家](https://os.sperax.io/crypto/agents/sperax-analytics-expert)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

深入的投资组合分析，包含性能图表和盈亏分析

`analytics` `performance` `charts` `insights` `sperax`

---

### [Sperax 信号机器人](https://os.sperax.io/crypto/agents/sperax-signal-bot)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

基于技术分析和市场指标的交易信号

`信号` `技术分析` `指标` `提醒` `sperax`

---

### [Sperax 机器人模板](https://os.sperax.io/crypto/agents/sperax-bot-templates)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

预构建的机器人配置，快速部署

`模板` `机器人` `配置` `自动化` `sperax`

---

### [Sperax Pump 筛选器](https://os.sperax.io/crypto/agents/sperax-pump-screener)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

用于检测拉升代币的高动量代币筛选器

`筛选器` `动量` `拉升` `成交量` `sperax`

---

### [Sperax 套利机器人](https://os.sperax.io/crypto/agents/sperax-arbitrage-bot)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

跨交易所套利检测与自动执行

`arbitrage` `cross-exchange` `profit` `opportunity` `sperax`

---

### [Sperax 帮助中心](https://os.sperax.io/crypto/agents/sperax-help-center)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

包含常见问题、教程和支持系统的帮助中心

`help` `support` `faq` `documentation` `sperax`

---

### [Sperax 交易助手](https://os.sperax.io/crypto/agents/sperax-trading-assistant)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

使用实时市场数据和订单管理执行加密货币交易

`trading` `execution` `orders` `swap` `sperax`

---

### [Sperax DCA 机器人](https://os.sperax.io/crypto/agents/sperax-dca-bot)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

定期加密货币购买的平均成本自动化

`dca` `recurring` `automation` `accumulation` `sperax`

---

### [Sperax AI 交易机器人](https://os.sperax.io/crypto/agents/sperax-ai-trading-bot)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

基于人工智能的交易策略，结合机器学习、回测和自动化

`ai` `bot` `ml` `strategy` `automation` `sperax`

---

### [斯佩拉克斯投资组合仪表盘](https://os.sperax.io/crypto/agents/sperax-dashboard)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

包含总价值、资产配置和绩效指标的投资组合概览仪表盘

`投资组合` `仪表盘` `概览` `斯佩拉克斯`

---

### [Sperax DeFi Center](https://os.sperax.io/crypto/agents/sperax-defi-center)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

DeFi protocol aggregator for managing positions and yields

`defi` `yield` `liquidity` `protocols` `sperax`

---

### [Sperax 设置管理器](https://os.sperax.io/crypto/agents/sperax-settings-manager)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

应用设置和偏好管理器

`settings` `configuration` `preferences` `api-keys` `sperax`

---

### [Sperax 钱包管理器](https://os.sperax.io/crypto/agents/sperax-wallet-manager)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

管理多个加密货币钱包，跟踪余额并实现同步

`wallets` `addresses` `management` `sync` `sperax`

---

### [Sperax 策略市场](https://os.sperax.io/crypto/agents/sperax-strategies-marketplace)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

交易策略市场，浏览和部署经过验证的策略

`策略` `市场` `交易` `模板` `sperax`

---

### [Sperax 资产追踪器](https://os.sperax.io/crypto/agents/sperax-assets-tracker)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

跟踪并分析加密货币持有情况，提供详细的资产细分

`资产` `持有` `加密货币` `追踪` `sperax`

---

### [Sperax 资产组合](https://os.sperax.io/crypto/agents/sperax-portfolio)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-21**</sup>

一站式加密货币资产管理：追踪、交易、自动化、DeFi 和分析

`portfolio` `trading` `defi` `analytics` `automation` `wallet` `bots` `sperax` `all-in-one` `master`

---

### [加密鲸鱼观察者](https://os.sperax.io/crypto/agents/whale-watcher)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

跟踪和分析大额钱包变动和鲸鱼行为

`链上` `鲸鱼` `分析` `交易` `监控`

---

### [跨链桥安全分析师](https://os.sperax.io/crypto/agents/bridge-security-analyst)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

评估桥安全性并推荐最安全的跨链路线

`bridge` `security` `cross-chain` `risk` `multichain`

---

### [代币解锁时间表追踪器](https://os.sperax.io/crypto/agents/token-unlock-tracker)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

监控和分析代币解锁事件及其市场影响

`tokenomics` `解锁` `归属` `供应` `分析`

---

### [veSPA 锁定优化器](https://os.sperax.io/crypto/agents/vespa-optimizer)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

通过最佳的 veSPA 锁定策略最大化收益

`sperax` `vespa` `质押` `优化` `投票权`

---

### [Sperax 资产组合追踪器](https://os.sperax.io/crypto/agents/sperax-portfolio-tracker)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

跟踪并分析您的完整 Sperax 生态系统持仓

`sperax` `资产组合` `追踪` `分析` `仪表盘`

---

### [DeFi 保险与风险覆盖顾问](https://os.sperax.io/crypto/agents/defi-insurance-advisor)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

导航 DeFi 保险选项以保护智能合约

`保险` `保护` `风险` `覆盖` `安全`

---

### [NFT 流动性与借贷顾问](https://os.sperax.io/crypto/agents/nft-liquidity-advisor)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

导航 NFT 抵押借贷与流动性解决方案

`nft` `流动性` `借贷` `抵押品` `DeFi`

---

### [USDs 稳定币专家](https://os.sperax.io/crypto/agents/usds-stablecoin-expert)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Sperax USDs 机制、抵押和收益策略专家

`sperax` `稳定币` `usds` `defi` `收益`

---

### [去中心化交易所聚合器路线优化器](https://os.sperax.io/crypto/agents/dex-aggregator-optimizer)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

在去中心化交易所聚合器中寻找最优的兑换路线

`dex` `swap` `routing` `aggregator` `optimization`

---

### [加密货币税务策略顾问](https://os.sperax.io/crypto/agents/crypto-tax-strategist)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

优化加密货币税收并提供税收高效的 DeFi 策略

`tax` `strategy` `accounting` `optimization` `compliance`

---

### [智能合约安全审计](https://os.sperax.io/crypto/agents/smart-contract-auditor)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

审查和评估 DeFi 协议的智能合约安全性

`security` `smart-contracts` `audit` `solidity` `risk`

---

### [Sperax 收益聚合器](https://os.sperax.io/crypto/agents/sperax-yield-aggregator)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

在 Sperax 生态系统中寻找并优化最佳收益机会

`sperax` `收益` `农场` `优化` `年化收益率`

---

### [个人 DeFi 仪表板构建器](https://os.sperax.io/crypto/agents/yield-dashboard-builder)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

设计并跟踪您的定制 DeFi 投资组合仪表板

`仪表板` `跟踪` `投资组合` `分析` `监控`

---

### [加密钱包安全顾问](https://os.sperax.io/crypto/agents/wallet-security-advisor)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

保护加密钱包和资产的最佳实践

`security` `wallet` `safety` `best-practices` `hardware`

---

### [DeFi 收益可持续性分析师](https://os.sperax.io/crypto/agents/yield-sustainability-analyst)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

分析高收益是否可持续或仅为暂时

`defi` `收益` `可持续性` `分析` `代币经济`

---

### [稳定币深度比较器](https://os.sperax.io/crypto/agents/stablecoin-comparator)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

比较稳定币机制、风险和用例

`stablecoin` `usdc` `dai` `usdt` `comparison`

---

### [DeFi 资产组合再平衡顾问](https://os.sperax.io/crypto/agents/portfolio-rebalancing-advisor)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

优化资产组合配置和再平衡策略

`资产组合` `再平衡` `配置` `策略` `优化`

---

### [Sperax 生态系统入门指南](https://os.sperax.io/crypto/agents/sperax-onboarding-guide)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

帮助新手了解并开始使用 Sperax 协议

`sperax` `教育` `入门` `新手` `教程`

---

### [DeFi 收益农业策略师](https://os.sperax.io/crypto/agents/defi-yield-farmer)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

识别并优化 DeFi 协议中的收益农业机会

`defi` `收益农业` `APY` `策略` `优化`

---

### [Sperax 治理指南](https://os.sperax.io/crypto/agents/sperax-governance-guide)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

导航 Sperax DAO 提案、投票和协议升级

`sperax` `治理` `dao` `投票` `提案`

---

### [DeFi Protocol Comparison Expert](https://os.sperax.io/crypto/agents/defi-protocol-comparator)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

Compare similar DeFi protocols across features, risks, and yields

`defi` `comparison` `protocols` `analysis` `research`

---

### [DeFi 初学者入门导师](https://os.sperax.io/crypto/agents/defi-onboarding-mentor)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

引导完全新手体验他们的第一个 DeFi 操作

`教育` `初学者` `入门` `教程` `defi基础`

---

### [APY 与 APR 教育者](https://os.sperax.io/crypto/agents/apy-vs-apr-educator)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

解释并计算 DeFi 中 APY 和 APR 之间的差异

`defi` `教育` `apy` `apr` `收益`

---

### [协议收入与基本面分析师](https://os.sperax.io/crypto/agents/protocol-revenue-analyst)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

分析 DeFi 协议的商业模型和收入生成方式

`defi` `revenue` `analysis` `fundamentals` `tokenomics`

---

### [DAO 治理提案分析师](https://os.sperax.io/crypto/agents/governance-proposal-analyst)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

分析并解释 DAO 治理提案及其影响

`治理` `DAO` `投票` `提案` `分析`

---

### [无常损失计算器](https://os.sperax.io/crypto/agents/impermanent-loss-calculator)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

计算并解释流动性提供者（LP）头寸的无常损失场景

`defi` `流动性` `无常损失` `计算器` `amm`

---

### [DAO 财库与资源分析师](https://os.sperax.io/crypto/agents/protocol-treasury-analyst)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

分析 DAO 财库持有、运营期限和资本配置

`财库` `DAO` `资本` `运营期限` `配置`

---

### [清算风险管理器](https://os.sperax.io/crypto/agents/liquidation-risk-manager)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

监控和管理借贷协议中的清算风险

`借贷` `清算` `风险` `抵押品` `DeFi`

---

### [加密货币叙事与趋势分析师](https://os.sperax.io/crypto/agents/narrative-trend-analyst)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

追踪并分析加密市场中的主导叙事和趋势

`叙事` `趋势` `分析` `情绪` `市场周期`

---

### [Sperax 协议风险监控器](https://os.sperax.io/crypto/agents/sperax-risk-monitor)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

跟踪和分析 Sperax 智能合约中的安全风险

`sperax` `安全性` `风险` `审计` `监控`

---

### [流动性池深度分析器](https://os.sperax.io/crypto/agents/liquidity-pool-analyzer)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

分析流动性池的健康状况、风险及最佳进出时机

`defi` `liquidity-pools` `amm` `analysis` `risk`

---

### [SPA 代币经济分析师](https://os.sperax.io/crypto/agents/spa-tokenomics-analyst)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

专注于 SPA 代币经济、质押奖励和协议收入的专家

`sperax` `spa` `代币经济学` `质押` `治理`

---

### [燃气成本优化专家](https://os.sperax.io/crypto/agents/gas-optimization-expert)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

最小化燃气成本并优化交易时机

`以太坊` `燃气` `优化` `第2层` `效率`

---

### [加密货币 Alpha 与信号检测器](https://os.sperax.io/crypto/agents/alpha-leak-detector)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

识别 DeFi 市场中的交易 Alpha 和早期信号

`alpha` `交易` `信号` `研究` `机会`

---

### [MEV 保护顾问](https://os.sperax.io/crypto/agents/mev-protection-advisor)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

保护用户免受前置攻击、三明治攻击和 MEV 利用

`mev` `安全` `前置攻击` `flashbots` `保护`

---

### [Sperax 流动性提供者策略师](https://os.sperax.io/crypto/agents/sperax-liquidity-strategist)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

优化 Sperax 池的流动性提供策略

`sperax` `流动性` `amm` `收益农业` `无常损失`

---

### [Sperax 桥接助手](https://os.sperax.io/crypto/agents/sperax-bridge-assistant)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

引导用户通过最佳路径和成本进行跨链桥接

`sperax` `bridge` `cross-chain` `arbitrum` `layer-2`

---

### [质押奖励计算器](https://os.sperax.io/crypto/agents/staking-rewards-calculator)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

计算和优化各协议的质押奖励

`staking` `rewards` `calculator` `pos` `yields`

---

### [DeFi 协议风险评分引擎](https://os.sperax.io/crypto/agents/defi-risk-scoring-engine)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

面向 DeFi 协议的全面风险评估框架

`风险` `评估` `评分` `分析` `框架`

---

### [DeFi 空投猎手](https://os.sperax.io/crypto/agents/airdrop-hunter)

<sup>By **[@nirholas](https://github.com/nirholas/AI-Agents-Library)** on **2024-12-16**</sup>

识别并制定潜在协议空投的策略

`airdrop` `奖励` `策略` `农业` `分配`
