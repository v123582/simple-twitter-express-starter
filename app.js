const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const passport = require('./config/passport');
const helpers = require('./_helpers');
const handlebarsHelpers = require('./config/handlebars-helpers');
const db = require('./models');

const app = express();
const port = 3000;

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

app.use('/upload', express.static(__dirname + '/upload')); // eslint-disable-line

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// setup handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main', helpers: handlebarsHelpers }));
app.set('view engine', 'handlebars');

// setup bodyParser for POST body
app.use(bodyParser.urlencoded({ extended: true }));

// setup session
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

// setup passport
app.use(passport.initialize());
app.use(passport.session());

// setup flash message
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.user = helpers.getUser(req);
  next();
});

// setup form method override
app.use(methodOverride('_method'));

app.listen(port, () => {
  db.sequelize.sync(); // 跟資料庫同步
  console.log(`Example app listening on port ${port}!`); // eslint-disable-line
});

require('./routes')(app, passport);

module.exports = app;
