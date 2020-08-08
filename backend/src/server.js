const express = require('express');
const path = require('path');
const cors = require('cors');
const { PORT } = require('./config');
const { errorHandler } = require('./middleware');
const { routes } = require('./api');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
routes(app);
app.use(errorHandler);

app.listen(PORT, () => {

  console.log(`Server is listening on port ${PORT}`);

});
