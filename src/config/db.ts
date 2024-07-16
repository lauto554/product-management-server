import dotenv from 'dotenv';
import colors from 'colors';
import { Sequelize } from 'sequelize-typescript';

dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL, {
  models: [__dirname + '/../models/**/*'],
  logging: false,
});

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.magenta.bold('Conection successfull to DB'));
  } catch (error) {
    console.log(error);
    console.log(colors.red.bold('Have an error connecting to the DB'));
  }
}

export default db;
