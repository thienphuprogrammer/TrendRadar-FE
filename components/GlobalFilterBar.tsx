"use client";
import React from "react";
import { useFilter } from "@/contexts/FilterContext";
import { TimeFilter, RegionFilter } from "@/components/filters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, Layers, Share2 } from "lucide-react";

const CHANNELS = [
  { value: "all", label: "All Channels" },
  { value: "tiktok", label: "TikTok" },
  { value: "shopee", label: "Shopee" },
  { value: "pos", label: "POS" },
  { value: "google", label: "Google Trends" },
];

const VERTICALS = [
  { value: "all", label: "All Verticals" },
  { value: "fashion", label: "Fashion" },
  { value: "cosmetics", label: "Cosmetics" },
  { value: "electronics", label: "Electronics" },
  { value: "food", label: "Food & Beverage" },
  // Add more as needed
];

export function GlobalFilterBar() {
  const { filter, setFilter, resetFilter } = useFilter();

  return (
    <div className="w-full flex flex-wrap gap-4 items-end bg-white/80 dark:bg-muted/60 rounded-xl px-6 py-4 shadow-sm border mb-6">
      {/* Time Range */}
      <TimeFilter
        value={filter.timeRange}
        onChange={(v: string) => setFilter({ timeRange: v as any })}
      />

      {/* Channel */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Share2 className="h-4 w-4 text-purple-600" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block">Channel</label>
          <Select value={filter.channel} onValueChange={v => setFilter({ channel: v })}>
            <SelectTrigger className="w-40 border-0 shadow-none p-0 h-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHANNELS.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Region */}
      <RegionFilter
        value={filter.region}
        onChange={(v: string) => setFilter({ region: v })}
      />

      {/* Vertical/Topic */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-50 rounded-lg">
          <Layers className="h-4 w-4 text-yellow-600" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block">Vertical</label>
          <Select value={filter.vertical} onValueChange={v => setFilter({ vertical: v })}>
            <SelectTrigger className="w-40 border-0 shadow-none p-0 h-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VERTICALS.map((v) => (
                <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Store ID */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-pink-50 rounded-lg">
          <Store className="h-4 w-4 text-pink-600" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block">Store ID</label>
          <input
            type="text"
            className="w-32 border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="All stores"
            value={filter.storeId}
            onChange={e => setFilter({ storeId: e.target.value })}
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        className="ml-auto px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition"
        onClick={resetFilter}
        type="button"
      >
        Reset
      </button>
    </div>
  );
} 