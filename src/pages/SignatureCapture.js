import React, { useState } from 'react';
import { View, Button, StyleSheet, Image } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const SignatureCapture = ({ onCapture }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const handleCapture = async () => {
    if (device) {
      const photo = await device.takePhoto();
      setCapturedImage(photo.uri);
      onCapture(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
        />
      )}
      <Button title="Capture Signature" onPress={handleCapture} />
      {capturedImage && (
        <Image
          source={{ uri: capturedImage }}
          style={styles.signature}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  camera: {
    width: '100%',
    height: 300,
  },
  signature: {
    width: 200,
    height: 100,
    marginTop: 20,
  },
});

export default SignatureCapture;
