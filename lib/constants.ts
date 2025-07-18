export const CHART_COLORS = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  accent: 'var(--accent)',
  danger: 'var(--error)',
  warning: 'var(--warning)',
  success: 'var(--success)',
  info: 'var(--info)',
};

export const VELOCITY_COLORS = {
  Accelerating: 'text-success bg-success/10 border-success/30',
  Rising: 'text-primary bg-primary/10 border-primary/30',
  Steady: 'text-warning bg-warning/10 border-warning/30',
  Stable: 'text-muted bg-muted/10 border-muted/30',
};

export const SENTIMENT_COLORS = {
  positive: 'text-success bg-success/10',
  neutral: 'text-warning bg-warning/10',
  negative: 'text-error bg-error/10',
};

export const COMPETITION_COLORS = {
  Low: 'text-success bg-success/10',
  Medium: 'text-warning bg-warning/10',
  High: 'text-error bg-error/10',
};

export const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' },
  { id: 'shopee', name: 'Shopee', icon: '🛒' },
  { id: 'lazada', name: 'Lazada', icon: '🛍️' },
];

export const CATEGORIES = [
  'Fashion',
  'Technology',
  'Home',
  'Fitness',
  'Food',
  'Beauty',
  'Travel',
  'Education',
  'Entertainment',
  'Business',
];

export const TIME_RANGES = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
];

export const REGIONS = [
  { value: 'global', label: 'Global' },
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'Europe' },
  { value: 'asia', label: 'Asia Pacific' },
  { value: 'latam', label: 'Latin America' },
  { value: 'mena', label: 'Middle East & Africa' },
];