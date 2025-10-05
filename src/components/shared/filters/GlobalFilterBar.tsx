'use client';

import React from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function GlobalFilterBar() {
  return (
    <div className="flex items-center gap-3 w-full">
      <Select>
        <Select.Trigger className="w-48" aria-label="Time Range" />
        <Select.Content>
          <Select.Item value="7d">Last 7 days</Select.Item>
          <Select.Item value="30d">Last 30 days</Select.Item>
          <Select.Item value="90d">Last 90 days</Select.Item>
        </Select.Content>
      </Select>
      <Select>
        <Select.Trigger className="w-48" aria-label="Region" />
        <Select.Content>
          <Select.Item value="all">All Regions</Select.Item>
          <Select.Item value="na">North America</Select.Item>
          <Select.Item value="eu">Europe</Select.Item>
          <Select.Item value="apac">APAC</Select.Item>
        </Select.Content>
      </Select>
      <Button variant="outline">Apply</Button>
    </div>
  );
}

export default GlobalFilterBar;


