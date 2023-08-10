const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors'); 

const app = express();
app.use(cors());
app.use(express.static(__dirname));
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // 10-minute cache

const GNEWS_API_KEY = '2c24c6917b4c83a4dc6ff385efa69137'; // Replace with your GNews API key

// Middleware to handle caching
const cacheMiddleware = (req, res, next) => {
  const cacheKey = req.originalUrl;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }
  next();
};

// Route to fetch N news articles
app.get('/articles/:count', cacheMiddleware, async (req, res) => {
  const { count } = req.params;
  try {
    const response = await axios.get(`https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&max=${count}`);
    const articles = response.data.articles;
    cache.set(req.originalUrl, articles);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Route to find a news article with a specific title
app.get('/article/title/:title', cacheMiddleware, async (req, res) => {
  const { title } = req.params;
  try {
    const response = await axios.get(`https://gnews.io/api/v4/search?q=${encodeURIComponent(title)}&token=${GNEWS_API_KEY}`);
    const articles = response.data.articles;
    cache.set(req.originalUrl, articles);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Route to find news articles with a specific author
app.get('/article/author/:author', cacheMiddleware, async (req, res) => {
  const { author } = req.params;
  try {
    const response = await axios.get(`https://gnews.io/api/v4/search?lang=en&q=${encodeURIComponent(author)}&token=${GNEWS_API_KEY}`);
    const articles = response.data.articles;
    cache.set(req.originalUrl, articles);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Route to search news articles by keywords
app.get('/search/:keywords', cacheMiddleware, async (req, res) => {
  const { keywords } = req.params;
  try {
    const response = await axios.get(`https://gnews.io/api/v4/search?q=${encodeURIComponent(keywords)}&token=${GNEWS_API_KEY}`);
    const articles = response.data.articles;
    cache.set(req.originalUrl, articles);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
