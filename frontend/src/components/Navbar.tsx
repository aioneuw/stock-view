'use client';

import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { FavoritePanel } from './FavoritePanel';
import { StockBasic } from '@/lib/api';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  stocks: StockBasic[];
  favorites: string[];
  onSearch: (query: string) => void;
  onRemoveFavorite: (code: string) => void;
}

export function Navbar({
  stocks,
  favorites,
  onSearch,
  onRemoveFavorite,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto flex h-14 items-center px-4">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">StockView</span>
        </Link>

        {/* 搜索框 */}
        <div className="flex-1 max-w-md">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* 右侧操作 */}
        <div className="flex items-center gap-4 ml-auto">
          <FavoritePanel
            favorites={favorites}
            stocks={stocks}
            onRemove={onRemoveFavorite}
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
