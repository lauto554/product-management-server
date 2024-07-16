import request from 'supertest';
import server from '../../server';

describe('POST /api/products', () => {
  test('should display validation errors', async () => {
    const res = await request(server).post('/api/products').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(5);

    expect(res.status).not.toBe(200);
    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should validate price greater than 0', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'Monitor',
      price: 0,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);

    expect(res.status).not.toBe(200);
    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should validate price is number and greater than 0', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'Monitor',
      price: 'hola',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(2);

    expect(res.status).not.toBe(200);
    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should create a new product', async () => {
    const res = await request(server).post('/api/products').send({
      name: 'Mouse - testing',
      price: 50,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');

    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('error');
  });
});
describe('GET /api/products', () => {
  test('should check if URL exists', async () => {
    const res = await request(server).get('/api/products');

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
  });
  test('should get a JSON response with products', async () => {
    const res = await request(server).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.headers['content-type']).toMatch(/json/);

    expect(res.body).not.toHaveProperty('errors');
  });
});
describe('GET /api/products/:id', () => {
  test('should check if product exists', async () => {
    const productId = 3000;
    const res = await request(server).get(`/api/products/${productId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Producto no encontrado');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should check that it is a valid ID', async () => {
    const res = await request(server).get('/api/products/not-valid-url');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe('ID no válido');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should get the product by ID', async () => {
    const res = await request(server).get('/api/products/1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});
describe('PUT /api/products/:id', () => {
  test('should check if product exists', async () => {
    const productId = 3000;
    const res = await request(server).put(`/api/products/${productId}`).send({
      name: 'Notebook(UPDATE) - testing',
      price: 2500,
      availability: true,
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Producto no encontrado');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should check that it is a valid ID', async () => {
    const res = await request(server).put('/api/products/not-valid-url').send({
      name: 'Notebook(UPDATE) - testing',
      price: 2500,
      availability: true,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe('ID no válido');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should display errors messages when have an empty request', async () => {
    const res = await request(server).put('/api/products/1').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(6);
  });
  test('should check name is string', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: 300,
      price: 2500,
      availability: true,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe('El nombre debe ser una cadena de texto');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should check name is not empty', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: '',
      price: 2500,
      availability: true,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe('El nombre del Producto es obligatorio');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should check price is type number', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: 'Notebook - ACTUALIZADO',
      price: 'not a type number',
      availability: true,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(2);
    expect(res.body.errors[0].msg).toBe('Valor no válido');
    expect(res.body.errors[1].msg).toBe('Precio inválido');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should check price is greater than 0', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: 'Notebook - ACTUALIZADO',
      price: -2500,
      availability: true,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe('Precio inválido');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should check price is not empty', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: 'Notebook - ACTUALIZADO',
      price: '',
      availability: true,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(3);
    expect(res.body.errors[0].msg).toBe('Valor no válido');
    expect(res.body.errors[1].msg).toBe('El precio del Producto es obligatorio');
    expect(res.body.errors[2].msg).toBe('Precio inválido');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should check availability is boolean', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: 'Notebook - ACTUALIZADO',
      price: 2500,
      availability: 300,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe('Valor no válido');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should update the product', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: 'Notebook(UPDATE) - testing',
      price: 2500,
      availability: true,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');

    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty('errors');
  });
});
describe('PATCH /api/products/:id', () => {
  test('should check if product exists', async () => {
    const productId = 3000;
    const res = await request(server).patch(`/api/products/${productId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Producto no encontrado');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should check that it is a valid ID', async () => {
    const res = await request(server).patch('/api/products/not-valid-url');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].msg).toBe('ID no válido');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should update the availability', async () => {
    const res = await request(server).patch('/api/products/1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.availability).toBe(false);

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty('errors');
  });
});
describe('DELETE /api/products/:id', () => {
  test('should check if product exists', async () => {
    const productId = 3000;
    const res = await request(server).delete(`/api/products/${productId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Producto no encontrado');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should check that it is a valid ID', async () => {
    const res = await request(server).delete('/api/products/not-valid-url');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].msg).toBe('ID no válido');

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty('data');
  });
  test('should delete product', async () => {
    const res = await request(server).delete('/api/products/1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBe('Producto eliminado');

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty('error');
  });
});
