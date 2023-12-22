const { Model, DataTypes } = require("sequelize");

class Curriculum extends Model {
    static initModel(sequelize) {
      Curriculum.init(
        {
          link: DataTypes.STRING,
          usuariaId: DataTypes.STRING,
        },
        {
          sequelize,
          modelName: "Curriculum",
          tableName: "Curriculums",
        }
      );
      return Curriculum;
    }
  }
  
module.exports = Curriculum;