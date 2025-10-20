import {
  BarChart3,
  TrendingUp,
  Zap,
  Bot,
  Database,
  Video,
  FileText,
  Bell,
} from 'lucide-react';

export const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Dashboard',
    description: 'Monitor KPIs and business metrics in real-time with interactive visualizations and customizable widgets.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Trend Explorer',
    description: 'Discover emerging trends, analyze market sentiment, and identify opportunities before your competition.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Bot,
    title: 'AI Chatbot Analyst',
    description: 'Ask questions in natural language and get instant insights powered by advanced AI algorithms.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'Action Center',
    description: 'AI-powered recommendations for product imports, content generation, and automation workflows.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Database,
    title: 'Self-Service Data Lab',
    description: 'Upload your data, get AI-powered chart suggestions, and build custom visualizations without coding.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Video,
    title: 'Content Studio',
    description: 'Generate engaging social media content with AI, schedule posts, and run A/B tests effortlessly.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: FileText,
    title: 'Automated Reports',
    description: 'Create beautiful reports in PDF, Excel, or PowerPoint. Schedule automated delivery to stakeholders.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get real-time alerts on trends, threshold breaches, and important events across all channels.',
    color: 'from-yellow-500 to-orange-500',
  },
];

export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individuals getting started',
    features: [
      '1 user account',
      'Basic dashboard & trends',
      '10 reports per month',
      '1 GB data storage',
      'Email support',
      'Community access',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'per month',
    description: 'For growing teams and businesses',
    features: [
      '5 user accounts',
      'Advanced analytics & AI',
      'Unlimited reports',
      '50 GB data storage',
      'Priority email & chat support',
      'API access',
      'Custom integrations',
      'White-label reports',
    ],
    cta: 'Start 14-day Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact sales',
    description: 'For large organizations with specific needs',
    features: [
      'Unlimited users',
      'Dedicated AI models',
      'Unlimited everything',
      'Dedicated infrastructure',
      '24/7 phone & email support',
      'Custom development',
      'SLA guarantees',
      'Training & onboarding',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'VP of Marketing',
    company: 'TechFlow Inc',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    content: 'TrendRadar Hub transformed how we make decisions. The AI insights are incredibly accurate and have helped us stay ahead of market trends consistently.',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Data Director',
    company: 'E-commerce Giants',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    content: 'The automated reporting feature alone has saved our team 20 hours per week. The ROI was evident within the first month of using TrendRadar Hub.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'CEO',
    company: 'StartupX',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    content: 'As a startup, having enterprise-level BI at an affordable price point is game-changing. The self-service Data Lab empowers our entire team to make data-driven decisions.',
    rating: 5,
  },
];

export const faqs = [
  {
    question: 'How does the AI-powered analysis work?',
    answer: 'Our AI analyzes millions of data points from social media, e-commerce platforms, and your custom data sources to identify trends, patterns, and opportunities. The system uses advanced machine learning algorithms to provide actionable insights in real-time.',
  },
  {
    question: 'Can I integrate with my existing tools?',
    answer: 'Yes! TrendRadar Hub integrates with popular platforms like TikTok, Shopee, Instagram, Facebook, Google Analytics, and more. We also provide a comprehensive API for custom integrations.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'Free plan includes email support. Pro plan includes priority email and chat support. Enterprise customers get 24/7 phone and email support, dedicated account manager, and custom SLA guarantees.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use enterprise-grade encryption, comply with GDPR and SOC 2 standards, and store data in secure, redundant data centers. Your data is never shared with third parties.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees. Your data remains accessible for 30 days after cancellation.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! Our Pro plan comes with a 14-day free trial. No credit card required. You can upgrade or downgrade at any time based on your needs.',
  },
];
