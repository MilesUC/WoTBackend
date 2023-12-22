const { Model, DataTypes } = require("sequelize");

class Region extends Model {
  static initModel(sequelize) {
    Region.init(
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
        numero: {
          type: DataTypes.INTEGER,
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
        modelName: "Region", // Set the model name explicitly
        tableName: "regiones", // Set the table name explicitly
        timestamps: true,
        underscored: true,
      }
    );

    return Region;
  }
}

module.exports = Region;
