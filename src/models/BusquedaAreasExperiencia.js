const { Model, DataTypes } = require("sequelize");

class BusquedaAreasExperiencia extends Model {
  static initModel(sequelize) {
    BusquedaAreasExperiencia.init(
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
        idAreas: {
          type: DataTypes.INTEGER.UNSIGNED,
          reference: {
            model: "",
            key: "",
          },
          field: "id_areas",
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
        tableName: "areas_busquedas",
      }
    );

    return BusquedaAreasExperiencia;
  }
}

module.exports = BusquedaAreasExperiencia;
