const { Model, DataTypes } = require("sequelize");

class Profesion extends Model {
  static initModel(sequelize) {
    Profesion.init(
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
          field: "created_at", // Specify column name as "createdAt"
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: "updated_at", // Specify column name as "updatedAt"
        },
      },
      {
        sequelize,
        modelName: "Profesion", // Set the model name explicitly
        tableName: "profesiones", // Set the table name explicitly
        timestamps: true,
      }
    );

    return Profesion;
  }
}

module.exports = Profesion;
