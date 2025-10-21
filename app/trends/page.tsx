'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { TrendService, TrendAnalysis } from '@/lib/services/trendService';
import { TrendData } from '@/types';
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  Hash, 
  DollarSign,
  Users,
  BarChart3,
  Target,
  MessageCircle,
  Store,
  Bot,
  Sparkles,
  ArrowUpRight,
  Clock,
  Eye,
  Heart,
  Share2,
  Zap,
  Globe,
  Calendar,
  RefreshCw,
  Star
} from 'lucide-react';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const initialTrendingHashtags: TrendData[] = [
  { 
    hashtag: '#SustainableFashion', 
    rank: 1, 
    volume: '2.4M', 
    growth: '+245%', 
    sentiment: 'positive', 
    price: '$45-85',
    engagement: '8.4%',
    velocity: 'Accelerating',
    platforms: ['TikTok', 'Instagram', 'Twitter'],
    peakHours: '2-4 PM',
    demographics: '18-34',
    competition: 'Medium',
    category: 'Fashion'
  },
  { 
    hashtag: '#TechGadgets2024', 
    rank: 2, 
    volume: '1.8M', 
    growth: '+189%', 
    sentiment: 'positive', 
    price: '$120-450',
    engagement: '6.2%',
    velocity: 'Rising',
    platforms: ['TikTok', 'YouTube'],
    peakHours: '7-9 PM',
    demographics: '25-45',
    competition: 'High',
    category: 'Technology'
  },
  { 
    hashtag: '#HomeDecor', 
    rank: 3, 
    volume: '1.5M', 
    growth: '+156%', 
    sentiment: 'neutral', 
    price: '$25-200',
    engagement: '5.8%',
    velocity: 'Steady',
    platforms: ['Instagram', 'Pinterest'],
    peakHours: '10-12 PM',
    demographics: '28-50',
    competition: 'Medium',
    category: 'Home'
  },
  { 
    hashtag: '#FitnessMotivation', 
    rank: 4, 
    volume: '1.2M', 
    growth: '+134%', 
    sentiment: 'positive', 
    price: '$15-80',
    engagement: '7.1%',
    velocity: 'Rising',
    platforms: ['TikTok', 'Instagram'],
    peakHours: '6-8 AM',
    demographics: '20-40',
    competition: 'Low',
    category: 'Fitness'
  },
  { 
    hashtag: '#FoodieLife', 
    rank: 5, 
    volume: '980K', 
    growth: '+112%', 
    sentiment: 'positive', 
    price: '$8-45',
    engagement: '4.9%',
    velocity: 'Stable',
    platforms: ['Instagram', 'TikTok'],
    peakHours: '12-2 PM',
    demographics: '22-45',
    competition: 'High',
    category: 'Food'
  },
];

const competitorData = [
  { 
    name: 'BrandA', 
    marketShare: '23%', 
    avgPrice: '$67', 
    sentiment: 'positive', 
    trend: '+12%',
    engagement: '6.8%',
    followers: '2.4M',
    postFrequency: '3x/day'
  },
  { 
    name: 'BrandB', 
    marketShare: '18%', 
    avgPrice: '$89', 
    sentiment: 'neutral', 
    trend: '+8%',
    engagement: '5.2%',
    followers: '1.8M',
    postFrequency: '2x/day'
  },
  { 
    name: 'BrandC', 
    marketShare: '15%', 
    avgPrice: '$45', 
    sentiment: 'positive', 
    trend: '+15%',
    engagement: '7.3%',
    followers: '1.2M',
    postFrequency: '4x/day'
  },
  { 
    name: 'BrandD', 
    marketShare: '12%', 
    avgPrice: '$78', 
    sentiment: 'negative', 
    trend: '-3%',
    engagement: '3.9%',
    followers: '980K',
    postFrequency: '1x/day'
  },
];

const stores = [
  { id: 'all', name: 'All Stores', count: 15 },
  { id: 'store1', name: 'Fashion Store A', count: 5 },
  { id: 'store2', name: 'Tech Store B', count: 3 },
  { id: 'store3', name: 'Home Store C', count: 4 },
  { id: 'store4', name: 'Food Store D', count: 3 },
];

const sampleChatbotQuestions = [
  "What's trending in sustainable fashion right now?",
  "Show me competitor analysis for tech products",
  "Which hashtags have the highest ROI potential?",
  "Compare engagement rates across platforms",
  "What's the sentiment analysis for #HomeDecor?",
  "Forecast trending topics for next month"
];

const forecastData = [
  {
    hashtag: '#BackToSchool2024',
    currentRank: 'Not Trending',
    predictedRank: 3,
    confidence: '89%',
    timeframe: '2-3 weeks',
    category: 'Education',
    opportunity: 'High'
  },
  {
    hashtag: '#SummerVibes',
    currentRank: 8,
    predictedRank: 15,
    confidence: '76%',
    timeframe: '1-2 weeks',
    category: 'Lifestyle',
    opportunity: 'Low'
  },
  {
    hashtag: '#EcoFriendly',
    currentRank: 12,
    predictedRank: 5,
    confidence: '92%',
    timeframe: '3-4 weeks',
    category: 'Sustainability',
    opportunity: 'Very High'
  }
];

