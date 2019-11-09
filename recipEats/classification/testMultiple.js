async function detectMultiple(fileName){
    // Imports the Google Cloud client libraries
    const vision = require('@google-cloud/vision');
    const fs = require('fs');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    //const fileName = "C:\\Users\\Remington\\Pictures\\tomato2.jpg";
    const request = {
    image: {content: fs.readFileSync(fileName)},
    };

    const [result] = await client.objectLocalization(request);
    const objects = result.localizedObjectAnnotations;
    objects.forEach(object => {
    console.log(`Name: ${object.name}`);
    console.log(`Confidence: ${object.score}`);
    const vertices = object.boundingPoly.normalizedVertices;
    vertices.forEach(v => console.log(`x: ${v.x}, y:${v.y}`));
    });
}


detectMultiple("C:\\Users\\Remington\\Pictures\\blt_test5.jpg");