
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import ProjectModel from './project.js';

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS,
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
});

export const Project = ProjectModel(sequelize);
