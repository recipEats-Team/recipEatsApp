async function quickstart(imageTemp) {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    const [result] = await client.labelDetection(imageTemp.image.uri);
    const labels = result.labelAnnotations;
    //console.log('Labels:');
    //labels.forEach(label => console.log(label.description));
    //general descriptions to get rid ofs
    const general = ['Food', 'Vegetable', 'Fruit', 'Cuisine', 'Dish', 'Ingredient', 'Meat', 'Leaf vegetable', 'Natural foods', 'Local food', 'Produce', 'Vegan nutrition', 'Garnish', 'Baked goods', 'Fast food'];
    var finalLabels = [];
    for(var label of labels){
      if(!general.includes(label.description)){
        finalLabels.push(label.description);
      }
    }
    console.log(finalLabels[0]);
  }

//Gets label 'value' from promise object returned by quickstart async function
//quickstart().then(value => console.log(value));
