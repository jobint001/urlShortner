const express = require('express');
const mongoose = require('mongoose')
const shorturl = require('./models/shorturl')
const app = express();

mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser:true,useUnifiedTopology:true
})
app.use(express.urlencoded({ extended:false}))
app.set("view engine","ejs");

app.get('/',async (req,res)=>{
    const shortUrls= await shorturl.find()
    res.render('index',{shortUrls:shortUrls})
    
})

app.post('/shorturls', async (req,res)=>{
   await shorturl.create({full:req.body.fullurl})
   res.redirect('/')

})
app.listen(process.env.PORT||5000)