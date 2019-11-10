async function quickstart() {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    const [result] = await client.labelDetection("file:///var/mobile/Containers/Data/Application/5195D26A-F3D3-4DE5-92EC-763E6FCBA418/Library/Caches/ExponentExperienceData/%2540garyzlobinskiy%252Fexpo-template-bare/Camera/9E2E0EE1-A3A9-4B38-97EA-D89583D2E230.jpg");
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
    return finalLabels[0];
  }

//Gets label 'value' from promise object returned by quickstart async function
quickstart().then(value => console.log(value));
