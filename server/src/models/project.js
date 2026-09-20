import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const dialect = sequelize.getDialect();
  const TagsType = dialect === 'postgres'
    ? DataTypes.ARRAY(DataTypes.STRING)
    : DataTypes.JSON;

  const Project = sequelize.define(
    'Project',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(200), allowNull: false },

      // main project URL (required)
      link: { type: DataTypes.STRING(2048), allowNull: false },

      // SECOND URL (optional) — this is your "link2"
      link2: { type: DataTypes.STRING(2048), allowNull: true },

      imagePath: { type: DataTypes.STRING(512), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      buildPrompt: { type: DataTypes.TEXT, allowNull: true },
      category: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'production',
      },
      tags: {
        type: TagsType,
        allowNull: true,
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
