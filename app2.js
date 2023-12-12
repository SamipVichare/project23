const express = require('express');
const exphbs = require('express-handlebars');
const movieService = require('./movieService');
const db = require('./database');
const helpers = require('./helpers');

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

// Replace this with your actual MongoDB connection string
const connectionString = "mongodb+srv://vicharesamip:admin@admin.2e0txqd.mongodb.net/sample_mflix";

// Use a promise to start the server after the connection is established
db.initialize(connectionString)
  .then(() => {
    // Continue with your routes and server setup
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/search', (req, res) => {
      res.render('searchForm');
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

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB. Check your connection string.');
  });
