import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import ProjectFactory from './project.js';

const isProd = !!process.env.DATABASE_URL;

export const sequelize = isProd
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      dialectOptions: {
        // Neon exige TLS
        ssl: { require: true, rejectUnauthorized: false },
      },
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './dev.sqlite', // arquivo local para desenvolvimento
      logging: false,
    });

// init models
export const Project = ProjectFactory(sequelize);

export default { sequelize, Project };
