import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Camera, Upload, CheckCircle, Loader2, ShoppingCart, X, Lock, Phone, Mail, MapPin, AlertCircle, Sprout } from 'lucide-react';
import { plantDatabaseAPI, plantAPI, quoteAPI } from '../../services/api';
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

  // Fetch plants from API and get personalized suggestions
  useEffect(() => {
    const fetchPlantsAndSuggestions = async () => {
      try {
        setLoading(true);
        
        // Fetch all plants
        const response = await plantDatabaseAPI.getAll();
        // Fix: Ensure plants is always an array
        setPlants(Array.isArray(response.data.plants) ? response.data.plants : []);
        
        // Get personalized plant suggestions based on user profile
        if (user) {
          const suggestions = await getPersonalizedPlantSuggestions(user);
          setSuggestedPlants(suggestions);
        }
      } catch (error) {
        console.error('Failed to load plants:', error);
        // Fix: Set plants to empty array on error
        setPlants([]);
        setSuggestedPlants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantsAndSuggestions();
  }, [user]);

  // Get personalized plant suggestions based on user profile
  const getPersonalizedPlantSuggestions = async (userProfile) => {
    try {
      // Define plant suggestions based on user profile
      const gardenType = userProfile.gardenType || '';
      const experience = userProfile.experience || '';
      const spaceSize = userProfile.spaceSize || '';
      
      // Create search queries based on user profile
      let searchQueries = [];
      
      // Beginner-friendly plants
      if (experience === 'beginner') {
        searchQueries.push('easy care plants', 'low maintenance plants');
      }
      
      // Plants based on garden type
      if (gardenType.includes('balcony')) {
        searchQueries.push('balcony plants', 'container plants', 'small space plants');
      } else if (gardenType.includes('rooftop')) {
        searchQueries.push('rooftop plants', 'sun loving plants', 'drought tolerant plants');
      } else if (gardenType.includes('indoor')) {
        searchQueries.push('indoor plants', 'house plants', 'low light plants');
      } else if (gardenType.includes('backyard')) {
        searchQueries.push('garden plants', 'vegetable plants', 'flowering plants');
      }
      
      // Plants based on space size
      if (spaceSize.includes('small')) {
        searchQueries.push('small plants', 'compact plants');
      } else if (spaceSize.includes('medium')) {
        searchQueries.push('medium plants', 'bushy plants');
      } else if (spaceSize.includes('large')) {
        searchQueries.push('large plants', 'tree plants');
      }
      
      // Default suggestions if no specific criteria
      if (searchQueries.length === 0) {
        searchQueries = ['popular plants', 'vegetable plants', 'herb plants'];
      }
      
      // Get suggestions for each query (limit to 3 plants per query)
      const suggestions = [];
      for (const query of searchQueries.slice(0, 3)) {
        try {
          const response = await plantDatabaseAPI.search(query, 1);
          if (response.data.success && response.data.plants) {
            suggestions.push(...response.data.plants.slice(0, 3));
          }
        } catch (error) {
          console.warn(`Failed to search for "${query}":`, error);
        }
      }
      
      // Remove duplicates based on plant ID
      const uniqueSuggestions = suggestions.filter((plant, index, self) => 
        index === self.findIndex(p => p.id === plant.id)
      );
      
      // Limit to 9 suggestions
      return uniqueSuggestions.slice(0, 9);
    } catch (error) {
      console.error('Failed to get personalized suggestions:', error);
      return [];
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
        const response = await plantDatabaseAPI.identifyPlant(base64Image);

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
      const response = await plantDatabaseAPI.identifyPlant(base64Image);
      
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedPlants.map((plant) => (
                  <div key={plant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      {plant.image ? (
                        <img 
                          src={plant.image} 
                          alt={plant.name} 
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        🌱
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{plant.name}</h3>
                        <p className="text-sm text-gray-600">{plant.scientificName}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {plant.sunlight && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {plant.sunlight}
                        </span>
                      )}
                      {plant.watering && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {plant.watering}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAddToGarden(plant)}
                      className="w-full btn-primary text-sm py-2 flex items-center justify-center space-x-1"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlants.map((plant) => (
              <div key={plant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  {plant.image ? (
                    <img 
                      src={plant.image} 
                      alt={plant.name} 
                      className="w-12 h-12 rounded object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                    🌱
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{plant.name}</h3>
                    <p className="text-sm text-gray-600">{plant.scientificName}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {plant.sunlight && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {plant.sunlight}
                    </span>
                  )}
                  {plant.watering && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {plant.watering}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => handleAddToGarden(plant)}
                  className="w-full btn-primary text-sm py-2 flex items-center justify-center space-x-1"
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
            {!uploadedImage && !scanResults && !showCameraPreview && !capturedImage ? (
              // UPLOAD SECTION
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="text-center py-12">
                  <div className="mx-auto bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-6">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan Your Plant</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Upload a clear photo of your plant to get instant identification and care instructions
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <label className="btn-primary cursor-pointer flex items-center justify-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <button 
                      className="btn-secondary flex items-center justify-center space-x-2"
                      onClick={handleCameraCapture}
                    >
                      <Camera className="h-5 w-5" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-bold text-blue-900 flex items-center mb-2">
                    <span className="mr-2">💡</span>
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
            ) : null}

            {/* CAMERA PREVIEW */}
            {showCameraPreview && (
              <div className="relative">
                <video
                  ref={ref => setCameraPreview(ref)}
                  autoPlay
                  playsInline
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <button
                    className="btn-primary flex items-center space-x-2"
                    onClick={captureImageFromPreview}
                  >
                    <Camera className="h-5 w-5" />
                    <span>Capture</span>
                  </button>
                </div>
              </div>
            )}

            {/* CAPTURED IMAGE */}
            {capturedImage && (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <button
                    className="btn-primary flex items-center space-x-2"
                    onClick={handleAddScannedPlant}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Add Plant</span>
                  </button>
                </div>
              </div>
            )}

            {/* UPLOADED IMAGE */}
            {uploadedImage && !scanResults && !isAnalyzing && (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <button
                    className="btn-primary flex items-center space-x-2"
                    onClick={handleAnalyzeUploadedImage}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Analyze</span>
                  </button>
                </div>
              </div>
            )}

            {/* ANALYZING */}
            {isAnalyzing && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                <p className="text-gray-600">Analyzing image...</p>
              </div>
            )}

            {/* SCAN RESULTS */}
            {scanResults && !isAnalyzing && (
              <div className="space-y-6">
                {/* Plant Info */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    {scanResults.image ? (
                      <img 
                        src={scanResults.image} 
                        alt={scanResults.name} 
                        className="w-12 h-12 rounded object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                      🌱
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{scanResults.name}</h3>
                      <p className="text-sm text-gray-600">{scanResults.scientificName}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {scanResults.sunlight && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        {scanResults.sunlight}
                      </span>
                    )}
                    {scanResults.watering && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {scanResults.watering}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={handleAddScannedPlant}
                    className="w-full btn-primary text-sm py-2 flex items-center justify-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Garden</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <button
                    className="btn-secondary flex items-center space-x-2"
                    onClick={handleScanAnother}
                  >
                    <X className="h-5 w-5" />
                    <span>Scan Another</span>
                  </button>
                  <button
                    className="btn-primary flex items-center space-x-2"
                    onClick={handleResetUpload}
                  >
                    <X className="h-5 w-5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shopping Modal */}
      {showShoppingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add to Garden</h2>
              <button
                onClick={() => setShowShoppingModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                {selectedPlant.image ? (
                  <img 
                    src={selectedPlant.image} 
                    alt={selectedPlant.name} 
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  🌱
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

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Essential Supplies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Optional Supplies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optionalSupplies.map(supply => (
                  <div key={supply.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
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

            <div className="flex justify-between">
              <button
                className="btn-secondary flex items-center space-x-2"
                onClick={handleRequestQuote}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Request Quote</span>
              </button>
              <button
                className="btn-primary flex items-center space-x-2"
                onClick={handleSkipSupplies}
              >
                <Plus className="h-4 w-4" />
                <span>Add to Garden</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Request Quote</h2>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                {selectedPlant.image ? (
                  <img 
                    src={selectedPlant.image} 
                    alt={selectedPlant.name} 
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  🌱
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

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Selected Supplies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(selectedItems).map(id => {
                  const supply = [...essentialSupplies, ...optionalSupplies].find(item => item.id === id);
                  return (
                    <div key={id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
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

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Division</label>
                  <select
                    value={formData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select Division</option>
                    {Object.keys(divisions).map(division => (
                      <option key={division} value={division}>{division}</option>
                    ))}
                  </select>
                  {formErrors.division && <p className="text-red-500 text-sm mt-1">{formErrors.division}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select District</option>
                    {divisions[formData.division]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {formErrors.district && <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Area/Thana</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formErrors.area && <p className="text-red-500 text-sm mt-1">{formErrors.area}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Method</label>
                  <select
                    value={formData.contactMethod}
                    onChange={(e) => handleInputChange('contactMethod', e.target.value)}
                    className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowContactForm(false)}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSubmitQuote}
                className="btn-primary flex items-center space-x-2"
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
              <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg">
                <p className="font-semibold">Quote Request Submitted!</p>
                <p>Your request ID is: <span className="font-bold">{requestId}</span></p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDatabase;