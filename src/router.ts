import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from './handlers/product';
import { handleInputErrors } from './middleware';

const router = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: The Product ID
 *          example: 1
 *        name:
 *          type: string
 *          description: The Product name
 *          example: Laptop
 *        price:
 *          type: number
 *          decription: The Product price
 *          example: 3000
 *        availability:
 *          type: boolean
 *          decription: The Product availability
 *          example: true
 */

/**
 * @swagger
 * /api/products:
 *    post:
 *        summary: Create Product
 *        tags:
 *          - Products
 *        description: Returns a new record in database
 *        requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            name:
 *                                type: string
 *                                example: "Notebook"
 *                            price:
 *                                type: number
 *                                example: 3000
 *        responses:
 *            201:
 *                description: Product created succesfully
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad Request - invalid input data
 */
router.post(
  '/products',
  body('name')
    .isString()
    .withMessage('El nombre debe ser una cadena de texto')
    .notEmpty()
    .withMessage('El nombre del Producto es obligatorio'),
  body('price')
    .isNumeric()
    .withMessage('Valor no válido')
    .notEmpty()
    .withMessage('El precio del Producto es obligatorio')
    .custom((value) => value > 0)
    .withMessage('Precio inválido'),
  handleInputErrors,
  createProduct
);

/**
 * @swagger
 * /api/products:
 *    get:
 *        summary: Get all the Products
 *        tags:
 *            - Products
 *        description: Return a list of products
 *        responses:
 *            200:
 *                description: Successfull response
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: '#/components/schemas/Product'
 */
router.get('/products', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *    get:
 *        summary: Get Product by ID
 *        tags:
 *          - Products
 *        description: Return the selected product
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Successfull response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad Request
 *
 *            404:
 *                description: Not Found
 */
router.get(
  '/products/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  getProductById
);

/**
 * @swagger
 * /api/products/{id}:
 *    put:
 *        summary: Update Product with user info
 *        tags:
 *          - Products
 *        description: returns the updated product
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            name:
 *                                type: string
 *                                example: "Notebook"
 *                            price:
 *                                type: number
 *                                example: 3000
 *                            availability:
 *                                type: boolean
 *                                example: true
 *        responses:
 *            200:
 *                description: Successfull response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad Request - invalid id or invalid input data
 *
 *            404:
 *                description: Product Not Found
 */
router.put(
  '/products/:id',
  param('id').isInt().withMessage('ID no válido'),
  body('name')
    .isString()
    .withMessage('El nombre debe ser una cadena de texto')
    .notEmpty()
    .withMessage('El nombre del Producto es obligatorio'),
  body('price')
    .isNumeric()
    .withMessage('Valor no válido')
    .notEmpty()
    .withMessage('El precio del Producto es obligatorio')
    .custom((value) => value > 0)
    .withMessage('Precio inválido'),
  body('availability').isBoolean().withMessage('Valor no válido'),
  handleInputErrors,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *    patch:
 *        summary: Modificate availability of the Product
 *        tags:
 *          - Products
 *        description: change availability of the product
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Successfull response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad Request - invalid id
 *
 *            404:
 *                description: Product Not Found
 */
router.patch(
  '/products/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *    delete:
 *        summary: Delete Product
 *        tags:
 *          - Products
 *        description: delete the selected product
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Product successfully deleted
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: string
 *                            value: 'Producto eliminado'
 *            400:
 *                description: Bad Request - invalid id
 *
 *            404:
 *                description: Product Not Found
 */
router.delete(
  '/products/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  deleteProduct
);

export default router;
