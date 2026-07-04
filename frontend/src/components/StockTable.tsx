'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StockBasic } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface StockTableProps {
  stocks: StockBasic[];
  favorites: string[];
  onToggleFavorite: (code: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export function StockTable({
  stocks,
  favorites,
  onToggleFavorite,
  sortBy,
  sortOrder,
  onSort,
}: StockTableProps) {
  // 格式化数字
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  };

  // 格式化成交量
  const formatVolume = (volume: number) => {
    if (volume >= 10000) {
      return `${(volume / 10000).toFixed(2)}万`;
    }
    return volume.toString();
  };

  // 格式化成交额
  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)}亿`;
  };

  // 获取涨跌颜色
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  // 获取涨跌背景色
  const getChangeBgColor = (change: number) => {
    if (change > 5) return 'bg-red-50';
    if (change < -5) return 'bg-green-50';
    return '';
  };

  // 排序图标
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">操作</TableHead>
            <TableHead className="w-[100px]">代码</TableHead>
            <TableHead className="w-[120px]">名称</TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => onSort('latest_price')}
            >
              最新价 {getSortIcon('latest_price')}
            </TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => onSort('change_percent')}
            >
              涨跌幅 {getSortIcon('change_percent')}
            </TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => onSort('change_amount')}
            >
              涨跌额 {getSortIcon('change_amount')}
            </TableHead>
            <TableHead className="text-right">今开</TableHead>
            <TableHead className="text-right">昨收</TableHead>
            <TableHead className="text-right">最高</TableHead>
            <TableHead className="text-right">最低</TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => onSort('volume')}
            >
              成交量 {getSortIcon('volume')}
            </TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => onSort('amount')}
            >
              成交额 {getSortIcon('amount')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow
              key={stock.code}
              className={`${getChangeBgColor(stock.change_percent)} hover:bg-gray-50`}
            >
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFavorite(stock.code)}
                >
                  <Star
                    className={`h-4 w-4 ${
                      favorites.includes(stock.code)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                </Button>
              </TableCell>
              <TableCell className="font-mono">{stock.code}</TableCell>
              <TableCell>
                <Link
                  href={`/stock/${stock.code}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {stock.name}
                </Link>
              </TableCell>
              <TableCell className={`text-right font-mono ${getChangeColor(stock.change_percent)}`}>
                {formatNumber(stock.latest_price)}
              </TableCell>
              <TableCell className={`text-right ${getChangeColor(stock.change_percent)}`}>
                <Badge
                  variant={stock.change_percent >= 0 ? 'destructive' : 'default'}
                  className={
                    stock.change_percent >= 0
                      ? 'bg-red-100 text-red-700 hover:bg-red-100'
                      : 'bg-green-100 text-green-700 hover:bg-green-100'
                  }
                >
                  {stock.change_percent >= 0 ? '+' : ''}
                  {formatNumber(stock.change_percent)}%
                </Badge>
              </TableCell>
              <TableCell className={`text-right ${getChangeColor(stock.change_amount)}`}>
                {stock.change_amount >= 0 ? '+' : ''}
                {formatNumber(stock.change_amount)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatNumber(stock.open)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatNumber(stock.close_yesterday)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatNumber(stock.high)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatNumber(stock.low)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatVolume(stock.volume)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatAmount(stock.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
