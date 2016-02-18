import express from 'express';
import bodyParser from 'body-parser';
import ApiRoutes from './server/api/routes';

const router = express.Router().use('/api', ApiRoutes);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './public');
app.set('view engine', 'jade');

app.get('/', (req, res) => {
  res.render('index', {
    routes: [1, 2, 3, 4, 5]
  });
});

app.use(router);

app.listen(3000, () => {
  console.log('App is running at port:3000');
});
