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

      // Live/demo URL (required)
      liveUrl: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        validate: { isUrl: true },
      },

      // Code/repo URL (optional)
      codeUrl: {
        type: DataTypes.STRING(2048),
        allowNull: true,
        validate: { isUrl: true },
      },

      imagePath: { type: DataTypes.STRING(512), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      tags: {
        type: TagsType,
        allowNull: true,
        defaultValue: dialect === 'postgres' ? null : [],
      },

      // If you added these earlier:
      developedAt: { type: DataTypes.DATEONLY, allowNull: true },
      inProduction: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: 'projects',
      underscored: true,
      timestamps: true,
    }
  );

  return Project;
};
