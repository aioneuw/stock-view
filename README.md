# StockView — A股行情仪表盘

一个轻量级的全栈 Web 应用，模拟 A 股行情展示。

## ✨ 功能特性

- 📊 **股票列表**：展示 10 只 A 股模拟股票，支持排序和搜索
- 📈 **K线图**：专业的 K 线图展示，支持 MA5/MA10/MA20 均线
- ⭐ **自选股管理**：一键添加/移除自选股，数据持久化
- 🌙 **深色/浅色主题**：支持主题切换，跟随系统设置
- 📱 **响应式设计**：适配桌面端和移动端

## 🛠️ 技术栈

### 前端
- **框架**：Next.js 14 + React 18
- **语言**：TypeScript
- **样式**：Tailwind CSS + shadcn/ui
- **图表**：ECharts
- **主题**：next-themes

### 后端
- **语言**：Python 3.12
- **框架**：FastAPI
- **数据模拟**：pandas + numpy

## 🚀 快速开始

### 前置要求
- Node.js 18+
- Python 3.10+

### 1. 启动后端

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 启动服务
python main.py
```

后端服务运行在 http://localhost:8000

### 2. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端开发服务器运行在 http://localhost:3000

### 3. 访问应用

打开浏览器访问 http://localhost:3000

## 📁 项目结构

```
stock-view/
├── backend/
│   ├── main.py              # FastAPI 应用入口
│   ├── data_generator.py    # 模拟数据生成器
│   ├── models.py            # 数据模型定义
│   └── requirements.txt     # Python 依赖
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # 首页（股票列表）
│   │   │   ├── layout.tsx        # 布局文件
│   │   │   └── stock/[code]/     # 个股详情页
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui 组件
│   │   │   ├── KLineChart.tsx    # K线图组件
│   │   │   ├── StockTable.tsx    # 股票表格
│   │   │   ├── MarketOverview.tsx # 大盘概览
│   │   │   ├── SearchBar.tsx     # 搜索框
│   │   │   ├── FavoritePanel.tsx # 自选股面板
│   │   │   ├── Navbar.tsx        # 导航栏
│   │   │   └── ThemeToggle.tsx   # 主题切换
│   │   └── lib/
│   │       ├── api.ts            # API 封装
│   │       └── utils.ts          # 工具函数
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

## 📡 API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/stocks` | GET | 获取所有股票列表 |
| `/api/stocks/{code}` | GET | 获取单只股票详情 |
| `/api/stocks/{code}/kline` | GET | 获取K线数据 |

### 查询参数

**`/api/stocks/{code}/kline`**
- `range`: 时间范围，可选值：`1w`（1周）、`1m`（1月）、`3m`（3月）、`all`（全部）

## 🎨 界面预览

### 首页
- 大盘概览（上证指数、深证成指）
- 股票列表（支持排序、搜索）
- 自选股管理

### 个股详情页
- 股票行情数据
- K线图（支持时间区间切换）
- 关键指标（PE、PB、换手率、市值）

## 🌟 碾压加分项

- [x] 深色/浅色主题切换
- [x] 涨跌幅高亮（超过 5% 特殊标记）
- [x] 响应式设计
- [x] K线图十字光标
- [x] 自选股 localStorage 持久化
- [x] 搜索框实时过滤
- [x] 骨架屏加载状态

## 📄 许可证

MIT License
