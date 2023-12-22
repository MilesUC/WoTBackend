const { Model, DataTypes } = require("sequelize");

class DominioIdioma extends Model {
  static initModel(sequelize) {
    DominioIdioma.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        idioma: {
          type: DataTypes.STRING,
        },
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
      }
    );

    return DominioIdioma;
  }
}

module.exports = DominioIdioma;
