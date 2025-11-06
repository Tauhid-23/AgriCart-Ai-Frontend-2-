// Mock data for AgriCart Ai frontend

// User Profile
export const mockUser = {
  name: 'Ahmed Rahman',
  email: 'ahmed@example.com',
  gardenType: 'balcony',
  level: 'Blooming Gardener',
  points: 1250,
  location: 'Dhaka, Bangladesh',
  avatar: 'AR'
};

// Sample Plants (6 plants)
export const mockPlants = [
  { id: 1, name: 'Basil', health: 95, status: 'healthy', image: '🌿', daysGrowing: 23, nextHarvest: 12, type: 'Herb' },
  { id: 2, name: 'Cherry Tomato', health: 88, status: 'healthy', image: '🍅', daysGrowing: 45, nextHarvest: 20, type: 'Vegetable' },
  { id: 3, name: 'Mint', health: 92, status: 'healthy', image: '🌱', daysGrowing: 18, nextHarvest: 5, type: 'Herb' },
  { id: 4, name: 'Chili Pepper', health: 78, status: 'attention', image: '🌶️', daysGrowing: 52, nextHarvest: 15, type: 'Vegetable' },
  { id: 5, name: 'Lettuce', health: 85, status: 'healthy', image: '🥬', daysGrowing: 28, nextHarvest: 8, type: 'Vegetable' },
  { id: 6, name: 'Coriander', health: 90, status: 'healthy', image: '🌿', daysGrowing: 15, nextHarvest: 18, type: 'Herb' }
];

// Sample Tasks (5 tasks)
export const mockTasks = [
  { id: 1, task: 'Water Basil', plant: 'Basil', time: 'Morning', status: 'pending', priority: 'high', dueDate: '2025-01-15' },
  { id: 2, task: 'Check Tomato Health', plant: 'Cherry Tomato', time: 'Morning', status: 'pending', priority: 'medium', dueDate: '2025-01-15' },
  { id: 3, task: 'Prune Mint', plant: 'Mint', time: 'Afternoon', status: 'completed', priority: 'low', dueDate: '2025-01-15' },
  { id: 4, task: 'Fertilize Chili', plant: 'Chili Pepper', time: 'Evening', status: 'pending', priority: 'medium', dueDate: '2025-01-15' },
  { id: 5, task: 'Add Support Stakes', plant: 'Tomato', time: 'Morning', status: 'pending', priority: 'high', dueDate: '2025-01-16' }
];

// Plant Database Data (sample 12 plants)
export const mockPlantDatabase = [
  { id: 1, name: 'Basil', type: 'Herb', difficulty: 'Easy', sunNeeds: 'Full Sun', water: 'Moderate', growthTime: '6-8 weeks', image: '🌿' },
  { id: 2, name: 'Mint', type: 'Herb', difficulty: 'Easy', sunNeeds: 'Partial Shade', water: 'High', growthTime: '4-6 weeks', image: '🌱' },
  { id: 3, name: 'Cherry Tomato', type: 'Vegetable', difficulty: 'Moderate', sunNeeds: 'Full Sun', water: 'High', growthTime: '60-80 days', image: '🍅' },
  { id: 4, name: 'Lettuce', type: 'Vegetable', difficulty: 'Easy', sunNeeds: 'Partial Shade', water: 'Moderate', growthTime: '30-45 days', image: '🥬' },
  { id: 5, name: 'Chili Pepper', type: 'Vegetable', difficulty: 'Moderate', sunNeeds: 'Full Sun', water: 'Moderate', growthTime: '70-90 days', image: '🌶️' },
  { id: 6, name: 'Coriander', type: 'Herb', difficulty: 'Easy', sunNeeds: 'Full Sun', water: 'Moderate', growthTime: '4-6 weeks', image: '🌿' },
  { id: 7, name: 'Cucumber', type: 'Vegetable', difficulty: 'Moderate', sunNeeds: 'Full Sun', water: 'High', growthTime: '50-70 days', image: '🥒' },
  { id: 8, name: 'Marigold', type: 'Flower', difficulty: 'Easy', sunNeeds: 'Full Sun', water: 'Low', growthTime: '45-50 days', image: '🌼' },
  { id: 9, name: 'Spinach', type: 'Vegetable', difficulty: 'Easy', sunNeeds: 'Partial Shade', water: 'Moderate', growthTime: '40-50 days', image: '🥬' },
  { id: 10, name: 'Green Bean', type: 'Vegetable', difficulty: 'Easy', sunNeeds: 'Full Sun', water: 'Moderate', growthTime: '50-60 days', image: '🫘' },
  { id: 11, name: 'Parsley', type: 'Herb', difficulty: 'Easy', sunNeeds: 'Partial Sun', water: 'Moderate', growthTime: '70-90 days', image: '🌿' },
  { id: 12, name: 'Radish', type: 'Vegetable', difficulty: 'Easy', sunNeeds: 'Full Sun', water: 'Low', growthTime: '20-30 days', image: '🔴' }
];

// Sample Community Posts (5 posts)
export const mockCommunityPosts = [
  { 
    id: 1, 
    author: 'Fatima Khan', 
    avatar: 'FK', 
    level: 'Master Gardener', 
    time: '2 hours ago', 
    title: 'How to protect balcony plants from strong winds?', 
    content: 'I recently started my balcony garden and noticed that strong winds are damaging my plants. What are some effective ways to create wind barriers without blocking sunlight? Looking for budget-friendly solutions.', 
    likes: 24, 
    replies: 12, 
    category: 'Balcony Gardens' 
  },
  { 
    id: 2, 
    author: 'Rahim Ahmed', 
    avatar: 'RA', 
    level: 'Sprouting', 
    time: '5 hours ago', 
    title: 'Success! My first tomato harvest', 
    content: 'After 75 days of care, I finally harvested my first cherry tomatoes! Got 2kg from a single plant. The key was consistent watering and weekly fertilizing. Thank you to this community for all the advice!', 
    likes: 56, 
    replies: 28, 
    category: 'Success Stories' 
  },
  { 
    id: 3, 
    author: 'Nadia Islam', 
    avatar: 'NI', 
    level: 'Blooming', 
    time: '1 day ago', 
    title: 'Yellow leaves on my basil - need help!', 
    content: 'My basil plant has been showing yellow leaves for the past week. The leaves start from the bottom and work their way up. I water it every other day and it gets morning sunlight. What could be causing this?', 
    likes: 18, 
    replies: 15, 
    category: 'Problems' 
  },
  { 
    id: 4, 
    author: 'Karim Hassan', 
    avatar: 'KH', 
    level: 'Expert', 
    time: '2 days ago', 
    title: 'DIY vertical garden setup for ৳500', 
    content: 'Just completed a 6-tier vertical garden using PVC pipes and plastic bottles. Total cost was only ৳500! Growing lettuce, spinach, and herbs. Can share the complete guide if anyone is interested.', 
    likes: 89, 
    replies: 45, 
    category: 'DIY Projects' 
  },
  { 
    id: 5, 
    author: 'Rashida Begum', 
    avatar: 'RB', 
    level: 'Master Gardener', 
    time: '3 days ago', 
    title: 'Monsoon preparation checklist for rooftop gardens', 
    content: 'With monsoon season approaching, here\'s my annual checklist: 1) Install proper drainage, 2) Secure lightweight containers, 3) Move sensitive plants under cover, 4) Check for pest buildup. What else would you add?', 
    likes: 67, 
    replies: 34, 
    category: 'Seasonal Tips' 
  }
];

// Weather Data
export const mockWeather = {
  temp: 32,
  condition: 'Sunny',
  wind: 15,
  humidity: 65,
  uvIndex: 8,
  alert: 'High sun exposure today - ensure adequate watering for all plants',
  forecast: [
    { day: 'Sat', temp: 33, condition: 'Sunny', icon: '☀️' },
    { day: 'Sun', temp: 31, condition: 'Partly Cloudy', icon: '⛅' },
    { day: 'Mon', temp: 29, condition: 'Rainy', icon: '🌧️' },
    { day: 'Tue', temp: 30, condition: 'Cloudy', icon: '☁️' },
    { day: 'Wed', temp: 32, condition: 'Sunny', icon: '☀️' }
  ]
};

// Notifications (4 items)
export const mockNotifications = [
  { id: 1, type: 'task', message: 'Water Basil - Due in 1 hour', time: '30 mins ago', read: false },
  { id: 2, type: 'alert', message: 'High temperatures expected today', time: '2 hours ago', read: false },
  { id: 3, type: 'community', message: 'Someone replied to your post', time: '5 hours ago', read: true },
  { id: 4, type: 'harvest', message: 'Mint ready for harvest!', time: '1 day ago', read: true }
];

// Blog Articles
export const mockBlogArticles = [
  {
    id: 1,
    title: "Complete Beginner's Guide to Balcony Gardening in Bangladesh",
    slug: "beginners-guide-balcony-gardening-bangladesh",
    excerpt: "Everything you need to know to start your first balcony garden in Bangladesh. From plant selection to monsoon protection.",
    content: "Starting your balcony garden in Bangladesh's unique climate...",
    author: "Dr. Sarah Ahmed",
    authorAvatar: "SA",
    authorBio: "Horticulture expert with 15 years experience in urban gardening",
    publishedDate: "2025-01-10",
    readTime: "8 min read",
    category: "Beginner Guides",
    featuredImage: "🌱",
    tags: ["beginner", "balcony", "bangladesh", "guide"]
  },
  {
    id: 2,
    title: "10 Easy Vegetables to Grow on Your Dhaka Rooftop",
    slug: "easy-vegetables-dhaka-rooftop",
    excerpt: "Discover the best vegetables that thrive in Dhaka's climate and can be easily grown on your rooftop garden.",
    content: "Dhaka's warm tropical climate is perfect for growing vegetables...",
    author: "Md. Karim Rahman",
    authorAvatar: "KR",
    authorBio: "Urban farming specialist and rooftop garden consultant",
    publishedDate: "2025-01-08",
    readTime: "6 min read",
    category: "Plant Care",
    featuredImage: "🍅",
    tags: ["vegetables", "rooftop", "dhaka", "easy"]
  },
  {
    id: 3,
    title: "How to Protect Your Balcony Garden from Dhaka's Monsoon Season",
    slug: "protect-balcony-garden-monsoon",
    excerpt: "Essential tips and techniques to protect your plants during Bangladesh's intense monsoon season.",
    content: "Bangladesh's monsoon season brings heavy rains and strong winds...",
    author: "Fatima Khatun",
    authorAvatar: "FK",
    authorBio: "Agricultural extension officer and monsoon gardening expert",
    publishedDate: "2025-01-05",
    readTime: "7 min read",
    category: "Seasonal Tips",
    featuredImage: "🌧️",
    tags: ["monsoon", "protection", "balcony", "seasonal"]
  }
];

// Testimonials
export const mockTestimonials = [
  {
    id: 1,
    name: "Fatima Khan",
    location: "Dhaka",
    gardenType: "Balcony Gardener",
    quote: "AgriCart Ai transformed my tiny balcony into a thriving herb garden. The AI diagnosis saved my basil plant!",
    rating: 5,
    plantsGrown: ["Basil", "Mint", "Coriander"],
    usingFor: "8 months"
  },
  {
    id: 2,
    name: "Rahim Ahmed",
    location: "Chittagong",
    gardenType: "Roof Gardener",
    quote: "I've harvested 15kg of tomatoes from my rooftop in 3 months. The weather alerts are incredibly helpful!",
    rating: 5,
    plantsGrown: ["Tomatoes", "Peppers", "Eggplant"],
    usingFor: "1 year"
  },
  {
    id: 3,
    name: "Nadia Islam",
    location: "Sylhet",
    gardenType: "Beginner",
    quote: "As a complete beginner, the step-by-step guidance made gardening so easy. Highly recommended!",
    rating: 5,
    plantsGrown: ["Lettuce", "Spinach", "Radish"],
    usingFor: "4 months"
  }
];

// Statistics
export const mockStats = {
  totalGardeners: "10,000+",
  plantsGrowing: "50,000+",
  averageRating: "4.8",
  successRate: "95%"
};

// Features
export const mockFeatures = [
  {
    id: 1,
    title: "AI-Powered Health Check",
    description: "Upload a photo and get instant diagnosis of diseases, pests, and nutrient deficiencies with 95% accuracy",
    icon: "🔍",
    category: "AI Diagnosis"
  },
  {
    id: 2,
    title: "Weather-Based Care Alerts",
    description: "Never forget watering again. Our AI adjusts reminders based on real-time weather and plant needs",
    icon: "🔔",
    category: "Smart Reminders"
  },
  {
    id: 3,
    title: "10,000+ Plant Library",
    description: "Browse plants perfect for Bangladesh climate with detailed care guides, difficulty ratings, and success rates",
    icon: "📚",
    category: "Plant Database"
  },
  {
    id: 4,
    title: "Expert Gardener Community",
    description: "Get help from 10,000+ experienced gardeners. Share photos, ask questions, and celebrate harvests together",
    icon: "👥",
    category: "Community"
  },
  {
    id: 5,
    title: "Track Your Garden Progress",
    description: "Monitor plant health, log harvests, and see beautiful charts of your gardening journey over time",
    icon: "📊",
    category: "Analytics"
  },
  {
    id: 6,
    title: "Bangladesh Weather Alerts",
    description: "Get hyperlocal weather forecasts and AI-generated gardening recommendations specific to your area",
    icon: "☀️",
    category: "Weather"
  }
];

// Pricing Plans
export const mockPricingPlans = [
  {
    id: 1,
    name: "FREE",
    price: 0,
    currency: "৳",
    period: "month",
    badge: "Perfect for Beginners",
    features: [
      "Up to 5 plants",
      "Basic care reminders",
      "Community access",
      "Plant database",
      "Weather alerts",
      "Mobile app access"
    ],
    cta: "Get Started Free",
    note: "No credit card required",
    popular: false
  },
  {
    id: 2,
    name: "PRO",
    price: 299,
    originalPrice: 349,
    currency: "৳",
    period: "month",
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "Unlimited plants",
      "AI plant diagnosis (unlimited)",
      "Advanced analytics",
      "Priority support",
      "Ad-free experience",
      "Harvest tracking",
      "Export data"
    ],
    cta: "Start 14-Day Free Trial",
    note: "Cancel anytime",
    popular: true
  },
  {
    id: 3,
    name: "EXPERT",
    price: 599,
    currency: "৳",
    period: "month",
    badge: "For Serious Gardeners",
    features: [
      "Everything in Pro",
      "1-on-1 expert consultations (2/month)",
      "Custom garden plans",
      "Exclusive workshops",
      "Early feature access",
      "Team collaboration (5 users)",
      "API access"
    ],
    cta: "Contact Sales",
    note: "",
    popular: false
  }
];

export default {
  mockUser,
  mockPlants,
  mockTasks,
  mockPlantDatabase,
  mockCommunityPosts,
  mockWeather,
  mockNotifications,
  mockBlogArticles,
  mockTestimonials,
  mockStats,
  mockFeatures,
  mockPricingPlans
};