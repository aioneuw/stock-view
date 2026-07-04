"""模拟数据生成器"""
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional


# 10只A股股票配置
STOCK_CONFIG = [
    {"code": "000001", "name": "平安银行", "base_price": 12.5},
    {"code": "000002", "name": "万科A", "base_price": 8.2},
    {"code": "000333", "name": "美的集团", "base_price": 65.0},
    {"code": "000858", "name": "五粮液", "base_price": 155.0},
    {"code": "002415", "name": "海康威视", "base_price": 32.0},
    {"code": "002475", "name": "立讯精密", "base_price": 28.5},
    {"code": "300750", "name": "宁德时代", "base_price": 185.0},
    {"code": "300059", "name": "东方财富", "base_price": 15.8},
    {"code": "600519", "name": "贵州茅台", "base_price": 1680.0},
    {"code": "601318", "name": "中国平安", "base_price": 42.0},
]


def generate_kline_data(base_price: float, days: int = 120) -> List[Dict[str, Any]]:
    """
    生成K线数据

    Args:
        base_price: 基础价格
        days: 生成天数

    Returns:
        K线数据列表
    """
    np.random.seed(hash(str(base_price)) % 2**32)

    klines = []
    current_price = base_price
    end_date = datetime.now()

    for i in range(days):
        date = end_date - timedelta(days=days - i - 1)

        # 跳过周末
        if date.weekday() >= 5:
            continue

        # 生成当日价格波动 (±3%)
        change_percent = np.random.uniform(-0.03, 0.03)

        open_price = current_price * (1 + np.random.uniform(-0.01, 0.01))
        close_price = current_price * (1 + change_percent)
        high_price = max(open_price, close_price) * (1 + np.random.uniform(0, 0.02))
        low_price = min(open_price, close_price) * (1 - np.random.uniform(0, 0.02))

        # 确保价格合理
        open_price = max(0.01, round(open_price, 2))
        close_price = max(0.01, round(close_price, 2))
        high_price = max(open_price, close_price, round(high_price, 2))
        low_price = min(open_price, close_price, round(low_price, 2))
        low_price = max(0.01, low_price)

        # 生成成交量 (几万到几百万手)
        volume = int(np.random.uniform(50000, 2000000))

        klines.append({
            "date": date.strftime("%Y-%m-%d"),
            "open": open_price,
            "high": high_price,
            "low": low_price,
            "close": close_price,
            "volume": volume
        })

        current_price = close_price

    return klines


def calculate_stock_metrics(klines: List[Dict[str, Any]], base_price: float) -> Dict[str, Any]:
    """
    计算股票指标

    Args:
        klines: K线数据
        base_price: 基础价格

    Returns:
        股票指标字典
    """
    if len(klines) < 2:
        return {}

    latest = klines[-1]
    previous = klines[-2]

    # 计算涨跌
    latest_price = latest["close"]
    close_yesterday = previous["close"]
    change_amount = round(latest_price - close_yesterday, 2)
    change_percent = round((change_amount / close_yesterday) * 100, 2)

    # 模拟其他指标
    np.random.seed(hash(str(base_price)) % 2**32)
    pe = round(np.random.uniform(5, 50), 2)
    pb = round(np.random.uniform(0.5, 10), 2)
    turnover_rate = round(np.random.uniform(0.5, 5), 2)
    total_market_cap = round(latest_price * np.random.uniform(100, 1000), 2)
    float_market_cap = round(total_market_cap * np.random.uniform(0.6, 0.9), 2)

    return {
        "latest_price": latest_price,
        "change_percent": change_percent,
        "change_amount": change_amount,
        "open": latest["open"],
        "close_yesterday": close_yesterday,
        "high": latest["high"],
        "low": latest["low"],
        "volume": latest["volume"],
        "amount": round(latest["volume"] * latest["price"] / 100000000, 2) if "price" in latest else round(np.random.uniform(10, 100), 2),
        "pe": pe,
        "pb": pb,
        "turnover_rate": turnover_rate,
        "total_market_cap": total_market_cap,
        "float_market_cap": float_market_cap
    }


def generate_market_overview() -> Dict[str, float]:
    """
    生成大盘概览数据

    Returns:
        大盘指数数据
    """
    np.random.seed(42)

    sh_index = round(3200 + np.random.uniform(-50, 50), 2)
    sh_change = round(np.random.uniform(-2, 2), 2)
    sz_index = round(10000 + np.random.uniform(-200, 200), 2)
    sz_change = round(np.random.uniform(-2, 2), 2)

    return {
        "sh_index": sh_index,
        "sh_change": sh_change,
        "sz_index": sz_index,
        "sz_change": sz_change
    }


def generate_all_stock_data() -> Dict[str, Any]:
    """
    生成所有股票数据

    Returns:
        完整的股票数据字典
    """
    stocks = []

    for config in STOCK_CONFIG:
        # 生成K线数据
        klines = generate_kline_data(config["base_price"])

        # 计算指标
        metrics = calculate_stock_metrics(klines, config["base_price"])

        stock_data = {
            "code": config["code"],
            "name": config["name"],
            **metrics,
            "klines": klines
        }

        stocks.append(stock_data)

    # 生成大盘数据
    market_overview = generate_market_overview()

    return {
        "stocks": stocks,
        "market_overview": market_overview
    }


# 全局数据存储
_stock_data = None


def get_stock_data() -> Dict[str, Any]:
    """获取股票数据（懒加载）"""
    global _stock_data
    if _stock_data is None:
        _stock_data = generate_all_stock_data()
    return _stock_data


def get_stock_by_code(code: str) -> Optional[Dict[str, Any]]:
    """根据代码获取股票数据"""
    data = get_stock_data()
    for stock in data["stocks"]:
        if stock["code"] == code:
            return stock
    return None


def get_kline_by_code(code: str, range: str = "all") -> List[Dict[str, Any]]:
    """获取K线数据"""
    stock = get_stock_by_code(code)
    if not stock:
        return []

    klines = stock["klines"]

    # 根据range筛选
    if range == "1w":
        return klines[-5:]
    elif range == "1m":
        return klines[-20:]
    elif range == "3m":
        return klines[-60:]
    else:  # all
        return klines
