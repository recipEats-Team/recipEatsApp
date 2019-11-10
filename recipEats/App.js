import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableHighlight, Button, Linking } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/

//Retrieving the data with an HTTP request
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;



var recipes = [];

const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'df97b2c4d8824774985ab72ef6420510'
});

var ingredients = [];

var fString = "";

//import { Quickstart } from 'test.js';

// var imageTemp = {
//   image: null,
// }


class recipEats extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    recipe1Info: null,
    recipe2Info: null,
    recipe3Info: null,
  };

  static navigationOptions = {
    title: 'recipEats',
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

      app.models.predict(Clarifai.FOOD_MODEL, photo.base64)
      .then(response => {
          var currentIngredient = [];
          const general = ['food', 'vegetable', 'fruit', 'cuisine', 'grow', 'dish', 'ingredient', 'meat', 'still life', 'leaf vegetable', 'natural foods', 'local food', 'produce', 'vegan nutrition', 'garnish', 'baked goods', 'fast food', 'leaf', 'nature', 'no person', 'ingredients', 'indoors', 'contemporary', 'health', 'nutrition', 'farming', 'juicy'];
          for(var i of response['outputs'][0]['data']['concepts']){
            if(!general.includes(i.name)){
              currentIngredient.push(i.name);
            }
          }
          ingredients.push(currentIngredient[0]);
          console.log(ingredients);
          for (var i = 0; i < currentIngredient.length; i++) {

          }
        })
        .catch(err => {
          console.log(err);
      });


    }
  }

  loadIntoList() {
        var XMLHttpRequest = require("xhr2");
        var request = new XMLHttpRequest;
        console.log("test");
        const copyIngredients = ingredients;
        ingredients = [];
        var strIngredients = "";
        for(var ingredient of copyIngredients){
          strIngredients+=ingredient+",";
        }
        request.open('GET', 'https://www.food2fork.com/api/search?key=b608fc52e7a39e465582bd652ae336d9&q='+ strIngredients, true)
        
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(this.response);
                var topThree = data.recipes.slice(0,3);
                for(var element of topThree){
                    var currentRecipe = {};
                    currentRecipe["recipe_title"] = element.title;
                    currentRecipe["recipe_url"] = element.source_url;
                    currentRecipe["recipe_image"] = element.image_url;
                    recipes.push(currentRecipe);
                }
            } else {
                console.log("error");
            }
            console.log(recipes);
        };
        request.send()
      }

  render() {
    const {navigate} = this.props.navigation;

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

              <TouchableHighlight style={styles.captureButton} disabled={this.props.buttonDisabled}>
                <Button onPress={this.loadIntoList.bind(this)} disabled={this.props.buttonDisabled} title="Get Recipe" accessibilityLabel="Learn more about this button"/>
              </TouchableHighlight>

              <TouchableHighlight style={styles.getRecipeButton} disabled={this.props.buttonDisabled}>
                <Button onPress={() => this.props.navigation.navigate('RecipePage')} disabled={this.props.buttonDisabled} title="Show Recipe" accessibilityLabel="Learn more about this button"/>
              </TouchableHighlight>

            </View>
          </Camera>
        </View>
      );
    }
  }
}

class RecipePage extends React.Component {
  static navigationOptions = {
    title: 'RecipePage',
  };



  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'blue'}}
          onPress={() => Linking.openURL(recipes[0].recipe_url)}>
          {recipes[0].recipe_title} Recipe Link
        </Text>

        <Text style={{color: 'blue'}}
          onPress={() => Linking.openURL(recipes[1].recipe_url)}>
          {recipes[1].recipe_title} Recipe Link
        </Text>

        <Text style={{color: 'blue'}}
          onPress={() => Linking.openURL(recipes[2].recipe_url)}>
          {recipes[2].recipe_title} Recipe Link
        </Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    recipEats: recipEats,
    RecipePage: RecipePage,
  },
  {
    initialRouteName: 'recipEats',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  captureButton: {
    flex: 1,
    //width: 100,
    height: 50,
    // marginTop: 530,
    // marginLeft: 130,
    borderRadius: 100,
    backgroundColor: "#87CEFA",
    borderColor: "white",
    borderWidth: 3,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  getRecipeButton: {
    flex: 1,
    //width: 300,
    height: 50,
    // marginTop: 590,
    // marginLeft: -195,
    borderRadius: 100,
    backgroundColor: "#00BFFF",
    borderColor: "white",
    borderWidth: 3,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  showRecipiesButton: {
    //width: 300,
    height: 50,
    // marginTop: 590,
    // marginLeft: -195,
    borderRadius: 100,
    backgroundColor: "#00BFFF",
    borderColor: "white",
    borderWidth: 3,
    alignItems: 'stretch'
  }
});
