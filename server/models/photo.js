'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        Photo.belongsTo(models.PhotoAlbum, {
            foreignKey: {
                name: 'albumId',
                allowNull: true,
            }
        });
    }
  };
  Photo.init({
    filename: DataTypes.STRING,
    filepath: DataTypes.STRING,
    filesize: DataTypes.BIGINT,
    disk: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    url: DataTypes.STRING,
    caption: DataTypes.STRING,
    albumId: DataTypes.INTEGER,
    isCoverPhoto: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};
