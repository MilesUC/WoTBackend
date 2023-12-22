const { Model, DataTypes } = require("sequelize");

class BusquedaDominioIdioma extends Model {
  static initModel(sequelize) {
    BusquedaDominioIdioma.init(
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
        idDominio: {
          type: DataTypes.INTEGER.UNSIGNED,
          reference: {
            model: "",
            key: "",
          },
          field: "id_idioma",
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
        tableName: "busquedas_idiomas",
      }
    );

    return BusquedaDominioIdioma;
  }
}
module.exports = BusquedaDominioIdioma;
