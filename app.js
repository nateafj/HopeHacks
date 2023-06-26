const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('home', { });
});

app.get('/airQuality', (req, res) => {
  const apiKey = '08D5FF0B-FE8E-4121-B16B-D46CC14D62AA';
  const zipCode = req.query.zipcode; // Example: set the desired ZIP code

  const url = `https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zipCode}&API_KEY=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const airQualityData = {
        aqi: null,
        category: null,
        pollutants: []
      };

      if (data.length > 0) {
        const firstDataPoint = data[0];
        airQualityData.aqi = firstDataPoint.AQI;
        airQualityData.category = firstDataPoint.Category?.Name;
        airQualityData.categoryNumber = firstDataPoint.Category?.Number;

        // Read thev json where you will have the custom message: https://www.geeksforgeeks.org/how-to-read-and-write-json-file-using-node-js/
        // fetch that specfic message from the JSOn and append it to the airQualiy Data

        data.forEach(item => {
          const pollutant = {
            pollutant: item.ParameterName,
            concentration: item.AQI,
            unit: item.Unit,
          };

          airQualityData.pollutants.push(pollutant);
        });
      }
      res.render('airQuality', { airQualityData });
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
