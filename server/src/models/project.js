// // server/src/models/project.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const dialect = sequelize.getDialect();

  // ARRAY on Postgres, JSON on SQLite (works on both)
  const TagsType =
    dialect === 'postgres' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.JSON;

  const Project = sequelize.define(
    'Project',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      title: { type: DataTypes.STRING(200), allowNull: false },

      link: { type: DataTypes.STRING(2048), allowNull: false },

      // e.g. '/uploads/filename.jpg'
      imagePath: { type: DataTypes.STRING(512), allowNull: true },

      description: { type: DataTypes.TEXT, allowNull: true },

      tags: {
        type: TagsType,
        allowNull: true,
        // default for SQLite/JSON, Postgres uses NULL by default
        defaultValue: dialect === 'postgres' ? null : [],
      },

      // NEW: when it was developed/launched (YYYY-MM-DD)
      developedAt: { type: DataTypes.DATEONLY, allowNull: true },

      // NEW: whether the project is still in production
      inProduction: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: 'projects',
      underscored: true, // DB columns will be snake_case (e.g., developed_at)
      timestamps: true,  // created_at, updated_at
    }
  );

  return Project;
};
