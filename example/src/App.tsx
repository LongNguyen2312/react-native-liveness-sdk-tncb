//import liraries
import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { initSDK, startLiveness } from 'react-native-liveness-sdk-tncb';

// create a component
const VerificationScreen = () => {
  React.useEffect(() => {
    initSDK({
      webUrl: '',
      userKey: '',
      userNm: '',
    });
  }, []);

  const onPressReady = async () => {
    const configAndroid = {
      rounds: 3,
      userReqNum: 'Test',
      siteRequestId: 0,
    };
    const customDescription = {
      frontal: 'Xin vui lòng nhìn vào máy ảnh',
      raise: 'Vui lòng ngẩng đầu lên',
      bending: 'Vui lòng cúi đầu xuống',
      turn_right: 'Vui lòng quay mặt sang bên phải',
      turn_left: 'Vui lòng quay mặt sang bên trái',
      tilt_right: 'Vui lòng nghiêng đầu sang bên phải',
      tilt_left: 'Vui lòng nghiêng đầu sang bên trái',
      open_mouth: 'Hãy mở miệng ra',
      smile: 'Hãy mỉm cười',
    };
    try {
      const res = await startLiveness(configAndroid, customDescription);
      console.log('result', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/path/to/your/image.png' }} // Replace with your image URL
        style={styles.image}
      />
      <Text style={styles.title}>We need to verify your identity</Text>
      <Text style={styles.instructions}>You will need to:</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>Scan the front of your photo ID</Text>
        <Text style={styles.listItem}>Scan the back of your photo ID</Text>
        <Text style={styles.listItem}>Take a selfie</Text>
      </View>
      <Button title="I'm ready" onPress={onPressReady} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00BFFF', // Adjust background color
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    color: '#fff',
  },
});

// make this component available to the app
export default VerificationScreen;
