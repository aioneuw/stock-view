"""数据模型定义"""
from pydantic import BaseModel
from typing import List, Optional


class StockBasic(BaseModel):
    """股票基础信息"""
    code: str
    name: str
    latest_price: float
    change_percent: float
    change_amount: float
    open: float
    close_yesterday: float
    high: float
    low: float
    volume: int
    amount: float
    is_favorite: bool = False


class StockDetail(StockBasic):
    """股票详细信息"""
    pe: float
    pb: float
    turnover_rate: float
    total_market_cap: float
    float_market_cap: float


class KLineData(BaseModel):
    """K线数据"""
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class KLineResponse(BaseModel):
    """K线响应"""
    code: str
    range: str
    klines: List[KLineData]


class MarketOverview(BaseModel):
    """大盘概览"""
    sh_index: float
    sh_change: float
    sz_index: float
    sz_change: float


class StockListResponse(BaseModel):
    """股票列表响应"""
    stocks: List[StockBasic]
    market_overview: MarketOverview
