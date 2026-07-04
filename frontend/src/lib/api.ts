/**
 * StockView API 封装
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface StockBasic {
  code: string;
  name: string;
  latest_price: number;
  change_percent: number;
  change_amount: number;
  open: number;
  close_yesterday: number;
  high: number;
  low: number;
  volume: number;
  amount: number;
  is_favorite: boolean;
}

export interface StockDetail extends StockBasic {
  pe: number;
  pb: number;
  turnover_rate: number;
  total_market_cap: number;
  float_market_cap: number;
}

export interface KLineData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketOverview {
  sh_index: number;
  sh_change: number;
  sz_index: number;
  sz_change: number;
}

export interface StockListResponse {
  stocks: StockBasic[];
  market_overview: MarketOverview;
}

export interface KLineResponse {
  code: string;
  range: string;
  klines: KLineData[];
}

/**
 * 获取所有股票列表
 */
export async function getStocks(): Promise<StockListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/stocks`);
  if (!response.ok) {
    throw new Error('获取股票列表失败');
  }
  return response.json();
}

/**
 * 获取单只股票详情
 */
export async function getStockDetail(code: string): Promise<StockDetail> {
  const response = await fetch(`${API_BASE_URL}/api/stocks/${code}`);
  if (!response.ok) {
    throw new Error(`获取股票 ${code} 详情失败`);
  }
  return response.json();
}

/**
 * 获取K线数据
 */
export async function getKLineData(
  code: string,
  range: '1w' | '1m' | '3m' | 'all' = 'all'
): Promise<KLineResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/stocks/${code}/kline?range=${range}`
  );
  if (!response.ok) {
    throw new Error(`获取股票 ${code} K线数据失败`);
  }
  return response.json();
}
