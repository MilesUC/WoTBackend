const { Model, DataTypes } = require("sequelize");

class Competencia extends Model {
  static initModel(sequelize) {
    Competencia.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        competencia: {
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
        modelName: "Competencia",
        tableName: "competencias",
        timestamps: true,
      }
    );

    return Competencia;
  }
}

module.exports = Competencia;
