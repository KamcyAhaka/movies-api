const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies & Reviews API',
    description: 'CSE341 Web Services API for managing movies and reviews with MongoDB and OAuth authentication',
    version: '2.0.0',
  },
  host: process.env.HOST || 'movies-api-j8pw.onrender.com',
  schemes: ['https', 'http'],
  tags: [
    {
      name: 'Home',
      description: 'Root endpoint and status',
    },
    {
      name: 'Authentication',
      description: 'OAuth 2.0 and local bcrypt account endpoints',
    },
    {
      name: 'Movies',
      description: 'Operations on the movies collection (Protected write/update/delete)',
    },
    {
      name: 'Reviews',
      description: 'Operations on the reviews collection (Protected write/update/delete)',
    },
  ],
  securityDefinitions: {
    cookieAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Cookie',
      description: 'Connect.sid session cookie obtained by authenticating via /login or /auth/login',
    },
  },
  definitions: {
    RegisterUser: {
      username: 'moviebuff',
      email: 'moviebuff@example.com',
      password: 'securePassword123',
    },
    LoginUser: {
      email: 'moviebuff@example.com',
      password: 'securePassword123',
    },
    Movie: {
      title: 'Inception',
      director: 'Christopher Nolan',
      releaseYear: 2010,
      genre: 'Sci-Fi',
      rating: 8.8,
      runtime: 148,
      synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      language: 'English',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    },
    Review: {
      movieId: '651a2b3c4d5e6f7a8b9c0d1e',
      reviewerName: 'Alex Johnson',
      rating: 9,
      comment: 'Mind-bending visual masterpiece with a brilliant Hans Zimmer score!',
      reviewDate: '2024-03-15',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
