import express, { type Express, type Request, type Response } from 'express';
import { db } from "./src/prisma/db.ts";
import { and, or } from '@prisma/orm-postgres/orm-client';

const app: Express = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/products', async (req: Request, res: Response) => {
  const products = [];
  for await (const product of db.orm.public.Product.all()) {
    products.push(product);
  }
  res.json(products);
});

app.post('/products', async (req: Request, res: Response) => {
  if (typeof req.body.name !== 'string' || req.body.name.trim() === '') {
    res.status(400).json({ error: 'You need to choose a name.' });
    return;
  }

  const product = await db.orm.public.Product.where({ name : req.body.name }).first();
  if (product !== null) {
    res.status(409).json({  error: 'Name ' + req.body.name +' already taken' });
    return;
  }

  const created = await db.orm.public.Product.create({
    name: req.body.name,
    description: req.body.description || null,
    price: req.body.price || 0,
    category: req.body.category || null,
  });
  res.status(200).json(created);
});

app.patch('/products/', async (req: Request, res: Response) => {
  const id = Number(req.body.id);
  if (!Number.isInteger(id) || id <= 0) {
    console.log(id);
    res.status(400).json({ error: 'Product id must be a positive integer' });
    return;
  }

  const product = await db.orm.public.Product.where({ id }).first();
  if (product === null){
    res.status(404).json({ error: 'Item not found' });
    return; 
  }
  
  const updates: {
    name?: string;
    description?: string | null;
    price?: number | null;
    category?: string | null;
  } = {};
  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.price !== undefined) updates.price = req.body.price;
  if (req.body.category !== undefined) updates.category = req.body.category;
  
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: 'Provide at least one product field to update' });
    return;
  }
  
  if (updates.name != undefined){
    const name_check = await db.orm.public.Product.where({ name : updates.name }).first();
    if (name_check !== null){
      res.status(409).json({ error: 'Name ' + updates.name +' already taken.' });
      return;
    } 
  }

  res.status(200).json(db.orm.public.Product.where({ id }).update(updates));
});

app.delete('/products/', async (req: Request, res: Response) => {
  const id = Number(req.body.id);
  if (!Number.isInteger(id) || id <= 0) {
    console.log(id);
    res.status(400).json({ error: 'Product id must be a positive integer' });
    return;
  }

  const product = await db.orm.public.Product.where({ id }).first();
  if (product === null){
    res.status(404).json({ error: 'Item not found' });
    return; 
  }

  res.status(200).json(db.orm.public.Product.where({ id }).delete());
});

app.listen(3000);
