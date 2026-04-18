# Weather Forecast App (React + Vite + Tailwind)

This project shows weather by city using the free Open-Meteo API.

## Features

- Search flow: enter city -> click Search -> display weather
- Current weather card (temperature, feels-like, wind, condition)
- Multi-day forecast card (next few days)
- Weather icons based on Open-Meteo weather codes
- Responsive UI built with Tailwind CSS

## Tech Stack

- React
- Vite
- Tailwind CSS
- Open-Meteo API (geocoding + forecast)
- react-icons (weather icons)

## Run Locally

```bash
npm install
npm run dev
```

## Run Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Deployment (GitHub Pages)

https://joyisinmotion.github.io/forecast/

## Open-Meteo Flow
The app uses two API calls when you search:

1. Geocoding API:
  - Converts city name -> latitude/longitude
  - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
2. Forecast API:
  - Uses latitude/longitude -> current + daily weather
  - Endpoint: `https://api.open-meteo.com/v1/forecast`

## Known Limitations

- Some city names are ambiguous (same name in multiple countries).
- Search currently picks the first geocoding result.
- No offline mode; internet is required.





