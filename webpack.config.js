module.exports = {
  // This is the entry point or start of our react applicaton
  entry: './app/main.js',

  // The plain compiled JavaScript will be output into this file
  output: {
    filename: 'public/assets/js/bundle.js'
  },

  // This section desribes the transformations we will perform
  module: {
    loaders: [
      {
        // Only working with files that in in a .js or .jsx extension
        test: /\.jsx?$/,
        // Webpack will only process files in our app folder. This avoids processing
        // node modules and server files unnecessarily
        include: /app/,
        loader: 'babel',
        query: {
          // These are the specific transformations we'll be using.
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};