export default function TrendExplorer() {
  const { permissions } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [storeFilter, setStoreFilter] = useState('all');
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);
  const [trendingHashtags, setTrendingHashtags] = useState<TrendData[]>(initialTrendingHashtags);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<TrendAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const trendService = TrendService.getInstance();

  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case 'Accelerating': return 'text-green-600 bg-green-50 border-green-200';
      case 'Rising': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Steady': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Stable': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'neutral': return 'text-yellow-600 bg-yellow-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleRefreshTrends = async () => {
    setIsRefreshing(true);
    try {
      const freshTrends = await trendService.refreshTrends();
      setTrendingHashtags(freshTrends);
    } catch (error) {
      console.error('Failed to refresh trends:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAnalyzeTrend = async (hashtag: string) => {
    setIsAnalyzing(true);
    setShowAnalysis(true);
    try {
      const analysis = await trendService.analyzeTrend(hashtag);
      setCurrentAnalysis(analysis);
    } catch (error) {
      console.error('Failed to analyze trend:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTargetTrend = async (hashtag: string) => {
    try {
      await trendService.targetTrend(hashtag);
    } catch (error) {
      console.error('Failed to target trend:', error);
    }
  };

  const handleGenerateContent = async (hashtag: string) => {
    try {
      const content = await trendService.generateContent(hashtag, 'TikTok');
      console.log('Generated content:', content);
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  const handleExportTrends = async () => {
    try {
      await trendService.exportTrendData(filteredHashtags, 'excel');
    } catch (error) {
      console.error('Failed to export trends:', error);
    }
  };

  const filteredHashtags = trendingHashtags.filter(hashtag => {
    const matchesSearch = hashtag.hashtag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || hashtag.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Add intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filters with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 border-none shadow-lg bg-gradient-to-r from-background to-background/80 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search hashtags, products, or keywords..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <Select value={storeFilter} onValueChange={setStoreFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{store.name}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {store.count}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleRefreshTrends} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              {permissions.canExport && (
                <Button variant="outline" onClick={handleExportTrends}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
              
              {/* Enhanced Ask Chatbot Button */}
              <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                    <Bot className="h-4 w-4 mr-2" />
                    Ask AI Analyst
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      Ask AI Trend Analyst
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-3">
                        Get instant insights with natural language queries. Try these examples:
                      </p>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {sampleChatbotQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start h-auto p-3 whitespace-normal hover:bg-primary/5"
                          onClick={() => {
                            setShowChatbot(false);
                            window.location.href = `/chatbot?q=${encodeURIComponent(question)}`;
                          }}
                        >
                          <MessageCircle className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5" />
                          {question}
                        </Button>
                      ))}
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setShowChatbot(false);
                        window.location.href = '/chatbot';
                      }}
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Open Full AI Analyst
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
      </motion.div>

      <Tabs defaultValue="hashtags" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/30 rounded-xl gap-1">
          <TabsTrigger value="hashtags" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Hash className="h-4 w-4 mr-2" />
            Trending Hashtags
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Store className="h-4 w-4 mr-2" />
            Product Rankings
          </TabsTrigger>
          <TabsTrigger value="competitors" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4 mr-2" />
            Competitor Analysis
          </TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Forecast
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hashtags" className="space-y-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-4"
          >
            {filteredHashtags.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-primary/50 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between relative">
                      {/* Enhanced Rank Badge */}
                      <div className="absolute -top-6 -left-6 h-16 w-16 bg-gradient-to-br from-primary to-blue-600 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                        <div className="absolute inset-0 flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                          <span className="text-white text-lg font-bold">#{item.rank}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 flex-1 pl-12">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{item.hashtag}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getVelocityColor(item.velocity)} group-hover:scale-105 transition-transform`}>
                              {item.velocity}
                            </div>
                          </div>
                          
                          {/* Enhanced Metrics Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="p-2 rounded-lg bg-muted/30 group-hover:bg-primary/5 transition-colors">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div>
                                  <div className="text-sm font-medium">{item.volume}</div>
                                  <div className="text-xs text-muted-foreground">Posts</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/30 group-hover:bg-primary/5 transition-colors">
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div>
                                  <div className="text-sm font-medium">{item.engagement}</div>
                                  <div className="text-xs text-muted-foreground">Engagement</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/30 group-hover:bg-primary/5 transition-colors">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div>
                                  <div className="text-sm font-medium">{item.peakHours}</div>
                                  <div className="text-xs text-muted-foreground">Peak Hours</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/30 group-hover:bg-primary/5 transition-colors">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div>
                                  <div className="text-sm font-medium">{item.price}</div>
                                  <div className="text-xs text-muted-foreground">Price Range</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Platform Badges */}
                          <div className="flex items-center gap-2 mb-3">
                            {item.platforms.map((platform) => (
                              <Badge 
                                key={platform} 
                                variant="secondary" 
                                className="text-xs group-hover:bg-primary group-hover:text-white transition-colors"
                              >
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Action Buttons */}
                      <div className="flex flex-col items-end gap-3">
                        <Badge variant="outline" className="text-green-600 font-semibold group-hover:bg-green-50 transition-colors">
                          {item.growth}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.sentiment)} group-hover:scale-105 transition-transform`}>
                            {item.sentiment}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionColor(item.competition)} group-hover:scale-105 transition-transform`}>
                            {item.competition} Competition
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAnalyzeTrend(item.hashtag)}
                            className="group-hover:bg-primary group-hover:text-white transition-colors"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analyze
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleTargetTrend(item.hashtag)}
                            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Target
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="h-10" />
          </motion.div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                        #{rank}
                      </div>
                      <div>
                        <h4 className="font-medium">Eco-Friendly Product {rank}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Sustainable Fashion</span>
                          <span>•</span>
                          <span>Brand {String.fromCharCode(64 + rank)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {(Math.random() * 10 + 5).toFixed(1)}% engagement
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">${Math.floor(Math.random() * 100) + 20}</p>
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +{Math.floor(Math.random() * 50) + 10}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {competitorData.map((competitor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      {competitor.name}
                    </CardTitle>
                    <Badge variant={competitor.trend.startsWith('+') ? 'default' : 'destructive'}>
                      {competitor.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Market Share</span>
                          <span className="font-medium">{competitor.marketShare}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg Price</span>
                          <span className="font-medium">{competitor.avgPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Engagement</span>
                          <span className="font-medium">{competitor.engagement}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Followers</span>
                          <span className="font-medium">{competitor.followers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Post Frequency</span>
                          <span className="font-medium">{competitor.postFrequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Sentiment</span>
                          <Badge 
                            variant={competitor.sentiment === 'positive' ? 'default' : 
                                    competitor.sentiment === 'neutral' ? 'secondary' : 'destructive'}
                            className="capitalize text-xs"
                          >
                            {competitor.sentiment}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        View Detailed Analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Powered 4-Week Trend Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecastData.map((forecast, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{forecast.hashtag}</h4>
                        <Badge variant="outline" className="text-xs">
                          {forecast.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={forecast.opportunity === 'Very High' ? 'default' : 
                                  forecast.opportunity === 'High' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {forecast.opportunity} Opportunity
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Rank</span>
                        <div className="font-medium">{forecast.currentRank}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Predicted Rank</span>
                        <div className="font-medium text-primary">#{forecast.predictedRank}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence</span>
                        <div className="font-medium text-green-600">{forecast.confidence}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timeframe</span>
                        <div className="font-medium">{forecast.timeframe}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">AI Insights</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on historical data, current momentum, and external factors, our AI predicts significant opportunities in sustainability and education-related content over the next month.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Analysis Modal */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <span>Trend Analysis: {currentAnalysis?.hashtag}</span>
            </DialogTitle>
          </DialogHeader>
          
          {isAnalyzing ? (
            <motion.div 
              className="flex items-center justify-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <div className="relative h-16 w-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
                <p className="text-muted-foreground">Analyzing trend data...</p>
              </div>
            </motion.div>
          ) : currentAnalysis && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Market Analysis */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{currentAnalysis.marketAnalysis.totalVolume.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+{currentAnalysis.marketAnalysis.growthRate}%</div>
                  <div className="text-sm text-muted-foreground">Growth Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{currentAnalysis.marketAnalysis.competitorCount}</div>
                  <div className="text-sm text-muted-foreground">Competitors</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">${currentAnalysis.marketAnalysis.avgPrice}</div>
                  <div className="text-sm text-muted-foreground">Avg Price</div>
                </div>
              </div>

              {/* Content Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Best Times to Post</h4>
                      <div className="flex gap-2">
                        {currentAnalysis.contentStrategy.bestTimes.map((time, index) => (
                          <Badge key={index} variant="outline">{time}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recommended Formats</h4>
                      <div className="flex gap-2">
                        {currentAnalysis.contentStrategy.recommendedFormats.map((format, index) => (
                          <Badge key={index} variant="secondary">{format}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Forecast</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Next Week Growth</span>
                      <span className="font-semibold text-green-600">+{currentAnalysis.forecast.nextWeek}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Month Growth</span>
                      <span className="font-semibold text-blue-600">+{currentAnalysis.forecast.nextMonth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence Level</span>
                      <span className="font-semibold">{currentAnalysis.forecast.confidence}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={() => handleTargetTrend(currentAnalysis.hashtag)}>
                  <Target className="h-4 w-4 mr-2" />
                  Target This Trend
                </Button>
                <Button variant="outline" onClick={() => handleGenerateContent(currentAnalysis.hashtag)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </Button>
                <Button variant="outline" onClick={() => setShowAnalysis(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}