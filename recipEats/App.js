import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableHighlight, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'df97b2c4d8824774985ab72ef6420510'
});
var ingredients = [];

//import { Quickstart } from 'test.js';

// var imageTemp = {
//   image: null,
// }


export default class recipEats extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }


  async snap() {
    if (this.camera) {
      const options = {
        base64: true,
      }

      let photo = await this.camera.takePictureAsync(options);

      app.models.predict(Clarifai.GENERAL_MODEL, photo.base64)
      .then(response => {
          var currentIngredient = [];
          const general = ['food', 'vegetable', 'fruit', 'cuisine', 'grow', 'dish', 'ingredient', 'meat', 'still life', 'leaf vegetable', 'natural foods', 'local food', 'produce', 'vegan nutrition', 'garnish', 'baked goods', 'fast food', 'leaf', 'nature', 'no person', 'ingredients', 'indoors', 'contemporary', 'health'];
          for(var i of response['outputs'][0]['data']['concepts']){
            if(!general.includes(i.name)){
              currentIngredient.push(i.name);
            }
          }
          ingredients.push(currentIngredient[0]);
          console.log(ingredients);
        })
        .catch(err => {
          console.log(err);
      });
      

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
          <Camera style={{ flex: 1 }} type={this.state.type}
            ref={ref => {
              //console.log(ref);
              this.camera = ref;
          }}>
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
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, marginLeft: 5, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
              <TouchableHighlight style={styles.captureButton} disabled={this.props.buttonDisabled}>
                <Button onPress={this.snap.bind(this)} disabled={this.props.buttonDisabled} title="Capture" accessibilityLabel="Learn more about this button"/>
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
