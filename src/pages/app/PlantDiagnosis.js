import React, { useState } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle, Clock, Lightbulb, Loader2 } from 'lucide-react';
import { diagnosisAPI, plantAPI } from '../../services/api';
import { compressImage, getOptimalQuality, cleanupObjectUrl } from '../../services/imageOptimizer';
import { useAuth } from '../../context/AuthContext';

const PlantDiagnosis = () => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [optimizedImage, setOptimizedImage] = useState(null);

  // Add new state variables for camera preview
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraPreview, setCameraPreview] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCameraPreview, setShowCameraPreview] = useState(false);

  // Fetch user's plants for linking diagnosis
  React.useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await plantAPI.getAll();
        // Fix: Ensure plants is always an array, even if response structure is unexpected
        setPlants(Array.isArray(response.data.plants) ? response.data.plants : []);
      } catch (error) {
        console.error('Failed to load plants:', error);
        // Fix: Set plants to empty array on error to prevent undefined issues
        setPlants([]);
      }
    };
    
    fetchPlants();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('🏥 Diagnosis image selected:', file.name, file.size, 'bytes');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Clean up previous image URLs to prevent memory leaks
    if (selectedImage) {
      cleanupObjectUrl(selectedImage);
    }
    
    setSelectedImage(null);
    setResults(null);
    setError(null);

    try {
      // Get optimal quality based on network conditions
      const quality = getOptimalQuality();
      
      console.log('🔄 Compressing image...');
      // Optimize the image for faster upload
      const optimizedBlob = await compressImage(file, quality);
      const optimizedUrl = URL.createObjectURL(optimizedBlob);
      
      console.log('✅ Image compressed');
      console.log('   Original size:', file.size, 'bytes');
      console.log('   Compressed size:', optimizedBlob.size, 'bytes');
      
      setOptimizedImage(optimizedBlob);
      setSelectedImage(optimizedUrl);
    } catch (err) {
      console.error('Failed to optimize image:', err);
      setError('Failed to process image. Please try another image.');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please upload an image first');
      return;
    }

    // CHECK AUTHENTICATION
    if (!user) {
      setError('Please login to use plant diagnosis');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Please login to continue');
      window.location.href = '/login';
      return;
    }

    console.log('🏥 Starting diagnosis...');
    console.log('👤 User:', user.email);
    console.log('🔑 Token exists:', !!token);

    setLoading(true);
    setError(null);
    
    try {
      // Convert optimized image to base64 for API
      let base64Image;
      if (optimizedImage) {
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result.split(',')[1]);
          reader.readAsDataURL(optimizedImage);
        });
      } else {
        // Extract base64 from data URL
        base64Image = selectedImage.split(',')[1];
      }
      
      console.log('🚀 Sending to diagnosis API...');
      // Call real Plant.id API for health assessment
      const response = await diagnosisAPI.diagnosePlantHealth(selectedPlant, base64Image);
      
      console.log('📥 Diagnosis response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Diagnosis complete!');
        // Map the new backend response structure to what the frontend expects
        const identificationData = response.data.identification;
        const diagnosisData = response.data.diagnosis;
        const mappedResults = {
          plantName: identificationData.name,
          scientificName: identificationData.scientificName,
          commonNames: identificationData.commonNames,
          confidence: identificationData.confidence,
          healthScore: diagnosisData.healthScore,
          isHealthy: diagnosisData.isHealthy,
          severity: diagnosisData.severity,
          mainIssue: diagnosisData.mainIssue,
          cause: diagnosisData.cause,
          simpleDescription: diagnosisData.simpleDescription,
          actionSteps: diagnosisData.actionSteps,
          detailedInfo: diagnosisData.detailedInfo
        };
        setResults(mappedResults);
      } else {
        setError(response.data.message || 'Diagnosis failed');
      }
    } catch (apiError) {
      console.error('❌ Diagnosis error:', apiError);
      
      if (apiError.response?.status === 413) {
        setError('Image too large. Please try a smaller image.');
      } else if (apiError.response?.status === 401) {
        setError('Please login to use plant diagnosis');
      } else {
        setError(apiError.response?.data?.message || 'Diagnosis failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Clean up object URLs to prevent memory leaks
    if (selectedImage) {
      cleanupObjectUrl(selectedImage);
    }
    
    setSelectedImage(null);
    setOptimizedImage(null);
    setResults(null);
    setLoading(false);
    setError(null);
    setSelectedPlant('');
  };

  const getSeverityColor = (severity) => {
    // Handle string severity values from the updated backend
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      case 'healthy': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (healthScore) => {
    if (healthScore >= 80) return 'text-green-600';
    if (healthScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Add camera capture functionality with preview
  const handleCameraCapture = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access is not supported in your browser. Please use the upload option instead.');
        return;
      }

      // CHECK AUTHENTICATION
      if (!user) {
        setError('Please login to use plant diagnosis');
        return;
      }

      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Please login to continue');
        window.location.href = '/login';
        return;
      }

      console.log('🏥 Starting camera capture...');
      console.log('👤 User:', user.email);
      console.log('🔑 Token exists:', !!token);

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
      setError(null);
    } catch (error) {
      console.error('Camera error:', error);
      if (error.name === 'NotAllowedError') {
        setError('Camera access was denied. Please allow camera access to use this feature.');
      } else if (error.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Failed to access camera. Please use the upload option instead.');
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
        setError('Failed to capture image from camera');
        return;
      }

      // Create file object from blob
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Clean up previous image URLs to prevent memory leaks
      if (selectedImage) {
        cleanupObjectUrl(selectedImage);
      }
      
      // Stop camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      // Set captured image for preview
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      setShowCameraPreview(false);

      setSelectedImage(null);
      setResults(null);
      setError(null);

      try {
        // Get optimal quality based on network conditions
        const quality = getOptimalQuality();
        
        console.log('🔄 Compressing captured image...');
        // Optimize the image for faster upload
        const optimizedBlob = await compressImage(file, quality);
        const optimizedUrl = URL.createObjectURL(optimizedBlob);
        
        console.log('✅ Image compressed');
        console.log('   Original size:', file.size, 'bytes');
        console.log('   Compressed size:', optimizedBlob.size, 'bytes');
        
        setOptimizedImage(optimizedBlob);
        setSelectedImage(optimizedUrl);
      } catch (err) {
        console.error('Failed to optimize image:', err);
        setError('Failed to process image. Please try another image.');
      } finally {
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

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (selectedImage) {
        cleanupObjectUrl(selectedImage);
      }
    };
  }, [selectedImage]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">AI Plant Doctor 🔬</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Upload a photo of your plant and get instant AI-powered health diagnosis
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4">
          {error}
        </div>
      )}

      {/* Plant Selection */}
      {selectedImage && !results && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Link to Existing Plant (Optional)</h3>
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="">Select a plant (optional)</option>
            {plants.map(plant => (
              <option key={plant._id} value={plant._id}>{plant.name}</option>
            ))}
          </select>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Linking will save this diagnosis to your plant's history
          </p>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="gallery-input"
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="hidden"
        id="camera-input"
      />

      {/* Upload Section */}
      {!selectedImage && !showCameraPreview && !capturedImage && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="max-w-md mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Plant Photo</h3>
              <p className="text-gray-600 mb-4">Take or upload a photo of your plant for diagnosis</p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    console.log('🖼️ Upload Image clicked - opening gallery');
                    document.getElementById('gallery-input').click();
                  }}
                  className="btn-primary inline-flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('📸 Take Photo clicked - opening camera');
                    document.getElementById('camera-input').click();
                  }}
                  className="btn-secondary inline-flex items-center justify-center space-x-2"
                >
                  <Camera className="h-5 w-5" />
                  <span>Take Photo</span>
                </button>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <span className="mr-2">📸</span>
                Tips for Best Results:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Focus on affected leaves or areas</li>
                <li>• Use natural lighting when possible</li>
                <li>• Include multiple symptoms in one photo</li>
                <li>• Avoid blurry or dark images</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Camera Preview */}
      {showCameraPreview && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Camera Preview</h3>
            <div className="relative max-w-md mx-auto">
              <video
                ref={setCameraPreview}
                autoPlay
                playsInline
                className="w-full h-auto max-h-96 rounded-lg border-2 border-green-500"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white border-dashed rounded-full w-48 h-48"></div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={cancelCameraPreview}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={captureImageFromPreview}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>Capture</span>
              </button>
            </div>
            <p className="text-gray-600 mt-4 text-sm">
              Position your plant within the circle and tap Capture when ready
            </p>
          </div>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Captured Image</h3>
            <div className="max-w-md mx-auto">
              <img 
                src={capturedImage} 
                alt="Captured plant" 
                className="w-full h-auto max-h-96 rounded-lg border-2 border-green-500"
              />
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => {
                  cleanupObjectUrl(capturedImage);
                  setCapturedImage(null);
                  handleCameraCapture(); // Restart camera
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Retake
              </button>
              <button
                onClick={() => {
                  // Process the captured image (this will be handled automatically)
                  console.log('Processing captured image');
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Process Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview & Analysis */}
      {selectedImage && !results && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Image Preview</h3>
            <p className="text-gray-600">Review your photo and start analysis</p>
          </div>

          <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-6">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Plant for diagnosis" 
                className="w-full h-48 sm:h-64 object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-900 mb-2">Analyzing your plant with AI...</p>
              <p className="text-gray-600">This may take a few seconds</p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleAnalyze}
                className="btn-primary w-full py-3 text-base sm:text-lg"
              >
                Analyze Plant Health
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary w-full py-2"
              >
                Choose Different Photo
              </button>
              
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Tips for Best Results:
                </h4>
                <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Focus on affected leaves or areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Use natural lighting when possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Include multiple symptoms in one photo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Avoid blurry or dark images</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Diagnosis Results</h2>
            <button
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Plant Identification */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-900 mb-2 flex items-center">
              <span className="mr-2">🌱</span>
              Plant Identification
            </h3>
            <div className="ml-2">
              <p className="text-lg font-semibold text-gray-900">
                {results.plantName}
                {results.commonNames && results.commonNames.length > 0 && (
                  <span className="text-gray-700"> ({results.commonNames[0]})</span>
                )}
              </p>
              {results.scientificName && (
                <p className="text-gray-700 italic">{results.scientificName}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">Confidence: {results.confidence}%</p>
            </div>
          </div>

          {/* Health Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Overall Health Score</span>
              <span className="font-bold text-gray-900">{results.healthScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  results.healthScore >= 80 ? 'bg-green-500' :
                  results.healthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${results.healthScore}%` }}
              />
            </div>
          </div>

          {/* Main Issue */}
          <div className={`rounded-lg p-4 mb-6 ${
            results.severity === 'healthy'
              ? 'bg-green-50 border border-green-200'
              : results.severity === 'severe'
              ? 'bg-red-50 border border-red-200'
              : results.severity === 'moderate'
              ? 'bg-orange-50 border border-orange-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start space-x-3">
              <span className="text-xl">
                {results.severity === 'healthy'
                  ? '✅'
                  : results.severity === 'severe'
                  ? '🚨'
                  : results.severity === 'moderate'
                  ? '⚠️'
                  : '💡'}
              </span>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{results.mainIssue}</h3>
                {results.simpleDescription && (
                  <p className="text-gray-700 mt-1">{results.simpleDescription}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cause (if unhealthy) */}
          {results.cause && results.severity !== 'healthy' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                <span className="mr-2">🔍</span>
                Possible Cause
              </h3>
              <p className="text-blue-800">{results.cause}</p>
            </div>
          )}

          {/* Action Steps */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">
              {results.severity === 'healthy' ? '✨ Care Tips' : '💊 Treatment Steps'}
            </h3>
            <div className="space-y-3">
              {results.actionSteps && results.actionSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="font-bold text-gray-500 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Natural Medicine Options */}
          {results.detailedInfo && results.detailedInfo.naturalRemedies && results.detailedInfo.naturalRemedies.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-green-900 mb-2 flex items-center">
                <span className="mr-2">🌿</span>
                Natural Medicine Options
              </h3>
              <ul className="list-disc list-inside text-green-800 space-y-1">
                {results.detailedInfo.naturalRemedies.map((remedy, index) => (
                  <li key={index}>{remedy}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence Badge */}
          {results.detailedInfo && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
              <p className="font-medium text-gray-700">
                AI Confidence: {results.detailedInfo.probability}%
              </p>
              {results.severity !== 'healthy' && results.detailedInfo.probability < 75 && (
                <p className="text-sm text-gray-600 mt-1">
                  Consider consulting a plant expert for confirmation
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                // Save diagnosis to plant record
                console.log('Save diagnosis to plant');
              }}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Save to Plant Record
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Diagnose Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDiagnosis;