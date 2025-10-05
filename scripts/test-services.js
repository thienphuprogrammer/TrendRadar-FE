#!/usr/bin/env node

/**
 * Service Health Test Script
 * Tests all TrendRadar services and Wren AI integration
 */

const https = require('https');
const http = require('http');

// Service configuration
const services = {
  'API Gateway': 'http://localhost:8000',
  'Auth Service': 'http://localhost:8001',
  'Wren AI Service': 'http://localhost:5556',
  'Chatbot Service': 'http://localhost:8002',
  'Trend Service': 'http://localhost:8003',
  'Data Pipeline Service': 'http://localhost:8004',
  'Export Service': 'http://localhost:8005',
  'Notification Service': 'http://localhost:8006',
  'Wren UI': 'http://localhost:3001',
  'PostgreSQL': 'http://localhost:5432',
  'Redis': 'http://localhost:6379',
  'Qdrant': 'http://localhost:6333',
  'Wren Engine': 'http://localhost:7432',
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, timeout = 5000) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const request = client.get(url, { timeout }, (response) => {
      resolve({
        status: response.statusCode,
        healthy: response.statusCode >= 200 && response.statusCode < 400,
      });
    });

    request.on('error', (error) => {
      resolve({
        status: 'ERROR',
        healthy: false,
        error: error.message,
      });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({
        status: 'TIMEOUT',
        healthy: false,
        error: 'Request timeout',
      });
    });
  });
}

async function testService(name, url) {
  const startTime = Date.now();
  const result = await makeRequest(url);
  const duration = Date.now() - startTime;

  return {
    name,
    url,
    ...result,
    duration,
  };
}

async function testAllServices() {
  log('\n🔍 Testing TrendRadar Services...\n', 'bold');

  const results = [];
  const promises = Object.entries(services).map(([name, url]) => 
    testService(name, url)
  );

  const serviceResults = await Promise.all(promises);
  results.push(...serviceResults);

  // Display results
  log('📊 Service Health Report\n', 'bold');
  log('─'.repeat(80), 'blue');

  let healthyCount = 0;
  let totalCount = results.length;

  results.forEach((result) => {
    const status = result.healthy ? '✅ HEALTHY' : '❌ UNHEALTHY';
    const color = result.healthy ? 'green' : 'red';
    const duration = `${result.duration}ms`;

    log(`${status.padEnd(15)} ${result.name.padEnd(25)} ${result.url.padEnd(30)} ${duration.padStart(8)}`, color);
    
    if (!result.healthy && result.error) {
      log(`    └─ Error: ${result.error}`, 'red');
    }

    if (result.healthy) healthyCount++;
  });

  log('─'.repeat(80), 'blue');
  
  const healthPercentage = Math.round((healthyCount / totalCount) * 100);
  const healthColor = healthPercentage === 100 ? 'green' : healthPercentage >= 75 ? 'yellow' : 'red';
  
  log(`\n📈 Overall Health: ${healthyCount}/${totalCount} services (${healthPercentage}%)`, healthColor);

  // Wren AI specific tests
  log('\n🤖 Wren AI Integration Tests\n', 'bold');
  log('─'.repeat(50), 'blue');

  const wrenAIService = results.find(r => r.name === 'Wren AI Service');
  const wrenEngine = results.find(r => r.name === 'Wren Engine');
  const wrenUI = results.find(r => r.name === 'Wren UI');
  const qdrant = results.find(r => r.name === 'Qdrant');

  const wrenComponents = [
    { name: 'Wren AI Service', result: wrenAIService },
    { name: 'Wren Engine', result: wrenEngine },
    { name: 'Wren UI', result: wrenUI },
    { name: 'Qdrant Vector DB', result: qdrant },
  ];

  wrenComponents.forEach(({ name, result }) => {
    if (result) {
      const status = result.healthy ? '✅ READY' : '❌ NOT READY';
      const color = result.healthy ? 'green' : 'red';
      log(`${status.padEnd(12)} ${name}`, color);
    }
  });

  // Recommendations
  log('\n💡 Recommendations\n', 'bold');
  log('─'.repeat(30), 'blue');

  if (healthPercentage === 100) {
    log('🎉 All services are healthy! You can start using TrendRadar with Wren AI.', 'green');
  } else if (healthPercentage >= 75) {
    log('⚠️  Most services are healthy. Check the failed services above.', 'yellow');
  } else {
    log('🚨 Multiple services are down. Please check your Docker setup:', 'red');
    log('   1. Run: docker-compose -f ops/docker-compose.dev.yml up -d', 'blue');
    log('   2. Wait for services to start (may take 2-3 minutes)', 'blue');
    log('   3. Run this test again', 'blue');
  }

  // Next steps
  log('\n🚀 Next Steps\n', 'bold');
  log('─'.repeat(20), 'blue');
  log('1. Start the frontend: cd frontend && npm run dev', 'blue');
  log('2. Open http://localhost:3000', 'blue');
  log('3. Navigate to /wren-ai-demo to test integration', 'blue');
  log('4. Try /wren-ai for AI chat interface', 'blue');
  log('5. Use /data-setup to configure data sources', 'blue');

  return {
    total: totalCount,
    healthy: healthyCount,
    percentage: healthPercentage,
    results,
  };
}

// Run the test
if (require.main === module) {
  testAllServices()
    .then((summary) => {
      process.exit(summary.percentage === 100 ? 0 : 1);
    })
    .catch((error) => {
      log(`\n❌ Test failed: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { testAllServices, testService };
