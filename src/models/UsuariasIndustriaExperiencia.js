const { Model, DataTypes } = require("sequelize");

class UsuariasIndustriaExperiencia extends Model {
  static initModel(sequelize) {
    UsuariasIndustriaExperiencia.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // FK
        idUsuaria: {
          type: DataTypes.INTEGER,
          references: {
            model: "",
            key: "",
          },
        },
        // FK
        idIndustria: {
          type: DataTypes.INTEGER,
          references: {
            model: "",
            key: "",
          },
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

    return UsuariasIndustriaExperiencia;
  }
}

module.exports = UsuariasIndustriaExperiencia;
