import express, { type Express, type Request, type Response } from 'express';
import { db } from "./src/prisma/db";

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/products', (req: Request, res: Response) => {
  res.send(db.orm.public.Product.all());
});

app.get('/products/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(3000);
