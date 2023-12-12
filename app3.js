const express = require('express');
const exphbs = require('express-handlebars');
const movieService = require('./movieService');
const topmovies = require('./topmovies');
const db = require('./database');
const dbs = require('./dbs');
const dbb = require('./Dbb');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;


const hbs = exphbs.create({
    //handlebars: customHelpers,
    extname: '.hbs', 
    //partialsDir: path.join(__dirname, 'views/partials'),
  });
  
  //hbs.handlebars.registerPartial('header', fs.readFileSync(path.join(__dirname, 'views/partials/header.hbs'), 'utf8'));
  //hbs.handlebars.registerPartial('footer', fs.readFileSync(path.join(__dirname, 'views/partials/footer.hbs'), 'utf8'));
  
  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  
  app.engine(
    'hbs',
    exphbs.engine({
    
      extname: '.hbs',
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
      //handlebars: customHelpers
    })
  );
  app.set('view engine', 'hbs');
  
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key', // Change this to a random and secure key
  resave: true,
  saveUninitialized: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the initializeDatabase function before setting up routes and starting the server
dbs.initializeDatabase()
  .then(() => {

    app.get('/', async (req, res) => {
        try {
          // Fetch the top 10 movies based on IMDb rating
          const topMovies = await topmovies.getTopMovies(10);
      
          // Render the 'dashboard' view with the top movies
          res.render('dashboard', { topMovies });
        } catch (error) {
          console.error('Error fetching top movies:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    // Login route
    app.get('/login', (req, res) => {
      res.render('loginForm');
    });

    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!dbs.isInitialized()) {
          throw new Error('Database not initialized. Call initialize() first.');
        }

        const user = await dbs.getUserByEmailAndPassword(email, password);

        if (user) {
          req.session.user = user;
          res.redirect('/search');
        } else {
          res.render('loginForm', { error: 'Invalid email or password' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Registration route
    app.get('/register', (req, res) => {
      res.render('registerForm');
    });

    app.post('/register', async (req, res) => {
      try {
        const { name, email, password } = req.body;
        const existingUser = await dbs.getUserByEmail(email);

        if (existingUser) {
          res.render('registerForm', { error: 'Email already in use' });
        } else {
          await dbs.addUser({ name, email, password });
          res.redirect('/login');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Search route
    app.get('/search', (req, res) => {
      if (!req.session.user) {
        res.redirect('/login');
      } else {
        res.render('searchForm');
      }
    });

    app.post('/search', async (req, res) => {
      try {
        const page = parseInt(req.body.page) || 1;
        const perPage = parseInt(req.body.perPage) || 10;
        const title = req.body.title || '';

        const movies = await movieService.getAllMovies(page, perPage, title);

        res.render('searchResults', { movies });
      } catch (error) {
        console.error('Error getting Movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/logout', (req, res) => {
        // Destroy the session and redirect to the login page
        req.session.destroy((err) => {
          if (err) {
            console.error('Error during logout:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.redirect('/login');
          }
        });
      });
      

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start the server:', err);
  });
