const { Model, DataTypes } = require("sequelize");

class Area extends Model {
  static initModel(sequelize) {
    Area.init(
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
        modelName: "Area", // Set the model name explicitly
        tableName: "areas", // Set the table name explicitly
        timestamps: true,
      }
    );

    return Area;
  }
}

module.exports = Area;
