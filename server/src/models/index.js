// server/src/models/project.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const dialect = sequelize.getDialect();
  const TagsType =
    dialect === 'postgres' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.JSON;

  const Project = sequelize.define(
    'Project',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      title: { type: DataTypes.STRING(200), allowNull: false },

      // Map to existing DB columns
      link:  { type: DataTypes.STRING(2048), allowNull: false, field: 'link'  }, // live url
      link2: { type: DataTypes.STRING(2048), allowNull: true,  field: 'link2' }, // code url (optional)

      imagePath: { type: DataTypes.STRING(512), allowNull: true, field: 'image_path' },

      description: { type: DataTypes.TEXT, allowNull: true },

      tags: {
        type: TagsType,
        allowNull: true,
        defaultValue: dialect === 'postgres' ? null : [],
      },

      // If you’re storing these too:
      developedAt:  { type: DataTypes.DATEONLY, allowNull: true,  field: 'developed_at' },
      inProduction: { type: DataTypes.BOOLEAN,  allowNull: false, defaultValue: false, field: 'in_production' },
    },
    {
      tableName: 'projects',
      underscored: true,
      timestamps: true,
    }
  );

  return Project;
};
