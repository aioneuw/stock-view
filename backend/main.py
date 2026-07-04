"""FastAPI 应用入口"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from data_generator import get_stock_data, get_stock_by_code, get_kline_by_code
from models import StockListResponse, StockDetail, KLineResponse, MarketOverview

app = FastAPI(
    title="StockView API",
    description="A股行情仪表盘后端API",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "StockView API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/stocks", response_model=StockListResponse)
async def get_stocks():
    """
    获取所有股票列表

    返回所有股票的基础行情数据和大盘概览
    """
    data = get_stock_data()

    # 构建响应
    stocks = []
    for stock in data["stocks"]:
        stock_basic = {
            "code": stock["code"],
            "name": stock["name"],
            "latest_price": stock["latest_price"],
            "change_percent": stock["change_percent"],
            "change_amount": stock["change_amount"],
            "open": stock["open"],
            "close_yesterday": stock["close_yesterday"],
            "high": stock["high"],
            "low": stock["low"],
            "volume": stock["volume"],
            "amount": stock["amount"],
            "is_favorite": False  # 前端管理收藏状态
        }
        stocks.append(stock_basic)

    return {
        "stocks": stocks,
        "market_overview": data["market_overview"]
    }


@app.get("/api/stocks/{code}", response_model=StockDetail)
async def get_stock_detail(code: str):
    """
    获取单只股票详情

    Args:
        code: 股票代码

    Returns:
        股票详细信息
    """
    stock = get_stock_by_code(code)
    if not stock:
        raise HTTPException(status_code=404, detail=f"股票 {code} 不存在")

    return {
        "code": stock["code"],
        "name": stock["name"],
        "latest_price": stock["latest_price"],
        "change_percent": stock["change_percent"],
        "change_amount": stock["change_amount"],
        "open": stock["open"],
        "close_yesterday": stock["close_yesterday"],
        "high": stock["high"],
        "low": stock["low"],
        "volume": stock["volume"],
        "amount": stock["amount"],
        "is_favorite": False,
        "pe": stock["pe"],
        "pb": stock["pb"],
        "turnover_rate": stock["turnover_rate"],
        "total_market_cap": stock["total_market_cap"],
        "float_market_cap": stock["float_market_cap"]
    }


@app.get("/api/stocks/{code}/kline", response_model=KLineResponse)
async def get_stock_kline(code: str, range: Optional[str] = "all"):
    """
    获取K线数据

    Args:
        code: 股票代码
        range: 时间范围 (1w, 1m, 3m, all)

    Returns:
        K线数据
    """
    # 验证股票是否存在
    stock = get_stock_by_code(code)
    if not stock:
        raise HTTPException(status_code=404, detail=f"股票 {code} 不存在")

    # 验证range参数
    valid_ranges = ["1w", "1m", "3m", "all"]
    if range not in valid_ranges:
        raise HTTPException(
            status_code=400,
            detail=f"无效的range参数: {range}，有效值: {valid_ranges}"
        )

    # 获取K线数据
    klines = get_kline_by_code(code, range)

    return {
        "code": code,
        "range": range,
        "klines": klines
    }


@app.get("/api/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "timestamp": "2026-07-04"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
