import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Portfolio Frontend' });
});

app.listen(PORT, () => {
  console.log(`Portfolio Frontend running on port ${PORT}`);
});
