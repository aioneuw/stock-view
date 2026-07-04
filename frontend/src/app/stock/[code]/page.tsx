'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getStockDetail,
  getKLineData,
  StockDetail,
  KLineData,
} from '@/lib/api';
import { KLineChart } from '@/components/KLineChart';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  Loader2,
} from 'lucide-react';

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [stock, setStock] = useState<StockDetail | null>(null);
  const [klineData, setKlineData] = useState<KLineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<'1w' | '1m' | '3m' | 'all'>('all');

  // 从 localStorage 加载自选股
  useEffect(() => {
    const saved = localStorage.getItem('stockview_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, []);

  // 保存自选股到 localStorage
  useEffect(() => {
    localStorage.setItem('stockview_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 获取股票数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stockData, klineResponse] = await Promise.all([
          getStockDetail(code),
          getKLineData(code, timeRange),
        ]);
        setStock(stockData);
        setKlineData(klineResponse.klines);
        setError(null);
      } catch (err) {
        setError('获取股票数据失败');
        console.error('Failed to fetch stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code, timeRange]);

  // 切换自选股
  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  // 格式化数字
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  };

  // 格式化市值
  const formatMarketCap = (cap: number) => {
    if (cap >= 10000) {
      return `${(cap / 10000).toFixed(2)}万亿`;
    }
    return `${cap.toFixed(2)}亿`;
  };

  // 获取涨跌颜色
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-red-500">错误</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || '股票不存在'}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/')}
            >
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-7xl mx-auto flex h-14 items-center px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="ml-4 flex-1">
            <h1 className="text-lg font-semibold">
              {stock.name} ({stock.code})
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={favorites.includes(code) ? 'default' : 'outline'}
              onClick={toggleFavorite}
            >
              <Star
                className={`h-4 w-4 mr-2 ${
                  favorites.includes(code) ? 'fill-yellow-400' : ''
                }`}
              />
              {favorites.includes(code) ? '已自选' : '加入自选'}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* 股票基本信息 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">最新价</p>
                <p className={`text-3xl font-bold ${getChangeColor(stock.change_percent)}`}>
                  {formatNumber(stock.latest_price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">涨跌幅</p>
                <p className={`text-2xl font-semibold ${getChangeColor(stock.change_percent)}`}>
                  {stock.change_percent >= 0 ? '+' : ''}
                  {formatNumber(stock.change_percent)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">今开</p>
                <p className="text-xl font-mono">{formatNumber(stock.open)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">昨收</p>
                <p className="text-xl font-mono">{formatNumber(stock.close_yesterday)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">最高</p>
                <p className="text-xl font-mono text-red-600">
                  {formatNumber(stock.high)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">最低</p>
                <p className="text-xl font-mono text-green-600">
                  {formatNumber(stock.low)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">成交量</p>
                <p className="text-xl font-mono">
                  {stock.volume >= 10000
                    ? `${(stock.volume / 10000).toFixed(2)}万手`
                    : `${stock.volume}手`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">成交额</p>
                <p className="text-xl font-mono">{stock.amount.toFixed(2)}亿</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* K线图 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>K线图</CardTitle>
              <Tabs
                value={timeRange}
                onValueChange={(value) => setTimeRange(value as any)}
              >
                <TabsList>
                  <TabsTrigger value="1w">1周</TabsTrigger>
                  <TabsTrigger value="1m">1月</TabsTrigger>
                  <TabsTrigger value="3m">3月</TabsTrigger>
                  <TabsTrigger value="all">全部</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <KLineChart data={klineData} name={stock.name} />
          </CardContent>
        </Card>

        {/* 关键指标 */}
        <Card>
          <CardHeader>
            <CardTitle>关键指标</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">市盈率(PE)</p>
                <p className="text-xl font-semibold">{formatNumber(stock.pe)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">市净率(PB)</p>
                <p className="text-xl font-semibold">{formatNumber(stock.pb)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">换手率</p>
                <p className="text-xl font-semibold">
                  {formatNumber(stock.turnover_rate)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">总市值</p>
                <p className="text-xl font-semibold">
                  {formatMarketCap(stock.total_market_cap)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">流通市值</p>
                <p className="text-xl font-semibold">
                  {formatMarketCap(stock.float_market_cap)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
