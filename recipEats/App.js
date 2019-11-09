import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableHighlight, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePctureAsync();
      console.log(photo);
    }
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                  // this.camera.takePictureAsync().then((image64)=>{
                  //   console.log(image64);
                  // })
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, marginLeft: 5, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
              <TouchableHighlight style={styles.captureButton} disabled={this.props.buttonDisabled}>
                <Button onPress={this.props.onClick} disabled={this.props.buttonDisabled} title="Capture" accessibilityLabel="Learn more about this button"/>
              </TouchableHighlight>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  captureButton: {
    width: 160,
    height: 50,
    marginTop: 570,
    marginLeft: 97,
    borderRadius: 100,
    backgroundColor: "red",
    borderColor: "white",
    borderWidth: 3
  }
});
