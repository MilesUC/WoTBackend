const { Model, DataTypes } = require("sequelize");

class ContactosVerificacion extends Model {
  static initModel(sequelize) {
    ContactosVerificacion.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        id_usuaria: {
          type: DataTypes.STRING,
          references: {
            model: "usuarias",
            key: "id",
          },
        },
        nombre: {
          type: DataTypes.STRING(50),
        },
        email: {
          type: DataTypes.STRING(50),
        },
        telefono: {
          type: DataTypes.STRING(50),
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
        modelName: "ContactosVerificacion", // Set the model name explicitly
        tableName: "contactos_verificacion", // Set the table name explicitly
        timestamps: true,
      }
    );

    return ContactosVerificacion;
  }
}

module.exports = ContactosVerificacion;
