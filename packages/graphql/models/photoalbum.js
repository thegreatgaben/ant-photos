'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhotoAlbum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        PhotoAlbum.hasMany(models.Photo, {
            foreignKey: {
                name: 'albumId',
                allowNull: true,
            }
        });
    }
  };
  PhotoAlbum.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    coverPhotoUrl: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PhotoAlbum',
  });
  return PhotoAlbum;
};
