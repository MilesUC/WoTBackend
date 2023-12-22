const { Model, DataTypes } = require("sequelize");

class Rol extends Model {
  static initModel(sequelize) {
    Rol.init(
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
        descripcion: {
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
        modelName: "Rol", // Set the model name explicitly
        tableName: "roles", // Set the table name explicitly
        timestamps: true,
        underscored: true,
      }
    );

    return Rol;
  }
}

module.exports = Rol;
