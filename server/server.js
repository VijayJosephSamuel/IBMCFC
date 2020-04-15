// import dependencies and initialize express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const healthRoutes = require('./routes/health-route');
const swaggerRoutes = require('./routes/swagger-route');


var indexRouter = require('./routes/index');


const app = express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));






// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(CookieParser());
// routes and api calls
app.use('/health', healthRoutes);
app.use('/swagger', swaggerRoutes);
app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, 'public')));



// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
  console.log(`Swagger UI available http://localhost:${port}/swagger/api-docs`);
});

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

module.exports = app;
