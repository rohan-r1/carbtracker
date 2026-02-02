import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { useAnalysisStore } from '@/store/analysisStore';
import { apiClient } from '@/services/api';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const {
    setCurrentImage,
    setDescription: setStoreDescription,
    setAnalysisResult,
    setIsAnalyzing,
    reset,
  } = useAnalysisStore();

  // Request permission if not granted
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          CarbTracker needs camera access to take photos of your meals for carb
          estimation.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo) {
        setCapturedImage(photo.uri);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setDescription('');
    setShowDescription(false);
  };

  const handleSkipDescription = () => {
    setDescription('');  // Clear any partial input
    analyzeImage();       // Proceed to analysis
  };

  const analyzeImage = async () => {
    if (!capturedImage) {
      Alert.alert('Error', 'No image captured');
      return;
    }

    reset();
    setCurrentImage(capturedImage);
    setStoreDescription(description || null);
    setIsAnalyzing(true);

    // Navigate to loading screen
    router.push('/analyze/loading');

    try {
      const result = await apiClient.analyzeImage(
        capturedImage,
        description || undefined
      );
      setAnalysisResult(result);
      setIsAnalyzing(false);
      // Loading screen will auto-navigate when it detects analysis is complete
    } catch (error: any) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);

      // Check if it's a "no food detected" error
      const isNoFoodError =
        error?.response?.status === 422 &&
        error?.response?.data?.detail?.error === 'no_food_detected';

      if (isNoFoodError) {
        const message = error.response.data.detail.message;
        Alert.alert(
          'No Food Detected',
          message || 'We couldn\'t identify any food in this photo. Please take another photo with your meal clearly visible.',
          [
            {
              text: 'Retake Photo',
              onPress: () => {
                router.back();
                retakePicture();
              }
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        // Show detailed error message
        const errorMessage = error?.response?.data?.detail
          || error?.message
          || 'Could not analyze the meal photo. Please check your internet connection and try again.';

        Alert.alert(
          'Analysis Failed',
          `Error: ${errorMessage}\n\nIs the backend API running?`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    }
  };

  // Show captured image preview
  if (capturedImage) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={0}
      >
        <Image source={{ uri: capturedImage }} style={styles.preview} />

        {/* Bottom section with description and buttons */}
        <View style={styles.bottomSection}>
          {/* Description input */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>
              Describe your meal (helps with accuracy):
            </Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="e.g., Chicken curry with rice, Caesar salad..."
              placeholderTextColor={Colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>

          {/* Action buttons */}
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipDescription}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
              <Text style={styles.analyzeText}>Analyze Meal</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
              <Ionicons name="refresh" size={20} color={Colors.text} />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Camera overlay */}
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          Position your meal in the frame
        </Text>
      </View>

      {/* Camera controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Ionicons name="images" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
        >
          <Ionicons name="camera-reverse" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DesignSystem.Spacing.xxxl,
    backgroundColor: Colors.background,
  },
  permissionTitle: {
    ...DesignSystem.Typography.h2,
    marginTop: DesignSystem.Spacing.base,
    marginBottom: DesignSystem.Spacing.sm,
  },
  permissionText: {
    ...DesignSystem.Typography.body,
    textAlign: 'center',
    marginBottom: DesignSystem.Spacing.xl,
  },
  permissionButton: {
    ...DesignSystem.Button.accent,
    paddingHorizontal: DesignSystem.Spacing.xxxl,
    paddingVertical: DesignSystem.Spacing.base,
  },
  permissionButtonText: {
    ...DesignSystem.Button.accentText,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  bottomSection: {
    paddingBottom: DesignSystem.Spacing.base,
  },
  descriptionContainer: {
    marginHorizontal: DesignSystem.Spacing.base,
    marginBottom: DesignSystem.Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: DesignSystem.BorderRadius.lg,
    padding: DesignSystem.Spacing.md,
    ...DesignSystem.Shadows.medium,
  },
  descriptionLabel: {
    ...DesignSystem.Typography.label,
    color: Colors.text,
    marginBottom: DesignSystem.Spacing.xs,
    fontWeight: '600',
  },
  descriptionInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: DesignSystem.BorderRadius.md,
    padding: DesignSystem.Spacing.md,
    ...DesignSystem.Typography.body,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  previewActions: {
    flexDirection: 'row',
    paddingHorizontal: DesignSystem.Spacing.base,
    gap: DesignSystem.Spacing.sm,
    paddingBottom: DesignSystem.Spacing.base,
  },
  skipButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: DesignSystem.Spacing.md,
    borderRadius: DesignSystem.BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: DesignSystem.Spacing.xs,
  },
  skipText: {
    ...DesignSystem.Typography.button,
    color: Colors.text,
    fontSize: 14,
  },
  analyzeButton: {
    flex: 1.5,
    ...DesignSystem.Button.accent,
    paddingVertical: DesignSystem.Spacing.md,
    flexDirection: 'row',
    gap: DesignSystem.Spacing.xs,
  },
  analyzeText: {
    ...DesignSystem.Button.accentText,
    fontSize: 14,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: DesignSystem.Spacing.md,
    borderRadius: DesignSystem.BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: DesignSystem.Spacing.xs,
  },
  retakeText: {
    ...DesignSystem.Typography.button,
    color: Colors.text,
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
