import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Camera, Upload, CheckCircle, Loader2, ShoppingCart, X, Lock, Phone, Mail, MapPin, AlertCircle, Sprout, Sun, Droplets, Home, TreePine, Calendar, Thermometer, MapPinIcon } from 'lucide-react';
import { plantAPI, quoteAPI } from '../../services/api';
import api from '../../services/api';
import { lazyLoadImage, cleanupObjectUrl } from '../../services/imageOptimizer';
import { useAuth } from '../../context/AuthContext';

// Helper: Get common plant names
const getCommonPlantName = (scientificName) => {
  const nameMap = {
    'zingiber officinale': 'Ginger (আদা)',
    'solanum lycopersicum': 'Tomato (টমেটো)',
    'solanum melongena': 'Eggplant (বেগুন)',
    'capsicum annuum': 'Chili Pepper (মরিচ)',
    'ocimum basilicum': 'Basil (তুলসী)',
    'mentha': 'Mint (পুদিনা)',
    'coriandrum sativum': 'Cilantro (ধনে পাতা)',
    'curcuma longa': 'Turmeric (হলুদ)',
    'allium cepa': 'Onion (পেঁয়াজ)',
    'allium sativum': 'Garlic (রসুন)',
    'cucumis sativus': 'Cucumber (শসা)',
    'momordica charantia': 'Bitter Gourd (করলা)',
    'rosa': 'Rose (গোলাপ)',
    'hibiscus': 'Hibiscus (জবা)',
    'mangifera indica': 'Mango (আম)'
  };

  const lowerName = (scientificName || '').toLowerCase();
  
  for (const [key, value] of Object.entries(nameMap)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }
  
  // Fallback: capitalize first word
  return scientificName?.split(' ')[0] || 'Unknown Plant';
};

// Helper: Get plant icon based on plant name
const getPlantIcon = (plantName) => {
  const plantNameLower = plantName.toLowerCase();
  
  if (plantNameLower.includes('ginger') || plantNameLower.includes('ada')) {
    return '🌿';
  } else if (plantNameLower.includes('tomato') || plantNameLower.includes('tomato')) {
    return '🍅';
  } else if (plantNameLower.includes('eggplant') || plantNameLower.includes('begun')) {
    return '🍆';
  } else if (plantNameLower.includes('chili') || plantNameLower.includes('morich')) {
    return '🌶️';
  } else if (plantNameLower.includes('basil') || plantNameLower.includes('tulsi')) {
    return '🌱';
  } else if (plantNameLower.includes('mint') || plantNameLower.includes('pudina')) {
    return '🍃';
  } else if (plantNameLower.includes('cilantro') || plantNameLower.includes('dhane')) {
    return '🌿';
  } else if (plantNameLower.includes('turmeric') || plantNameLower.includes('halud')) {
    return '🌿';
  } else if (plantNameLower.includes('onion') || plantNameLower.includes('peyaj')) {
    return '🧅';
  } else if (plantNameLower.includes('garlic') || plantNameLower.includes('rosun')) {
    return '🧄';
  } else if (plantNameLower.includes('cucumber') || plantNameLower.includes('shosha')) {
    return '🥒';
  } else if (plantNameLower.includes('bitter') || plantNameLower.includes('korea')) {
    return '🥒';
  } else if (plantNameLower.includes('rose') || plantNameLower.includes('golap')) {
    return '🌹';
  } else if (plantNameLower.includes('hibiscus') || plantNameLower.includes('jaba')) {
    return '🌺';
  } else if (plantNameLower.includes('mango') || plantNameLower.includes('am')) {
    return '🥭';
  } else if (plantNameLower.includes('tree')) {
    return '🌳';
  } else if (plantNameLower.includes('flower')) {
    return '🌸';
  } else if (plantNameLower.includes('vegetable')) {
    return '🥬';
  } else if (plantNameLower.includes('herb')) {
    return '🌿';
  } else {
    return '🌱';
  }
};

// Helper: Get planting prerequisites
const getPlantingPrerequisites = (plant) => {
  const prerequisites = [];
  
  // Sunlight requirement
  if (plant.sunlight) {
    prerequisites.push({
      icon: <Sun className="h-4 w-4" />,
      text: `Sunlight: ${plant.sunlight}`
    });
  } else if (plant.sunNeeds) {
    prerequisites.push({
      icon: <Sun className="h-4 w-4" />,
      text: `Sunlight: ${plant.sunNeeds}`
    });
  }
  
  // Watering requirement
  if (plant.watering) {
    prerequisites.push({
      icon: <Droplets className="h-4 w-4" />,
      text: `Water: ${plant.watering}`
    });
  } else if (plant.waterNeeds) {
    prerequisites.push({
      icon: <Droplets className="h-4 w-4" />,
      text: `Water: ${plant.waterNeeds}`
    });
  }
  
  // Location/growing place
  if (plant.type) {
    let locationText = '';
    if (plant.type.toLowerCase().includes('indoor')) {
      locationText = 'Indoor planting';
    } else if (plant.type.toLowerCase().includes('outdoor')) {
      locationText = 'Outdoor planting';
    } else if (plant.type.toLowerCase().includes('container') || plant.type.toLowerCase().includes('pot')) {
      locationText = 'Container gardening';
    } else if (plant.type.toLowerCase().includes('garden')) {
      locationText = 'Garden planting';
    } else {
      locationText = `${plant.type} planting`;
    }
    
    prerequisites.push({
      icon: <Home className="h-4 w-4" />,
      text: locationText
    });
  }
  
  // Growth time if available
  if (plant.cycle) {
    prerequisites.push({
      icon: <TreePine className="h-4 w-4" />,
      text: `Growth cycle: ${plant.cycle}`
    });
  }
  
  return prerequisites;
};

// Helper: Get comprehensive plant suitability info
const getPlantSuitabilityInfo = (plant) => {
  const info = [];
  
  // Difficulty level
  if (plant.difficulty) {
    let difficultyText = '';
    let difficultyColor = '';
    switch (plant.difficulty.toLowerCase()) {
      case 'easy':
        difficultyText = 'Beginner friendly';
        difficultyColor = 'text-green-600';
        break;
      case 'moderate':
        difficultyText = 'Intermediate level';
        difficultyColor = 'text-yellow-600';
        break;
      case 'hard':
        difficultyText = 'Advanced gardener';
        difficultyColor = 'text-red-600';
        break;
      default:
        difficultyText = plant.difficulty;
        difficultyColor = 'text-gray-600';
    }
    info.push({
      icon: <Sprout className="h-4 w-4" />,
      text: difficultyText,
      color: difficultyColor
    });
  }
  
  // Season information
  if (plant.season) {
    info.push({
      icon: <Calendar className="h-4 w-4" />,
      text: `Best season: ${plant.season}`,
      color: 'text-blue-600'
    });
  }
  
  // Temperature preference
  if (plant.temperature) {
    info.push({
      icon: <Thermometer className="h-4 w-4" />,
      text: `Temp: ${plant.temperature}`,
      color: 'text-orange-600'
    });
  }
  
  // Space requirement
  if (plant.space) {
    info.push({
      icon: <MapPinIcon className="h-4 w-4" />,
      text: `Space: ${plant.space}`,
      color: 'text-purple-600'
    });
  }
  
  return info;
};

