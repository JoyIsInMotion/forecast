import { useState } from 'react'
import {
  WiCloud,
  WiDayCloudy,
  WiDaySunny,
  WiFog,
  WiRain,
  WiRaindrops,
  WiSnow,
  WiThunderstorm,
} from 'react-icons/wi'

const weatherCodeMap = {
  0: { label: 'Clear sky', icon: WiDaySunny },
  1: { label: 'Mainly clear', icon: WiDaySunny },
  2: { label: 'Partly cloudy', icon: WiDayCloudy },
  3: { label: 'Overcast', icon: WiCloud },
  45: { label: 'Fog', icon: WiFog },
  48: { label: 'Depositing rime fog', icon: WiFog },
  51: { label: 'Light drizzle', icon: WiRaindrops },
  53: { label: 'Moderate drizzle', icon: WiRaindrops },
  55: { label: 'Dense drizzle', icon: WiRaindrops },
  56: { label: 'Freezing drizzle', icon: WiRaindrops },
  57: { label: 'Dense freezing drizzle', icon: WiRaindrops },
  61: { label: 'Slight rain', icon: WiRain },
  63: { label: 'Moderate rain', icon: WiRain },
  65: { label: 'Heavy rain', icon: WiRain },
  66: { label: 'Freezing rain', icon: WiRain },
  67: { label: 'Heavy freezing rain', icon: WiRain },
  71: { label: 'Slight snow fall', icon: WiSnow },
  73: { label: 'Moderate snow fall', icon: WiSnow },
  75: { label: 'Heavy snow fall', icon: WiSnow },
  77: { label: 'Snow grains', icon: WiSnow },
  80: { label: 'Slight rain showers', icon: WiRain },
  81: { label: 'Moderate rain showers', icon: WiRain },
  82: { label: 'Violent rain showers', icon: WiThunderstorm },
  85: { label: 'Slight snow showers', icon: WiSnow },
  86: { label: 'Heavy snow showers', icon: WiSnow },
  95: { label: 'Thunderstorm', icon: WiThunderstorm },
  96: { label: 'Thunderstorm with slight hail', icon: WiThunderstorm },
  99: { label: 'Thunderstorm with heavy hail', icon: WiThunderstorm },
}

const getWeatherMeta = (code) => {
  return weatherCodeMap[code] ?? { label: 'Unknown', icon: WiCloud }
}

const formatDay = (isoDate) => {
  return new Date(isoDate).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function App() {
  const [cityInput, setCityInput] = useState('London')
  const [searchCity, setSearchCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [weatherData, setWeatherData] = useState(null)

  const fetchWeather = async (city) => {
    setLoading(true)
    setError('')

    try {
      const geocodeResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
      )

      if (!geocodeResponse.ok) {
        throw new Error('Could not fetch city location.')
      }

      const geocodeData = await geocodeResponse.json()
      const cityResult = geocodeData?.results?.[0]

      if (!cityResult) {
        throw new Error('City not found. Try another name.')
      }

      const { latitude, longitude, name, country } = cityResult
      const forecastResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=6&timezone=auto`,
      )

      if (!forecastResponse.ok) {
        throw new Error('Could not fetch weather forecast.')
      }

      const forecastData = await forecastResponse.json()

      setWeatherData({
        city: `${name}, ${country}`,
        ...forecastData,
      })
      setSearchCity(city)
    } catch (fetchError) {
      setWeatherData(null)
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }

  const currentMeta = weatherData?.current
    ? getWeatherMeta(weatherData.current.weather_code)
    : null

  const dailyForecast = weatherData?.daily
    ? weatherData.daily.time.map((day, index) => ({
        day,
        max: weatherData.daily.temperature_2m_max[index],
        min: weatherData.daily.temperature_2m_min[index],
        code: weatherData.daily.weather_code[index],
      }))
    : []

  const handleSearch = () => {
    if (!cityInput.trim()) {
      setError('Please enter a city.')
      return
    }

    fetchWeather(cityInput.trim())
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleSearch()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-200 px-4 py-8 text-slate-800">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/70 bg-white/75 p-5 shadow-xl backdrop-blur-sm md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Open-Meteo Forecast
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">City Weather Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Enter a city, click Search, and get live weather plus a multi-day forecast.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300"
            type="text"
            value={cityInput}
            onChange={(event) => setCityInput(event.target.value)}
            placeholder="Enter city name (e.g., Nairobi, Tokyo, New York)"
            aria-label="City name"
          />
          <button
            className="rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error ? (
          <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-700">
            {error}
          </div>
        ) : null}

        {weatherData && currentMeta ? (
          <section className="grid gap-4 md:grid-cols-[1.3fr,1fr]">
            <article className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
              <p className="text-sm uppercase tracking-widest text-cyan-300">Current Weather</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">{weatherData.city}</h2>
              <p className="mt-1 text-cyan-200">Searched for: {searchCity}</p>

              <div className="mt-5 flex items-center gap-4">
                <currentMeta.icon className="text-7xl text-cyan-300" />
                <div>
                  <p className="text-5xl font-bold">
                    {Math.round(weatherData.current.temperature_2m)}
                    {weatherData.current_units.temperature_2m}
                  </p>
                  <p className="text-lg text-cyan-100">{currentMeta.label}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                <p>
                  Feels like:{' '}
                  <span className="font-semibold text-white">
                    {Math.round(weatherData.current.apparent_temperature)}
                    {weatherData.current_units.apparent_temperature}
                  </span>
                </p>
                <p>
                  Wind:{' '}
                  <span className="font-semibold text-white">
                    {Math.round(weatherData.current.wind_speed_10m)}
                    {weatherData.current_units.wind_speed_10m}
                  </span>
                </p>
              </div>
            </article>

            <article className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Next Few Days</h3>
              <div className="mt-4 space-y-2">
                {dailyForecast.slice(1).map((item) => {
                  const dayMeta = getWeatherMeta(item.code)

                  return (
                    <div
                      key={item.day}
                      className="grid grid-cols-[1fr,auto,auto] items-center gap-3 rounded-xl bg-slate-50 px-3 py-2"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{formatDay(item.day)}</p>
                        <p className="text-sm text-slate-500">{dayMeta.label}</p>
                      </div>
                      <dayMeta.icon className="text-3xl text-cyan-700" />
                      <p className="text-sm font-semibold text-slate-700">
                        {Math.round(item.max)}° / {Math.round(item.min)}°
                      </p>
                    </div>
                  )
                })}
              </div>
            </article>
          </section>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
            Search for a city to see weather information.
          </div>
        )}
      </div>
    </main>
  )
}

export default App
