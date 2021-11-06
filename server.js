const dotenv = require('dotenv');

const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Banco ok');
  });

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server on ${port}`);
});
