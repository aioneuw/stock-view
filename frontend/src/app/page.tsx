'use client';

import { useState, useEffect, useMemo } from 'react';
import { getStocks, StockBasic, MarketOverview as MarketOverviewType } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { MarketOverview } from '@/components/MarketOverview';
import { StockTable } from '@/components/StockTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [stocks, setStocks] = useState<StockBasic[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const data = await getStocks();
        setStocks(data.stocks);
        setMarketOverview(data.market_overview);
        setError(null);
      } catch (err) {
        setError('获取股票数据失败，请确保后端服务已启动');
        console.error('Failed to fetch stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // 切换自选股
  const toggleFavorite = (code: string) => {
    setFavorites((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  // 处理排序
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // 过滤和排序后的股票列表
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (stock) =>
          stock.code.toLowerCase().includes(query) ||
          stock.name.toLowerCase().includes(query)
      );
    }

    // 排序
    result.sort((a, b) => {
      let valueA = a[sortBy as keyof StockBasic];
      let valueB = b[sortBy as keyof StockBasic];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = (valueB as string).toLowerCase();
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [stocks, searchQuery, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-red-500">错误</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              请确保后端服务已启动：cd backend && python main.py
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        stocks={stocks}
        favorites={favorites}
        onSearch={setSearchQuery}
        onRemoveFavorite={toggleFavorite}
      />

      <main className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* 大盘概览 */}
        {marketOverview && <MarketOverview data={marketOverview} />}

        {/* 股票列表 */}
        <Card>
          <CardHeader>
            <CardTitle>A股行情</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStocks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? '没有找到匹配的股票' : '暂无股票数据'}
              </div>
            ) : (
              <StockTable
                stocks={filteredStocks}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
