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

  // Enables CORS
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}