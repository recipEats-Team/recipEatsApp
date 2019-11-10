import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableHighlight, Button, Linking, Image } from 'react-native';
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

class HomePage extends React.Component {
  static navigationOptions = {
    title: 'HomePage',
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#32d8f9'}}>
        <Image
          style={{width: 120, height: 120}}
          source={require('./logo_without_name.png')}
        />
        <Text style={{fontSize: 31, marginBottom: 10}}>
          Welcome to recipEats!
        </Text>
        <TouchableHighlight style={{height: 50, borderRadius: 100, backgroundColor: "#D3D3D3", borderColor: "white", borderWidth: 1}} disabled={this.props.buttonDisabled}>
          <Button onPress={() => this.props.navigation.navigate('recipEats')} disabled={this.props.buttonDisabled} title="Take a Picture" accessibilityLabel="Learn more about this button"/>
        </TouchableHighlight>
      </View>
    )
  }
}


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
        })
        .catch(err => {
          console.log(err);
        });


    }
  }

  loadIntoList() {
        var XMLHttpRequest = require("xhr2");
        var request = new XMLHttpRequest;
        const copyIngredients = ingredients;
        ingredients = [];
        var strIngredients = "";
        for(var ingredient of copyIngredients){
          strIngredients+=ingredient+",";
        }

        request.open('GET', 'https://www.food2fork.com/api/search?key=f44660c756daa0d74cd838fa500e6b00&q='+ strIngredients, true);
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
        request.send();
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
                <Text style={styles.flipButton}> Flip </Text>
              </TouchableOpacity>
              <TouchableHighlight style={styles.captureButton} disabled={this.props.buttonDisabled}>
                <Button onPress={this.snap.bind(this)} disabled={this.props.buttonDisabled} title="Capture" accessibilityLabel="Learn more about this button"/>
              </TouchableHighlight>

              <TouchableHighlight style={styles.captureButton2} disabled={this.props.buttonDisabled}>
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
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#32d8f9"}}>
        <Image
          style={{width: 240, height: 120, position: 'absolute', top: 10, left: 50}}
          source={require('./wide_banner.png')}
        />
        <Text style={{fontSize: 21}}>
          {recipes[0].recipe_title}
        </Text>
        <Text style={{color: 'blue', marginBottom: 40}}
          onPress={() => Linking.openURL(recipes[0].recipe_url)}>
          1. {recipes[0].recipe_title} Recipe Link
        </Text>

        <Text style={{fontSize: 21}}>
          {recipes[1].recipe_title}
        </Text>
        <Text style={{color: 'blue', marginBottom: 40}}
          onPress={() => Linking.openURL(recipes[1].recipe_url)}>
          2. {recipes[1].recipe_title} Recipe Link
        </Text>

        <Text style={{fontSize: 21}}>
          {recipes[2].recipe_title}
        </Text>
        <Text style={{color: 'blue', marginBottom: 40}}
          onPress={() => Linking.openURL(recipes[2].recipe_url)}>
          3. {recipes[2].recipe_title} Recipe Link
        </Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    HomePage: HomePage,
    recipEats: recipEats,
    RecipePage: RecipePage,
  },
  {
    initialRouteName: 'HomePage',
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
    //width: 100,
    height: 50,
    // marginTop: 530,
    // marginLeft: 130,
    borderRadius: 100,
    backgroundColor: "#87CEFA",
    borderColor: "white",
    borderWidth: 3,
    position: 'absolute',
    bottom: 60,
    left: 20,
  },
  captureButton2: {
    //width: 100,
    height: 50,
    // marginTop: 530,
    // marginLeft: 130,
    borderRadius: 100,
    backgroundColor: "#87CEFA",
    borderColor: "white",
    borderWidth: 3,
    position: 'absolute',
    bottom: 60,
    left: 120,
  },
  getRecipeButton: {
    //width: 300,
    height: 50,
    // marginTop: 590,
    // marginLeft: -195,
    borderRadius: 100,
    backgroundColor: "#00BFFF",
    borderColor: "white",
    borderWidth: 3,
    position: 'absolute',
    bottom: 60,
    left: 245,
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
    position: 'absolute',
    bottom: 10,
  },
  flipButton: {
     fontSize: 18,
     color: 'white',
     position: 'absolute',
     bottom: 20,
     left: 40,
  }
});
