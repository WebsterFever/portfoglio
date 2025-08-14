
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Project = sequelize.define('Project', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    link: { type: DataTypes.STRING(2048), allowNull: false },
    imagePath: { type: DataTypes.STRING(512), allowNull: true }, // e.g. '/uploads/filename.jpg'
    description: { type: DataTypes.TEXT, allowNull: true },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true }, // optional
  }, {
    tableName: 'projects',
    underscored: true,
  });

  return Project;
};
