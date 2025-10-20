import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface SeedUser {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'account_owner' | 'analyst' | 'viewer';
  company: string;
  department: string;
}

export const seedUsers: SeedUser[] = [
  {
    email: 'admin@trendradar.com',
    password: 'admin123',
    full_name: 'Admin User',
    role: 'admin',
    company: 'TrendRadar Hub',
    department: 'Engineering',
  },
  {
    email: 'owner@company.com',
    password: 'owner123',
    full_name: 'Account Owner',
    role: 'account_owner',
    company: 'TechCorp Inc',
    department: 'Management',
  },
  {
    email: 'analyst@company.com',
    password: 'analyst123',
    full_name: 'Data Analyst',
    role: 'analyst',
    company: 'TechCorp Inc',
    department: 'Analytics',
  },
  {
    email: 'viewer@company.com',
    password: 'viewer123',
    full_name: 'Business Viewer',
    role: 'viewer',
    company: 'TechCorp Inc',
    department: 'Sales',
  },
];

export const seedTrends = [
  {
    hashtag: '#SustainableFashion',
    rank: 1,
    volume: '2.4M',
    growth: '+245%',
    sentiment: 'positive',
    price_range: '$45-85',
    engagement: '8.4%',
    velocity: 'Accelerating',
    platforms: ['TikTok', 'Instagram', 'Twitter'],
    peak_hours: '2-4 PM',
    demographics: '18-34',
    competition: 'Medium',
    category: 'Fashion',
  },
  {
    hashtag: '#TechGadgets2024',
    rank: 2,
    volume: '1.8M',
    growth: '+189%',
    sentiment: 'positive',
    price_range: '$120-450',
    engagement: '6.2%',
    velocity: 'Rising',
    platforms: ['TikTok', 'YouTube'],
    peak_hours: '7-9 PM',
    demographics: '25-45',
    competition: 'High',
    category: 'Technology',
  },
  {
    hashtag: '#HomeDecor',
    rank: 3,
    volume: '1.5M',
    growth: '+156%',
    sentiment: 'neutral',
    price_range: '$25-200',
    engagement: '5.8%',
    velocity: 'Steady',
    platforms: ['Instagram', 'Pinterest'],
    peak_hours: '10-12 PM',
    demographics: '28-50',
    competition: 'Medium',
    category: 'Home',
  },
  {
    hashtag: '#FitnessMotivation',
    rank: 4,
    volume: '1.2M',
    growth: '+134%',
    sentiment: 'positive',
    price_range: '$15-80',
    engagement: '7.1%',
    velocity: 'Rising',
    platforms: ['TikTok', 'Instagram'],
    peak_hours: '6-8 AM',
    demographics: '20-40',
    competition: 'Low',
    category: 'Fitness',
  },
  {
    hashtag: '#FoodieLife',
    rank: 5,
    volume: '980K',
    growth: '+112%',
    sentiment: 'positive',
    price_range: '$8-45',
    engagement: '4.9%',
    velocity: 'Stable',
    platforms: ['Instagram', 'TikTok'],
    peak_hours: '12-2 PM',
    demographics: '22-45',
    competition: 'High',
    category: 'Food',
  },
];

export const seedKPIs = [
  {
    name: 'Total Revenue',
    value: 1250000,
    previous_value: 1100000,
    change_percentage: 13.6,
    unit: 'USD',
    category: 'Financial',
  },
  {
    name: 'Active Users',
    value: 8540,
    previous_value: 7890,
    change_percentage: 8.2,
    unit: 'users',
    category: 'Engagement',
  },
  {
    name: 'Conversion Rate',
    value: 6.8,
    previous_value: 5.9,
    change_percentage: 15.3,
    unit: '%',
    category: 'Performance',
  },
  {
    name: 'Customer Satisfaction',
    value: 4.7,
    previous_value: 4.5,
    change_percentage: 4.4,
    unit: '/5',
    category: 'Quality',
  },
  {
    name: 'Avg Order Value',
    value: 145.50,
    previous_value: 138.20,
    change_percentage: 5.3,
    unit: 'USD',
    category: 'Financial',
  },
  {
    name: 'Engagement Rate',
    value: 76.5,
    previous_value: 72.1,
    change_percentage: 6.1,
    unit: '%',
    category: 'Engagement',
  },
];

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Seed Trends
    console.log('📈 Seeding trends...');
    for (const trend of seedTrends) {
      const { error } = await supabase.from('trends').upsert(trend, {
        onConflict: 'hashtag',
      });

      if (error) {
        console.error('Error seeding trend:', error);
      }
    }
    console.log('✅ Trends seeded successfully');

    // Seed KPIs
    console.log('📊 Seeding KPIs...');
    for (const kpi of seedKPIs) {
      const { error } = await supabase.from('kpis').insert(kpi);

      if (error && !error.message.includes('duplicate')) {
        console.error('Error seeding KPI:', error);
      }
    }
    console.log('✅ KPIs seeded successfully');

    console.log('🎉 Database seeding completed!');
    console.log('\n📝 Test Users:');
    seedUsers.forEach(user => {
      console.log(`   ${user.role}: ${user.email} / ${user.password}`);
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
