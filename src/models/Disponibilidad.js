const { Model, DataTypes } = require("sequelize");

class Disponibilidad extends Model {
  static initModel(sequelize) {
    Disponibilidad.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        disponibilidad: {
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
        modelName: "Disponibilidad",
        tableName: "disponibilidades",
        timestamps: true,
      }
    );

    return Disponibilidad;
  }
}

module.exports = Disponibilidad;
