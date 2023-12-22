const { Model, DataTypes } = require('sequelize');

class Busqueda extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelize
   */
  static initModel(sequelize) {
    Busqueda.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        nombre: {
          type: DataTypes.STRING,
          field: 'nombre',
        },
        fecha: {
          type: DataTypes.DATE,
        },
        id_empresa: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        id_cargo: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        id_jornada: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        horas_requetidas: {
          type: DataTypes.INTEGER,
        },
        id_modalidad: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        area_especifica: {
          type: DataTypes.BOOLEAN,
        },
        area: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        regionEspecifica: {
          type: DataTypes.BOOLEAN,
        },
        id_region: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        cargo_flexible: {
          type: DataTypes.BOOLEAN,
        },
        necesidad_viaje: {
          type: DataTypes.BOOLEAN,
        },
        profesionEspecifica: {
          type: DataTypes.BOOLEAN,
        },
        postgrado: {
          type: DataTypes.BOOLEAN,
        },
        id_anios_experiencia: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        sectorIndustriaEspecifica: {
          type: DataTypes.STRING,
        },
        id_industria: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        experiencia_directorios: {
          type: DataTypes.BOOLEAN,
        },
        alta_direccion: {
          type: DataTypes.BOOLEAN,
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        modelName: 'Busqueda',
        tableName: 'busquedas',
        timestamps: true,
      },
    );

    return Busqueda;
  }
}

module.exports = Busqueda;
