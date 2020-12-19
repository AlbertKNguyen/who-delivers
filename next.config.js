module.exports = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    MAPBOX_KEY: process.env.MAPBOX_KEY,
    GOOGLE_KEY: process.env.GOOGLE_KEY,
    YELP_KEY: process.env.YELP_KEY,
    SCRAPER_KEY: process.env.SCRAPER_KEY,
    SECRET_KEY: process.env.SECRET_KEY
  },
  images: {
    domains: ['google.com'],
  },
}