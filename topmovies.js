const Movie = require('./models/Movie'); // Adjust the path to your Movie model

const getTopMovies = async () => {
  try {
    // Fetch top movies from the database, you may customize the query based on your criteria
    const topMovies = await Movie.find({}).sort({ rating: -1 }).limit(10);

    return topMovies;
  } catch (error) {
    console.error('Error fetching top movies:', error);
    throw error;
  }
};

module.exports = { getTopMovies };
