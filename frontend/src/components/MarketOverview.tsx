'use client';

import { MarketOverview as MarketOverviewType } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketOverviewProps {
  data: MarketOverviewType;
}

export function MarketOverview({ data }: MarketOverviewProps) {
  // 格式化数字
  const formatNumber = (num: number) => {
    return num.toFixed(2);
  };

  // 获取涨跌颜色
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  // 获取涨跌图标
  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* 上证指数 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">上证指数</p>
              <p className="text-2xl font-bold">{formatNumber(data.sh_index)}</p>
            </div>
            <div className={`flex items-center gap-1 ${getChangeColor(data.sh_change)}`}>
              {getChangeIcon(data.sh_change)}
              <span className="text-lg font-semibold">
                {data.sh_change >= 0 ? '+' : ''}
                {formatNumber(data.sh_change)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 深证成指 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">深证成指</p>
              <p className="text-2xl font-bold">{formatNumber(data.sz_index)}</p>
            </div>
            <div className={`flex items-center gap-1 ${getChangeColor(data.sz_change)}`}>
              {getChangeIcon(data.sz_change)}
              <span className="text-lg font-semibold">
                {data.sz_change >= 0 ? '+' : ''}
                {formatNumber(data.sz_change)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
