const { Model, DataTypes } = require("sequelize");

class NotificationPreference extends Model {
  static initModel(sequelize) {
    NotificationPreference.init(
      {
        userId: DataTypes.STRING,
        busquedaEmpresas: DataTypes.BOOLEAN,
        conectarComunidades: DataTypes.BOOLEAN,
        publicaciones: DataTypes.BOOLEAN,
        actividadComunidades: DataTypes.BOOLEAN,
        actualizacionesPerfil: DataTypes.BOOLEAN
      },
      {
        sequelize,
        modelName: "NotificationPreference",
        tableName: "NotificationPreferences",
      }
    );
    return NotificationPreference;
  }
}

module.exports = NotificationPreference;