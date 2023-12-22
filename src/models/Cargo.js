const { Model, DataTypes } = require("sequelize");


class Cargo extends Model{
 
  static initModel(sequelize) {
    Cargo.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      cargo: {
        type: DataTypes.STRING
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'

      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    }, {
      sequelize,
      modelName: 'Cargo',
      tableName: 'cargos',
      timestamps: true
    })
    
    return Cargo
  }
}

module.exports = Cargo;