const dotenv = require('dotenv');
const app = require('./app');
// const db = require('./models');

dotenv.config();

const PORT = process.env.PORT || 3000;  // En caso de no haber variable PORT en .env, se usa 3000


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
