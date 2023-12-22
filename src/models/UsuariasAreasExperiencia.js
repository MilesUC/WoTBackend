const { Model, DataTypes } = require("sequelize");

class UsuariasAreasExperiencia extends Model {
  static initModel(sequelize) {
    UsuariasAreasExperiencia.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // TODO FK
        // idBusqueda: {
        //   type: DataTypes.INTEGER.UNSIGNED,
        //   references: {
        //     model: '',
        //     key: ''
        //   },
        // },
        // FK
        idUsuaria: {
          type: DataTypes.STRING,
          field: "id_usuaria",
          references: {
            model: "usuarias",
            key: "id",
          },
        },
        // TODO FK
        idAreas: {
          field: "id_area",
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "areas",
            key: "id",
          },
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
        modelName: "UsuariasAreasExperiencia",
        tableName: "areas_usuarias",
        timestamps: true,
      }
    );

    return UsuariasAreasExperiencia;
  }
}

module.exports = UsuariasAreasExperiencia;
