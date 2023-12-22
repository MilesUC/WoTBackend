const { Model, DataTypes } = require("sequelize");

class BusquedaCompetencia extends Model {
  static initModel(sequelize) {
    BusquedaCompetencia.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // FK
        idBusqueda: {
          type: DataTypes.INTEGER.UNSIGNED,
          reference: {
            model: "",
            key: "",
          },
          field: "id_busqueda",
        },
        // FK
        idCompetencias: {
          type: DataTypes.INTEGER.UNSIGNED,
          reference: {
            model: "",
            key: "",
          },
          field: "id_competencias",
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
        tableName: "busquedas_competencias",
      }
    );

    return BusquedaCompetencia;
  }
}

module.exports = BusquedaCompetencia;
