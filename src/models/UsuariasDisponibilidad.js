const { Model, DataTypes } = require("sequelize");

class UsuariasDisponibilidad extends Model {
  static initModel(sequelize) {
    UsuariasDisponibilidad.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // FK
        idUsuaria: {
          type: DataTypes.STRING,
          field: "id_usuaria",
          references: {
            model: "Usuaria",
            key: "id",
          },
        },
        // FK
        idDisponibilidad: {
          type: DataTypes.INTEGER,
          field: "id_disponibilidad",
          references: {
            model: "Disponibilidad",
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
        modelName: "UsuariasDisponibilidad",
        tableName: "disponibilidad_usuarias",
        timestamps: true,
      }
    );

    return UsuariasDisponibilidad;
  }
}

module.exports = UsuariasDisponibilidad;
