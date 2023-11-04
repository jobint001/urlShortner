const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shorturl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle the error gracefully
  }
});

app.post('/shortUrls', async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle the error gracefully
  }
});

app.get('/:shortUrl', async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    await shortUrl.save();

    res.redirect(shortUrl.full);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Handle the error gracefully
  }
});

app.listen(process.env.PORT || 5000);
