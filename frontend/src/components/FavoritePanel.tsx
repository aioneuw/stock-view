'use client';

import { StockBasic } from '@/lib/api';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface FavoritePanelProps {
  favorites: string[];
  stocks: StockBasic[];
  onRemove: (code: string) => void;
}

export function FavoritePanel({ favorites, stocks, onRemove }: FavoritePanelProps) {
  // 获取自选股数据
  const favoriteStocks = stocks.filter((stock) =>
    favorites.includes(stock.code)
  );

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

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" className="gap-2">
          <Star className="h-4 w-4" />
          自选股
          {favorites.length > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {favorites.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>自选股</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {favoriteStocks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              暂无自选股，请点击股票名称旁的 ⭐ 添加
            </p>
          ) : (
            favoriteStocks.map((stock) => (
              <div
                key={stock.code}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <Link
                    href={`/stock/${stock.code}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {stock.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{stock.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono">{formatNumber(stock.latest_price)}</p>
                  <p className={`text-sm ${getChangeColor(stock.change_percent)}`}>
                    {stock.change_percent >= 0 ? '+' : ''}
                    {formatNumber(stock.change_percent)}%
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => onRemove(stock.code)}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
