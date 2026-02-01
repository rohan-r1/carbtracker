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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const analyzeImage = async () => {
    if (!capturedImage) return;

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

      // Navigate to confirmation screen
      router.replace('/analyze/confirm-foods');
    } catch (error: any) {
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
        Alert.alert(
          'Analysis Failed',
          'Could not analyze the meal photo. Please try again.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    }
  };

  // Show captured image preview
  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.preview} />

        {/* Description input */}
        <View style={styles.descriptionContainer}>
          {showDescription ? (
            <TextInput
              style={styles.descriptionInput}
              placeholder="Describe the meal (optional, helps with soups/curries)"
              placeholderTextColor={Colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          ) : (
            <TouchableOpacity
              style={styles.addDescriptionButton}
              onPress={() => setShowDescription(true)}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
              <Text style={styles.addDescriptionText}>
                Add description (optional)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
            <Ionicons name="refresh" size={24} color={Colors.text} />
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
            <Text style={styles.analyzeText}>Analyze Meal</Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

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
  descriptionContainer: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
  },
  descriptionInput: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: DesignSystem.BorderRadius.lg,
    padding: DesignSystem.Spacing.lg,
    ...DesignSystem.Typography.body,
    maxHeight: 100,
    ...DesignSystem.Shadows.card,
  },
  addDescriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: DesignSystem.BorderRadius.lg,
    padding: DesignSystem.Spacing.md,
    alignSelf: 'flex-start',
    ...DesignSystem.Shadows.subtle,
  },
  addDescriptionText: {
    ...DesignSystem.Typography.label,
    color: Colors.primary,
    marginLeft: 6,
  },
  previewActions: {
    position: 'absolute',
    bottom: 40,
    left: DesignSystem.Spacing.lg,
    right: DesignSystem.Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: DesignSystem.Spacing.md,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: DesignSystem.Spacing.xl,
    paddingVertical: DesignSystem.Spacing.base,
    borderRadius: DesignSystem.BorderRadius.lg,
    gap: DesignSystem.Spacing.sm,
    ...DesignSystem.Shadows.card,
  },
  retakeText: {
    ...DesignSystem.Typography.button,
    color: Colors.text,
  },
  analyzeButton: {
    flex: 1,
    ...DesignSystem.Button.accent,
    paddingVertical: DesignSystem.Spacing.base,
    flexDirection: 'row',
    gap: DesignSystem.Spacing.sm,
  },
  analyzeText: {
    ...DesignSystem.Button.accentText,
  },
});
