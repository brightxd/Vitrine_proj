import express from 'express';
import router from '../routes/index.ts';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3335;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`Vitrine backend rodando em http://localhost:${PORT}`));
