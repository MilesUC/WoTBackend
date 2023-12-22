const { Model, DataTypes, sequelize } = require("sequelize");

class Industria extends Model {
  static initModel(sequelize) {
    Industria.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        nombre_industria: {
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
        modelName: "Industria", // Set the model name explicitly
        tableName: "industrias", // Set the table name explicitly
        timestamps: true,
        underscored: true,
      }
    );

    return Industria;
  }
}

module.exports = Industria;