// Compress image before uploading
const compressImage = (file, maxWidth = 800) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if image is too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression (0.7 quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        
        console.log('📉 Image compressed:');
        console.log('   Original:', event.target.result.length, 'bytes');
        console.log('   Compressed:', compressedBase64.length, 'bytes');
        console.log('   Reduction:', Math.round((1 - compressedBase64.length / event.target.result.length) * 100) + '%');
        
        resolve(compressedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const PlantDatabase = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const imageRefs = useRef([]);

  const [plants, setPlants] = useState([]);
  const [suggestedPlants, setSuggestedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  
  // AI Scanner states
  const [activeTab, setActiveTab] = useState('browse');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResults, setScanResults] = useState(null);

  // Add new state variables for camera preview
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraPreview, setCameraPreview] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCameraPreview, setShowCameraPreview] = useState(false);

  // Add state for description toggle
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Shopping modal states
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  
  // Contact form states
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    division: '',
    district: '',
    area: '',
    address: '',
    contactMethod: 'WhatsApp',
    email: '',
    postalCode: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');

  // Commonly grown plants in Bangladesh
  const commonBangladeshPlants = [
    {
      id: 'basil',
      name: 'Basil (তুলসী)',
      scientificName: 'Ocimum basilicum',
      type: 'Herb',
      difficulty: 'Easy',
      sunNeeds: 'Full Sun',
      water: 'Moderate',
      growthTime: '4-6 weeks',
      image: '🌿',
      description: 'Sweet basil is a popular herb in Bangladeshi cuisine. It grows well in containers and requires regular pruning to encourage growth.',
      careTips: [
        'Place in full sun for optimal growth',
        'Water moderately - check soil moisture regularly',
        'Pinch flower buds to encourage leaf growth'
      ],
      commonPests: ['Aphids', 'Spider mites', 'Whiteflies'],
      harvestTips: 'Harvest leaves regularly to encourage new growth. For best flavor, harvest in the morning.',
      plantingSeason: 'Year-round (best in cooler months)',
      spacing: '12 inches apart',
      soilType: 'Well-draining, fertile soil with pH 6.0-7.0'
    },
    {
      id: 'mint',
      name: 'Mint (পুদিনা)',
      scientificName: 'Mentha',
      type: 'Herb',
      difficulty: 'Easy',
      sunNeeds: 'Partial Shade',
      water: 'High',
      growthTime: '3-4 weeks',
      image: '🌱',
      description: 'Mint grows vigorously and is perfect for teas and cooking. It spreads quickly, so it\'s best grown in containers.',
      careTips: [
        'Place in partial shade to prevent scorching',
        'Water frequently - mint loves moisture',
        'Grow in containers to prevent spreading'
      ],
      commonPests: ['Aphids', 'Spider mites'],
      harvestTips: 'Harvest leaves as needed. Regular harvesting encourages new growth.',
      plantingSeason: 'Year-round',
      spacing: 'Container planting recommended',
      soilType: 'Moist, well-draining soil'
    },
    {
      id: 'tomato',
      name: 'Tomato (টমেটো)',
      scientificName: 'Solanum lycopersicum',
      type: 'Vegetable',
      difficulty: 'Moderate',
      sunNeeds: 'Full Sun',
      water: 'High',
      growthTime: '60-80 days',
      image: '🍅',
      description: 'Cherry and regular tomatoes grow well in Bangladesh\'s climate. They need support structures and regular feeding.',
      careTips: [
        'Place in full sun for best fruit production',
        'Water consistently to prevent cracking',
        'Provide support with stakes or cages'
      ],
      commonPests: ['Aphids', 'Tomato hornworm', 'Whiteflies'],
      harvestTips: 'Harvest when fruits are fully colored and slightly soft. Pick regularly to encourage more fruit.',
      plantingSeason: 'October to March (cooler months)',
      spacing: '18-24 inches apart',
      soilType: 'Rich, well-draining soil with pH 6.0-6.8'
    },
    {
      id: 'chili',
      name: 'Chili Pepper (মরিচ)',
      scientificName: 'Capsicum annuum',
      type: 'Vegetable',
      difficulty: 'Moderate',
      sunNeeds: 'Full Sun',
      water: 'Moderate',
      growthTime: '70-90 days',
      image: '🌶️',
      description: 'Hot and sweet peppers are essential in Bangladeshi cooking. They produce abundantly with proper care.',
      careTips: [
        'Place in full sun for maximum heat development',
        'Water moderately - avoid overwatering',
        'Mulch to retain soil moisture'
      ],
      commonPests: ['Aphids', 'Spider mites', 'Fruit borers'],
      harvestTips: 'Harvest when peppers reach desired size and color. Regular picking encourages more fruit.',
      plantingSeason: 'October to February',
      spacing: '12-18 inches apart',
      soilType: 'Well-draining soil with pH 6.0-6.8'
    },
    {
      id: 'eggplant',
      name: 'Eggplant (বেগুন)',
      scientificName: 'Solanum melongena',
      type: 'Vegetable',
      difficulty: 'Moderate',
      sunNeeds: 'Full Sun',
      water: 'Moderate',
      growthTime: '60-80 days',
      image: '🍆',
      description: 'Eggplants are a staple in Bangladeshi cuisine. They need warm weather and consistent moisture.',
      careTips: [
        'Place in full sun for best fruit development',
        'Water consistently - irregular watering causes fruit deformities',
        'Mulch to retain moisture and suppress weeds'
      ],
      commonPests: ['Fruit and shoot borer', 'Aphids', 'Whiteflies'],
      harvestTips: 'Harvest when fruits are glossy and firm. Cut with a short stem attached.',
      plantingSeason: 'October to February',
      spacing: '18-24 inches apart',
      soilType: 'Rich, well-draining soil with pH 5.5-6.8'
    },
    {
      id: 'coriander',
      name: 'Coriander (ধনে পাতা)',
      scientificName: 'Coriandrum sativum',
      type: 'Herb',
      difficulty: 'Easy',
      sunNeeds: 'Full Sun',
      water: 'Moderate',
      growthTime: '3-4 weeks',
      image: '🌿',
      description: 'Coriander leaves are essential for Bangladeshi cooking. It grows quickly and can be harvested multiple times.',
      careTips: [
        'Place in full sun for best growth',
        'Water moderately - avoid waterlogging',
        'Succession plant every 2 weeks for continuous harvest'
      ],
      commonPests: ['Aphids', 'Spider mites'],
      harvestTips: 'Harvest outer leaves first, allowing center to continue growing. Cut when 6 inches tall.',
      plantingSeason: 'Year-round (bolts in heat)',
      spacing: '6 inches apart',
      soilType: 'Well-draining soil with pH 6.2-6.8'
    },
    {
      id: 'cucumber',
      name: 'Cucumber (শসা)',
      scientificName: 'Cucumis sativum',
      type: 'Vegetable',
      difficulty: 'Moderate',
      sunNeeds: 'Full Sun',
      water: 'High',
      growthTime: '50-70 days',
      image: '🥒',
      description: 'Cucumbers grow well on trellises in Bangladesh\'s climate. They need consistent moisture and warm weather.',
      careTips: [
        'Place in full sun for best fruit production',
        'Water consistently - cucumbers need lots of water',
        'Provide trellis or support for climbing vines'
      ],
      commonPests: ['Cucumber beetle', 'Aphids', 'Spider mites'],
      harvestTips: 'Harvest when fruits are firm and before yellow spots appear. Pick daily for best quality.',
      plantingSeason: 'October to March',
      spacing: '12 inches apart with trellising',
      soilType: 'Rich, well-draining soil with pH 6.0-7.0'
    },
    {
      id: 'lettuce',
      name: 'Lettuce (লেটুস)',
      scientificName: 'Lactuca sativa',
      type: 'Vegetable',
      difficulty: 'Easy',
      sunNeeds: 'Partial Shade',
      water: 'Moderate',
      growthTime: '30-45 days',
      image: '🥬',
      description: 'Lettuce grows well in cooler months in Bangladesh. It\'s perfect for salads and cooking.',
      careTips: [
        'Place in partial shade to prevent bolting',
        'Water regularly - lettuce needs consistent moisture',
        'Harvest outer leaves for continuous production'
      ],
      commonPests: ['Aphids', 'Slugs', 'Cutworms'],
      harvestTips: 'Harvest outer leaves first, or cut entire plant at soil level when mature.',
      plantingSeason: 'November to February',
      spacing: '8-12 inches apart',
      soilType: 'Moist, fertile soil with pH 6.0-7.0'
    }
  ];

  // Fetch plants from API and get personalized suggestions
  useEffect(() => {
    const fetchPlantsAndSuggestions = async () => {
      try {
        setLoading(true);
        
        // Fetch all plants
        const response = await api.get('/plant-database');
        let fetchedPlants = Array.isArray(response.data.plants) ? response.data.plants : [];
        
        // If no plants from API, use common Bangladesh plants
        if (fetchedPlants.length === 0) {
          console.log('No plants from API, using common Bangladesh plants');
          fetchedPlants = commonBangladeshPlants;
        }
        
        setPlants(fetchedPlants);
        
        // Get personalized plant suggestions based on user profile
        if (user) {
          const suggestions = await getPersonalizedPlantSuggestions(user, fetchedPlants);
          setSuggestedPlants(suggestions);
        } else {
          // For non-logged-in users, show a selection of common plants
          setSuggestedPlants(commonBangladeshPlants.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to load plants:', error);
        // Fallback to common Bangladesh plants on error
        setPlants(commonBangladeshPlants);
        setSuggestedPlants(commonBangladeshPlants.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchPlantsAndSuggestions();
  }, [user]);

  // Get personalized plant suggestions based on user profile
  const getPersonalizedPlantSuggestions = async (userProfile, allPlants) => {
    try {
      // Define plant suggestions based on user profile
      const gardenType = userProfile.gardenType || '';
      const experience = userProfile.experience || '';
      const spaceSize = userProfile.spaceSize || '';
      
      // Filter plants based on user profile
      let suggestedPlants = [...allPlants];
      
      // For beginners, suggest easy plants
      if (experience === 'beginner') {
        suggestedPlants = suggestedPlants.filter(plant => plant.difficulty === 'Easy');
      }
      
      // For balcony gardens, suggest container-friendly plants
      if (gardenType.includes('balcony')) {
        // Most plants work for balconies, but prioritize compact ones
        suggestedPlants = suggestedPlants.filter(plant => 
          plant.name.includes('Basil') || 
          plant.name.includes('Mint') || 
          plant.name.includes('Coriander') ||
          plant.name.includes('Lettuce')
        );
      }
      
      // For small spaces, suggest compact plants
      if (spaceSize.includes('small')) {
        suggestedPlants = suggestedPlants.filter(plant => 
          plant.name.includes('Herb') || 
          plant.name.includes('Lettuce') || 
          plant.name.includes('Coriander')
        );
      }
      
      // If no specific suggestions, use common plants
      if (suggestedPlants.length === 0) {
        suggestedPlants = commonBangladeshPlants.slice(0, 6);
      }
      
      // Limit to 6 suggestions
      return suggestedPlants.slice(0, 6);
    } catch (error) {
      console.error('Failed to get personalized suggestions:', error);
      return commonBangladeshPlants.slice(0, 6);
    }
  };

  // Setup lazy loading for plant images
  useEffect(() => {
    if (!loading && plants.length > 0) {
      // Reset refs
      imageRefs.current = [];
      
      // Apply lazy loading to all plant images
      setTimeout(() => {
        const images = document.querySelectorAll('.plant-image-lazy');
        images.forEach((img, index) => {
          if (imageRefs.current[index]) {
            lazyLoadImage(img, imageRefs.current[index]);
          }
        });
      }, 100);
    }
  }, [loading, plants]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (uploadedImage) {
        cleanupObjectUrl(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const plantTypes = ['All Types', ...new Set(plants.map(plant => plant.type))];

  // Supply items
  const essentialSupplies = [
    { id: 'seeds', name: 'Seeds/Seedlings', description: 'High-quality seeds for your plant', badge: 'Required' },
    { id: 'pot', name: 'Growing Pot', description: 'Appropriate size container with drainage', badge: 'Required' },
    { id: 'soil', name: 'Potting Mix', description: 'Nutrient-rich soil for optimal growth', badge: 'Required' }
  ];

  const optionalSupplies = [
    { id: 'fertilizer', name: 'Organic Fertilizer', description: 'Boost plant health and growth', badge: 'Recommended' },
    { id: 'tools', name: 'Garden Tools Set', description: 'Basic tools for planting and maintenance', badge: 'Popular' },
    { id: 'pestcontrol', name: 'Natural Pest Control', description: 'Organic pest prevention solution', badge: 'Recommended' },
    { id: 'watercan', name: 'Watering Can', description: 'Perfect size for balcony gardening', badge: 'Popular' },
    { id: 'nutrients', name: 'Plant Nutrients', description: 'Essential vitamins and minerals', badge: 'Recommended' }
  ];

  // Fix: Add defensive check for plants array
  const filteredPlants = Array.isArray(plants) ? plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All Types' || plant.type === selectedType;
    return matchesSearch && matchesType;
  }) : [];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddToGarden = (plant) => {
    setSelectedPlant(plant);
    setShowShoppingModal(true);
    initializeSupplies();
  };

  // Initialize essential supplies (pre-checked and locked)
  const initializeSupplies = () => {
    const essentialIds = ['seeds', 'pot', 'soil'];
    const newSelections = {};
    const newQuantities = {};
    
    essentialIds.forEach(id => {
      newSelections[id] = true;
      newQuantities[id] = 1;
    });
    
    setSelectedItems(newSelections);
    setItemQuantities(newQuantities);
  };

  const toggleItem = (itemId, isEssential) => {
    if (isEssential) return; // Can't toggle essential items
    
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    
    if (!selectedItems[itemId]) {
      setItemQuantities(prev => ({
        ...prev,
        [itemId]: 1
      }));
    }
  };

  const updateQuantity = (itemId, quantity) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: parseInt(quantity)
    }));
  };

  const getSelectedItemsCount = () => {
    return Object.values(selectedItems).filter(Boolean).length;
  };

  // Add camera capture functionality with preview
  const handleCameraCapture = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access is not supported in your browser. Please use the upload option instead.');
        return;
      }

      // CHECK AUTHENTICATION FIRST
      if (!user) {
        alert('Please login to use AI plant scanner');
        return;
      }

      // Check if token exists
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('Please login to use AI plant scanner');
        window.location.href = '/login';
        return;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });

      setCameraStream(stream);
      setShowCameraPreview(true);
    } catch (error) {
      console.error('Camera error:', error);
      if (error.name === 'NotAllowedError') {
        alert('Camera access was denied. Please allow camera access to use this feature.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera found on this device.');
      } else {
        alert('Failed to access camera. Please use the upload option instead.');
      }
    }
  };

  // Function to capture image from camera preview
  const captureImageFromPreview = () => {
    if (!cameraPreview) return;

    const video = cameraPreview;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setScanResults({
          error: 'Failed to capture image from camera'
        });
        return;
      }

      // Create file object from blob
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });

      // Validate file size (max 10MB original)
      if (file.size > 10 * 1024 * 1024) {
        setScanResults({
          error: 'Captured image too large. Please try again or use upload option.'
        });
        return;
      }

      // Clean up previous image URL to prevent memory leaks
      if (uploadedImage) {
        cleanupObjectUrl(uploadedImage);
      }

      // Stop camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      // Set captured image for preview
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      setShowCameraPreview(false);

      // Process the captured image
      setIsAnalyzing(true);
      setScanResults(null);

      try {
        // Compress image first
        console.log('🔄 Compressing captured image...');
        const compressedBase64 = await compressImage(file, 800);
        console.log('✅ Image compressed successfully');

        console.log('🚀 Sending to API...');
        // Extract base64 from data URL
        const base64Image = compressedBase64.split(',')[1];
        const response = await api.post('/diagnosis/identify', { imageBase64: base64Image });

        console.log('📥 API Response:', response.data);

        if (response.data.success) {
          console.log('✅ Identification successful!');
          setScanResults(response.data.result);
          setUploadedImage(compressedBase64); // Store the full data URL
        } else {
          console.log('⚠️ Identification unsuccessful:', response.data.message);
          setScanResults({
            error: response.data.message || 'Could not identify plant'
          });
        }
      } catch (apiError) {
        console.error('❌ API Error:', apiError);
        console.error('Response data:', apiError.response?.data);

        if (apiError.response?.status === 413) {
          setScanResults({
            error: 'Image still too large after compression. Try a smaller image.'
          });
        } else if (apiError.response?.status === 401) {
          setScanResults({
            error: 'Please login to use AI plant scanner'
          });
        } else {
          setScanResults({
            error: apiError.response?.data?.message || 'Failed to identify plant. Please try again.'
          });
        }
      } finally {
        setIsAnalyzing(false);
        setCapturedImage(null);
      }
    }, 'image/jpeg', 0.8);
  };

  // Function to cancel camera preview
  const cancelCameraPreview = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setShowCameraPreview(false);
    setCameraStream(null);
  };

  const handleSkipSupplies = async () => {
    // Add plant to garden using real API
    try {
      console.log('Adding plant to garden:', selectedPlant);
      
      const plantData = {
        name: selectedPlant.name,
        type: selectedPlant.type,
        image: selectedPlant.image || '🌱',
        health: Math.floor(Math.random() * 20) + 80,
        status: 'healthy',
        daysGrowing: 1,
        expectedHarvestDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
      };
      
      console.log('Plant data being sent:', plantData);
      
      const response = await plantAPI.create(plantData);
      
      console.log('API response:', response);
      
      if (response.data.success) {
        alert(`${selectedPlant.name} added to your garden! 🌱`);
        // Close the modal and reset selection
        setShowShoppingModal(false);
        setSelectedPlant(null);
        // Navigate to My Garden page to see the newly added plant
        navigate('/my-garden');
      } else {
        console.error('API returned success=false:', response.data);
        alert('Failed to add plant to garden. Please try again.');
        // Close the modal and reset selection even on error
        setShowShoppingModal(false);
        setSelectedPlant(null);
      }
    } catch (error) {
      console.error('Failed to add plant to garden:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to add plant to garden. Please try again.');
      // Close the modal and reset selection even on error
      setShowShoppingModal(false);
      setSelectedPlant(null);
    }
  };

  const handleRequestQuote = () => {
    setShowShoppingModal(false);
    setShowContactForm(true);
  };

  // Bangladesh divisions and districts
  const divisions = {
    'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Tangail'],
    'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachari', 'Feni'],
    'Rajshahi': ['Rajshahi', 'Bogra', 'Pabna', 'Sirajganj', 'Natore', 'Naogaon'],
    'Khulna': ['Khulna', 'Jessore', 'Satkhira', 'Bagerhat', 'Chuadanga', 'Kushtia'],
    'Barisal': ['Barisal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati', 'Barguna'],
    'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Lalmonirhat', 'Nilphamari', 'Gaibandha', 'Kurigram'],
    'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid Bangladeshi phone number';
    }
    
    if (!formData.division) {
      errors.division = 'Division is required';
    }
    
    if (!formData.district) {
      errors.district = 'District is required';
    }
    
    if (!formData.area.trim()) {
      errors.area = 'Area/Thana is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Full address is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const quoteData = {
        plant: selectedPlant,
        supplies: Object.keys(selectedItems)
          .filter(id => selectedItems[id])
          .map(id => ({
            id,
            name: [...essentialSupplies, ...optionalSupplies].find(item => item.id === id)?.name,
            quantity: itemQuantities[id] || 1
          })),
        contactInfo: formData,
        totalItems: getSelectedItemsCount()
      };
      
      const response = await quoteAPI.create(quoteData);
      
      if (response.data.success) {
        setRequestId(response.data.requestId);
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          fullName: '',
          phone: '',
          division: '',
          district: '',
          area: '',
          address: '',
          contactMethod: 'WhatsApp',
          email: '',
          postalCode: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Failed to submit quote request:', error);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // CHECK AUTHENTICATION FIRST
    if (!user) {
      alert('Please login to use AI plant scanner');
      return;
    }

    // Check if token exists
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please login to use AI plant scanner');
      window.location.href = '/login';
      return;
    }

    console.log('📸 Image selected:', file.name, file.size, 'bytes');
    console.log('👤 User:', user.email);
    console.log('🔑 Token exists:', !!token);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setScanResults({
        error: 'Please select an image file'
      });
      return;
    }

    // Validate file size (max 10MB original)
    if (file.size > 10 * 1024 * 1024) {
      setScanResults({
        error: 'Image too large. Please select an image under 10MB'
      });
      return;
    }

    // Clean up previous image URL to prevent memory leaks
    if (uploadedImage) {
      cleanupObjectUrl(uploadedImage);
    }

    try {
      // Compress image first
      console.log('🔄 Compressing image...');
      const compressedBase64 = await compressImage(file, 800);
      console.log('✅ Image compressed successfully');
      
      // Show preview before analysis
      setUploadedImage(compressedBase64); // Store the full data URL
      setScanResults(null);
    } catch (error) {
      console.error('❌ Compression Error:', error);
      setScanResults({
        error: 'Failed to process image. Please try again.'
      });
    }
  };

  const handleAnalyzeUploadedImage = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    setScanResults(null);

    try {
      console.log('🚀 Sending to API...');
      // Extract base64 from data URL
      const base64Image = uploadedImage.split(',')[1];
      const response = await api.post('/diagnosis/identify', { imageBase64: base64Image });
      
      console.log('📥 API Response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Identification successful!');
        setScanResults(response.data.result);
      } else {
        console.log('⚠️ Identification unsuccessful:', response.data.message);
        setScanResults({
          error: response.data.message || 'Could not identify plant'
        });
      }
    } catch (apiError) {
      console.error('❌ API Error:', apiError);
      console.error('Response data:', apiError.response?.data);
      
      if (apiError.response?.status === 413) {
        setScanResults({
          error: 'Image still too large after compression. Try a smaller image.'
        });
      } else if (apiError.response?.status === 401) {
        setScanResults({
          error: 'Please login to use AI plant scanner'
        });
      } else {
        setScanResults({
          error: apiError.response?.data?.message || 'Failed to identify plant. Please try again.'
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetUpload = () => {
    // Clean up image URL to prevent memory leaks
    if (uploadedImage) {
      cleanupObjectUrl(uploadedImage);
    }
    
    setUploadedImage(null);
    setScanResults(null);
  };

  const handleScanAnother = () => {
    // Clean up image URL to prevent memory leaks
    if (uploadedImage) {
      cleanupObjectUrl(uploadedImage);
    }
    
    setUploadedImage(null);
    setScanResults(null);
  };

  const handleAddScannedPlant = async () => {
    if (!scanResults) return;
    
    // Convert scan results to plant format
    const plantData = {
      name: scanResults.name,
      type: scanResults.type,
      image: scanResults.image,
      health: Math.floor(Math.random() * 20) + 80,
      status: 'healthy',
      daysGrowing: 1,
      expectedHarvestDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
    };
    
    // Use the same flow as regular "Add to Garden" button
    setSelectedPlant(plantData);
    setShowShoppingModal(true);
    initializeSupplies();
    
    // Close scanner and go to browse tab
    setActiveTab('browse');
    setUploadedImage(null);
    setScanResults(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading plant database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plant Database</h1>
          <p className="text-gray-600 mt-1">
            Browse {plants.length} plants perfect for Bangladesh's climate
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveTab('scan')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Camera className="h-5 w-5" />
            <span>AI Scan Plant</span>
          </button>
        </div>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <>
          {/* Personalized Plant Suggestions */}
          {user && suggestedPlants.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sprout className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Based on your {user.gardenType} garden and {user.experience} experience level
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedPlants.map((plant) => (
                  <div key={plant.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-[320px]">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-3xl">
                        {getPlantIcon(plant.name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{plant.name}</h3>
                        <p className="text-sm text-gray-600">{plant.scientificName}</p>
                      </div>
                    </div>
                    
                    {/* Planting Prerequisites */}
                    <div className="mb-4 flex-grow">
                      <div className="space-y-2">
                        {getPlantingPrerequisites(plant).slice(0, 3).map((prereq, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">{prereq.icon}</span>
                            <span>{prereq.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Suitability Info */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {getPlantSuitabilityInfo(plant).slice(0, 3).map((info, index) => (
                          <span key={index} className={`text-xs px-2 py-1 rounded-full ${info.color} bg-opacity-20`}>
                            {info.text}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleAddToGarden(plant)}
                      className="w-full btn-primary py-3 flex items-center justify-center space-x-1 rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add to Garden</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search plants..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {plantTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Plant List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => (
              <div key={plant.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-[320px]">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">
                    {getPlantIcon(plant.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{plant.name}</h3>
                    <p className="text-sm text-gray-600">{plant.scientificName}</p>
                  </div>
                </div>
                
                {/* Planting Prerequisites */}
                <div className="mb-4 flex-grow">
                  <div className="space-y-2">
                    {getPlantingPrerequisites(plant).slice(0, 3).map((prereq, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">{prereq.icon}</span>
                        <span>{prereq.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Suitability Info */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {getPlantSuitabilityInfo(plant).slice(0, 3).map((info, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${info.color} bg-opacity-20`}>
                        {info.text}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToGarden(plant)}
                  className="w-full btn-primary py-3 flex items-center justify-center space-x-1 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Garden</span>
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* AI Scanner Tab */}
      {activeTab === 'scan' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">🔍</span>
                  <h2 className="text-2xl font-bold">AI Plant Scanner</h2>
                </div>
                <p className="opacity-90">Identify any plant instantly</p>
              </div>
              <button
                onClick={() => setActiveTab('browse')}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!scanResults ? (
              // UPLOAD SECTION
              <div className="space-y-6">
                {/* Upload Area */}
                {/* Hidden File Inputs for AI Scanner */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="scanner-gallery-input"
                />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="scanner-camera-input"
                />

                {/* AI Scanner Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  {uploadedImage && !isAnalyzing ? (
                    // Show preview
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Uploaded plant"
                        className="mx-auto max-h-96 rounded-lg"
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      >
                        <X className="h-5 w-5 text-gray-600" />
                      </button>
                      <div className="mt-4">
                        <button
                          onClick={handleAnalyzeUploadedImage}
                          className="btn-primary flex items-center justify-center space-x-2 mx-auto"
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>Analyze with AI</span>
                        </button>
                      </div>
                    </div>
                  ) : isAnalyzing ? (
                    // Loading state
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing with AI...</h3>
                      <p className="text-gray-600">This may take 3-5 seconds</p>
                      <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  ) : (
                    // Initial state
                    <div>
                      <div className="mx-auto bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-6">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Plant Photo</h3>
                      <p className="text-gray-600 mb-6">
                        Click to browse or drag & drop your image here
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            console.log('🖼️ AI Scanner: Upload Image clicked');
                            document.getElementById('scanner-gallery-input').click();
                          }}
                          className="btn-primary flex items-center justify-center space-x-2"
                        >
                          <Upload className="h-5 w-5" />
                          <span>Choose Photo</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            console.log('📸 AI Scanner: Take Photo clicked');
                            document.getElementById('scanner-camera-input').click();
                          }}
                          className="btn-secondary flex items-center justify-center space-x-2"
                        >
                          <Camera className="h-5 w-5" />
                          <span>Take Photo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-bold text-blue-900 flex items-center mb-2">
                    <span className="mr-2">📌</span>
                    Tips for Best Results
                  </h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Use good lighting (natural light is best)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Focus on leaves and flowers clearly</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Get close to the plant (fill the frame)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Avoid blurry or distant photos</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              // RESULTS SECTION - CLEAN DESIGN
              <div className="space-y-6">
                {/* Plant Image at Top */}
                {scanResults.image && (
                  <div className="w-full">
                    <img
                      src={scanResults.image}
                      alt={scanResults.name}
                      className="w-full max-h-64 object-contain rounded-xl"
                    />
                  </div>
                )}

                {/* Plant Name Card */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl">🌿</span>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {getCommonPlantName(scanResults.scientificName || scanResults.name)}
                        </h3>
                      </div>
                      <p className="text-gray-600 italic">{scanResults.scientificName || scanResults.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Quick Info Tags */}
                      {scanResults.type && (
                        <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm flex items-center space-x-1">
                          <span>📋</span>
                          <span>{scanResults.type}</span>
                        </span>
                      )}
                      {scanResults.difficulty && (
                        <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm flex items-center space-x-1">
                          {scanResults.difficulty === 'easy' ? '🟢 Easy' :
                           scanResults.difficulty === 'hard' ? '🔴 Hard' :
                           '🟡 Moderate'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Confidence Badge */}
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="font-medium">Confidence</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-green-600">{scanResults.confidence}%</span>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(i => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i <= Math.ceil(parseFloat(scanResults.confidence) / 20)
                                ? 'bg-green-600'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Planting Prerequisites - Essential Information */}
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                  <h4 className="font-bold text-blue-900 flex items-center mb-3">
                    <span className="mr-2">📋</span>
                    Planting Prerequisites
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getPlantingPrerequisites(scanResults).map((prereq, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg border border-blue-100">
                        <span className="mr-2 text-blue-600">{prereq.icon}</span>
                        <span className="text-gray-700">{prereq.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suitability Information */}
                <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                  <h4 className="font-bold text-purple-900 flex items-center mb-3">
                    <span className="mr-2">✅</span>
                    Suitability Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getPlantSuitabilityInfo(scanResults).map((info, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg border border-purple-100">
                        <span className="mr-2 text-purple-600">{info.icon}</span>
                        <span className={`font-medium ${info.color}`}>{info.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Care Requirements - Clean Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl">☀️</span>
                      <h4 className="font-bold text-gray-900">Sunlight</h4>
                    </div>
                    <p className="text-gray-700">{scanResults.sunNeeds || 'Partial sun'}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl">💧</span>
                      <h4 className="font-bold text-gray-900">Watering</h4>
                    </div>
                    <p className="text-gray-700">{scanResults.waterNeeds || 'Moderate'}</p>
                  </div>
                </div>

                {/* Description - Collapsible with Scroll */}
                {scanResults.description && (
                  <div className="bg-gray-50 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="flex items-center justify-between w-full text-left p-4"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">📖</span>
                        <h4 className="font-bold text-gray-900">About This Plant</h4>
                      </div>
                      <span className="text-gray-500">{showFullDescription ? '▼' : '▶'}</span>
                    </button>
                    {showFullDescription && (
                      <div className="px-4 pb-4">
                        <div className="max-h-60 overflow-y-auto pr-2">
                          <p className="text-gray-700">
                            {scanResults.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleAddScannedPlant()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add to My Garden</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setScanResults(null);
                      setUploadedImage(null);
                    }}
                    className="px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <span className="text-lg">🔄</span>
                    <span>Scan Another</span>
                  </button>
                </div>

                {/* Low Confidence Warning */}
                {parseFloat(scanResults.confidence) < 70 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-2">
                    <span className="text-xl">⚠️</span>
                    <p className="text-yellow-800">
                      Moderate confidence. Try uploading a clearer photo with more visible leaves/flowers for better accuracy.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {scanResults?.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-2">
                <span className="text-xl">❌</span>
                <div>
                  <h4 className="font-bold text-red-900 mb-1">Identification Failed</h4>
                  <p className="text-red-800">{scanResults.error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shopping Modal */}
      {showShoppingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add to Garden</h2>
              <button
                onClick={() => setShowShoppingModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">
                    {getPlantIcon(selectedPlant.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPlant.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPlant.scientificName}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedPlant.sunlight && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {selectedPlant.sunlight}
                    </span>
                  )}
                  {selectedPlant.watering && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {selectedPlant.watering}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Essential Supplies</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {essentialSupplies.map(supply => (
                      <div key={supply.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{supply.name}</h4>
                          <p className="text-sm text-gray-600">{supply.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {supply.badge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Optional Supplies</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {optionalSupplies.map(supply => (
                      <div key={supply.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{supply.name}</h4>
                          <p className="text-sm text-gray-600">{supply.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleItem(supply.id, supply.badge === 'Required')}
                            className={`btn-secondary flex items-center space-x-2 ${selectedItems[supply.id] ? 'bg-green-100 text-green-800' : ''}`}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>{selectedItems[supply.id] ? 'Selected' : 'Select'}</span>
                          </button>
                          {selectedItems[supply.id] && (
                            <input
                              type="number"
                              min="1"
                              value={itemQuantities[supply.id]}
                              onChange={(e) => updateQuantity(supply.id, e.target.value)}
                              className="w-16 pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                <button
                  className="btn-secondary flex items-center justify-center space-x-2 flex-1"
                  onClick={handleRequestQuote}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Request Quote</span>
                </button>
                <button
                  className="btn-primary flex items-center justify-center space-x-2 flex-1"
                  onClick={handleSkipSupplies}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Garden</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form (Quote Request) */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Request Quote</h2>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">
                    {getPlantIcon(selectedPlant.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPlant.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPlant.scientificName}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedPlant.sunlight && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {selectedPlant.sunlight}
                    </span>
                  )}
                  {selectedPlant.watering && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {selectedPlant.watering}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Supplies</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.keys(selectedItems).map(id => {
                      const supply = [...essentialSupplies, ...optionalSupplies].find(item => item.id === id);
                      return (
                        <div key={id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{supply.name}</h4>
                            <p className="text-sm text-gray-600">{supply.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {supply.badge}
                            </span>
                            <input
                              type="number"
                              min="1"
                              value={itemQuantities[id]}
                              onChange={(e) => updateQuantity(id, e.target.value)}
                              className="w-16 pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                      <select
                        value={formData.division}
                        onChange={(e) => handleInputChange('division', e.target.value)}
                        className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select Division</option>
                        {Object.keys(divisions).map(division => (
                          <option key={division} value={division}>{division}</option>
                        ))}
                      </select>
                      {formErrors.division && <p className="text-red-500 text-sm mt-1">{formErrors.division}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                      <select
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                        disabled={!formData.division}
                      >
                        <option value="">Select District</option>
                        {divisions[formData.division]?.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                      {formErrors.district && <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area/Thana</label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {formErrors.area && <p className="text-red-500 text-sm mt-1">{formErrors.area}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
                      <select
                        value={formData.contactMethod}
                        onChange={(e) => handleInputChange('contactMethod', e.target.value)}
                        className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                      >
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Phone">Phone</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code (Optional)</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="btn-secondary flex items-center justify-center space-x-2 flex-1"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmitQuote}
                  className="btn-primary flex items-center justify-center space-x-2 flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>Submit Quote</span>
                    </>
                  )}
                </button>
              </div>

              {showSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg mt-4">
                  <p className="font-semibold">Quote Request Submitted!</p>
                  <p>Your request ID is: <span className="font-bold">{requestId}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDatabase;