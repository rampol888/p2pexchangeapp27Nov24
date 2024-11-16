import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello p2p exchange');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
