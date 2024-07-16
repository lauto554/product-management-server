import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.2',
    tags: [
      {
        name: 'Products',
        description: 'API operations related to products',
      },
    ],
    info: {
      title: 'REST API Node.js / Express / Typescript',
      version: '1.0.0',
      description: 'API Docs for Products',
    },
  },
  apis: ['./src/router.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions: SwaggerUiOptions = {
  customCss: `
    .topbar-wrapper .link {
        content: url('https://cdn.iconscout.com/icon/free/png-256/free-box-737-675643.png');
        height: 90px;
        width: auto;
        padding-left: 100px;
        padding-right: 100px; 
    }
    .swagger-ui .topbar {
    background-color: #780A7E;
    padding: 10px 0px;
}
  `,
  customSiteTitle: 'Documentación REST API Express / Typescript',
};

export default swaggerSpec;
export { swaggerUiOptions };
