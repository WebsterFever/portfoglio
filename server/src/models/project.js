import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const dialect = sequelize.getDialect();
  // ARRAY no Postgres, JSON no SQLite (compatível nos dois)
  const TagsType =
    dialect === 'postgres' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.JSON;

  const Project = sequelize.define(
    'Project',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(200), allowNull: false },
      link: { type: DataTypes.STRING(2048), allowNull: false },
      link2: { type: DataTypes.STRING(2048), allowNull: false },
      imagePath: { type: DataTypes.STRING(512), allowNull: true }, // ex.: '/uploads/filename.jpg'
      description: { type: DataTypes.TEXT, allowNull: true },
      tags: {
        type: TagsType,
        allowNull: true,
        // default para SQLite/JSON
        defaultValue: dialect === 'postgres' ? null : [],
      },
    },
    {
      tableName: 'projects',
      underscored: true,
      timestamps: true,
    }
  );

  return Project;
};
