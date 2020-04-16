
  

var mongoose=require('mongoose');
var express=require('express');
var bodyParser=require('body-parser');
const passport=require('passport');
const bcrypt=require("bcrypt");
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/User');
const { ensureAuthenticated }=require('./config/auth');

// Passport Config
require('./config/passport')(passport);

var app=express();
app.use(bodyParser.urlencoded({extended:false}));
mongoose.connect('mongodb://localhost:27017/intern', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log(" we're connected!")
});

/*app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())*/
/*app.use(methodOverride('_method'))*/

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

  // Connect flash
app.use(flash());

app.set('view engine', 'ejs');
  
  app.get('/',  (req, res) => {
    res.sendFile(__dirname+'/index.html')
  })

  app.get('/login', (req, res) => {
    res.sendFile(__dirname+'/login.html');
  })
  
  
  app.post('/', async (req,res)=>{
     
      try{
      const hashed= await bcrypt.hash(req.body.password,10 )
      const aman=new User({
          name:req.body.name,
          email:req.body.email,
          password:hashed
      })
      aman.save() 

      res.redirect('/login')
      }
      catch(err){
          console.log(err)
    res.redirect('/') 
      }
  })
  app.get('/done',ensureAuthenticated,(req,res)=>{
    res.render('done',{user:req.user});
  })

  // Login
  app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/done',
      failureRedirect: '/login',
    
    })(req, res, next);
  });

  app.get('/logout', (req, res) => {
    req.logout();
    /*req.flash('success_msg', 'You are logged out');*/
    res.redirect('/login');
  });

  

  app.listen(3001,()=>{
      console.log("server ")
  })

