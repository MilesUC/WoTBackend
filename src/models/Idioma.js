const { Model, DataTypes, sequelize } = require("sequelize");

class Idioma extends Model {
  static initModel(sequelize) {
    Idioma.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        nombre: {
          type: DataTypes.STRING,
        },
        createdAt: {
          type: DataTypes.DATE,
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: "updated_at",
        },
      },
      {
        sequelize,
        modelName: "Idioma", // Set the model name explicitly
        tableName: "idiomas", // Set the table name explicitly
        timestamps: true,
      }
    );

    return Idioma;
  }
}

module.exports = Idioma;
