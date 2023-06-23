const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', (req, res) => {
  const city = req.query.city;

  if (!city) {
    // Render the initial form if no city is provided
    res.render('aqi', { aqiData: null });
    return;
  }

  // Construct the API URL
  const apiUrl = `https://api.waqi.info/feed/${city}/?token=3384b09b33dece368cea032594de015cab94b9b0`;

  // Make a request to the AQI API
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const aqiData = data.data; // Extract the AQI data from the API response
      res.render('aqi', { aqiData }); // Pass the AQI data to the view for rendering
    })
    .catch((error) => {
      console.log('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

//julian start


//julian end

app.listen(567, () => {
  console.log('Server is running on port 3000');
});

//SERVER.JS