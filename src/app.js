const express = require("express");
const app = express();
const hbs = require('hbs');
const path = require('path');
const port = 3000;

const weatherData = require('../utils/weatherData')
const publicStaticDirPath= path.join(__dirname,'../public');

const viewPath = path.join(__dirname,'../templates/views');
const partialPath = path.join(__dirname,'../templates/partials');

app.set('view engine','hbs');
app.set('views',viewPath);
hbs.registerPartials(partialPath);

app.use(express.static(publicStaticDirPath));



app.get("", (req, res) => {
  res.render('index',{
    title : 'Weather APP'
  });
});

app.get("/weather", (req, res) => {
    const address = req.query.address;
    if(!address){
      return res.send({
        error : 'Enter Something in the search text box'
      })
    }
    weatherData(address,(error,{temperature,description,cityName}={})=>{
      if(error){
        return res.send({
          error
        })
      }
      console.log(temperature,description,cityName);
      res.send({
        temperature,
        description,
        cityName
      })

    })
    
});

app.get("*", (req, res) => {
    res.render('404',{
      title : 'Page does not exist!! Try Again'
    })
  });

app.listen(port, () => {
  console.log(`Server Started on Port :${port}`);
});
