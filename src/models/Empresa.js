const { Model, DataTypes } = require("sequelize");

class Empresa extends Model {
  static initModel(sequelize) {
    Empresa.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          field: "id",
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        rut: {
          type: DataTypes.STRING,
          unique: true,
        },
        nombre: {
          type: DataTypes.STRING,
        },

        activo: {
          type: DataTypes.BOOLEAN,
        },

        // TODO FK
        // FK
        id_industria: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "industrias",
            key: "id",
          },
        },
        // FK
        id_fundacion: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "fundaciones",
            key: "id",
          },
        },
        // FK
        id_ingreso_anual: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "ingresos_anuales",
            key: "id",
          },
        },
        // FK
        id_cantidad_empleado: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "cantidad_empleados",
            key: "id",
          },
        },
        valoresEmpresa: {
          type: DataTypes.STRING,
        },
        politicaESG: {
          type: DataTypes.BOOLEAN,
        },
        indicadoresImpacto: {
          type: DataTypes.BOOLEAN,
        },

        empresa_b: {
          type: DataTypes.BOOLEAN,
        },
        // FK
        id_region: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "regiones",
            key: "id",
          },
        },
        declaracion: {
          type: DataTypes.BOOLEAN,
        },
        // Estas columnas no estan en el csv agregar?
        // // FK
        // id_porcentaje_mujeres: {
        //   type: DataTypes.INTEGER.UNSIGNED,
        //   references: {
        //     model: "porcentaje_mujeres",
        //     key: "id",
        //   },
        // },
        // // FK
        // id_porcentaje_rotacion: {
        //   type: DataTypes.INTEGER.UNSIGNED,
        //   references: {
        //     model: "porcentaje_rotacion",
        //     key: "id",
        //   },
        // },
        // FK
        // contactos: {
        //   type: DataTypes.INTEGER,
        //   references: {
        //     model: "",
        //     key: "",
        //   },
        // },
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
        modelName: "Empresa",
        tableName: "empresas",
        timestamps: true,
      }
    );

    return Empresa;
  }
}

module.exports = Empresa;
