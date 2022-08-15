import styles from 'ansi-styles';
import express from 'express';
import axios from 'axios';

const PAGE_BREAK = '\x1Bc';

const getAirQualityData = async (
  lat = '35.779',
  lon = '-78.638',
  hours = '1'
) => {
  const options = {
    method: 'GET',
    url: 'https://air-quality.p.rapidapi.com/forecast/airquality',
    params: { lat, lon, hours },
    headers: {
      'X-RapidAPI-Key': '9879842b9fmsh564e143abaa81b7p179138jsn63a44ab478d2',
      'X-RapidAPI-Host': 'air-quality.p.rapidapi.com',
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data.data[0];
    })
    .catch(function (error) {
      console.error(error);
    });
};

const app = express();

const formatAirQualityOutput = (airQualityData) => {
  const pm10 =
    airQualityData.pm10 < 150
      ? `${styles.green.open}PM10${styles.green.close}${styles.green.open} ${airQualityData.pm10}${styles.green.close}`
      : `${styles.red.open}PM10${styles.red.close}${styles.red.open}: ${airQualityData.pm10}${styles.red.close}`;

  const pm25 =
    airQualityData.pm10 < 35
      ? `${styles.green.open}PM25${styles.green.close}${styles.green.open} ${airQualityData.pm25}${styles.green.close}`
      : `${styles.red.open}PM25${styles.red.close}${styles.red.open}: ${airQualityData.pm25}${styles.red.close}`;
  return `${PAGE_BREAK}
    ${styles.green.open}Air Quality!${styles.green.close}
    ${pm10}
    ${pm25}
    `;
};

app.get('/anime-hello', async (req, res) => {
  const airQualityData = await getAirQualityData();
  res.send(formatAirQualityOutput(airQualityData));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Air quality app listening on port ${PORT}!`)
);
