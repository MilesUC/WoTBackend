const { DataTypes, Model, UUIDV4 } = require("sequelize");

class Usuaria extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelize
   */
  static initModel(sequelize) {
    Usuaria.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        // TODO: tabla tiene doble primary key FK ?
        rut: {
          type: DataTypes.STRING,
          unique: true,
        },
        nombre: {
          type: DataTypes.STRING,
        },
        apellido: {
          type: DataTypes.STRING,
        },
        celular: {
          type: DataTypes.STRING,
        },
        mail: {
          type: DataTypes.STRING,
        },
        universidad: {
          type: DataTypes.STRING,
        },
        postgrado: {
          type: DataTypes.STRING,
        },
        // FK
        id_cargo: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "cargos",
            key: "id",
            // ondDelete: "cascade",
          },
        },
        empresa_actual : {
          type: DataTypes.STRING,
        },
        // FK
        // but empresas already have a relationship one to one relationship with industrias
        id_industria_actual: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "industrias",
            key: "id",
            // ondDelete: "cascade",
          },
        },
        // FK
        id_cargo_adicional: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "cargos",
            key: "id",
            // ondDelete: "cascade",
          },
        },
        empresa_adicional: {
          type: DataTypes.STRING,
        },
        // FK
        id_industria_adicional: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "industrias",
            key: "id",
            // ondDelete: "cascade",
          },
        },
        // FK
        id_anios_experiencia: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "anios_experiencias",
            key: "id",
            // ondDelete: "cascade",
          },
        },
        experienciaDirectorios: {
          type: DataTypes.BOOLEAN,
        },
        altaDireccion: {
          type: DataTypes.BOOLEAN,
        },
        intereses: {
          type: DataTypes.STRING,
        },
        brief: {
          type: DataTypes.STRING(500),
        },
        redesSociales: {
          type: DataTypes.STRING,
        },
        // TODO FK
        // todo CHECK IF PERSONALIDAD IS REALLY A FK
        id_personalidad: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "formulario_personalidades",
            key: "id",
          },
          // ondDelete: "cascade",
        },

        factor: {
          type: DataTypes.STRING,
        },

        // this maybe needs to be a fk to a pueblos tables
        nombrePuebloOriginario: {
          type: DataTypes.STRING,
        },
        //  FK
        id_region_con_compromiso: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "regiones",
            key: "id",
            // ondDelete: "cascade",
          },
        },
        // 25. País de domicilio
        id_pais_domicilio: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "pais_domicilios",
            key: "id",
          },
        },
        // ciudad_domicilio: {
        //   type: DataTypes.STRING,
        // },  //ciudad no se necesita 
        // //  at this point, maybe we need a domicilio table
        region_domicilio: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "regiones",
            key: "id",
            onDelete: "cascade",
          },
        },
        //  FK
        // why this is a fk and not a boolean?
        id_posibilidad_cambiarse_region: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "posibilidad_cambiarse_region",
            key: "id",
            onDelete: "cascade",
          },
        },
        disposicion_viajar: {
          type: DataTypes.BOOLEAN,
        },

        //  FK
        id_modalidad: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "modalidades",
            key: "id",
          },
          onDelete: "cascade",
        },
        //  FK
        id_jornada: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "jornadas",
            key: "id",
            onDelete: "cascade",
          },
        },
        //  FK
        // maybe this a boolean too
        id_conocio_wot: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "conocio_wot",
            key: "id",
            onDelete: "cascade",
          },
        },
        declaracion: {
          type: DataTypes.BOOLEAN,
        },
        //  FK
        id_rol: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: "roles",
            key: "id",
          },
        },

        // columnas que no estan en el csv
        // FK
        // TODO: Can a user actually have more than one profession?
        // id_profesion: {
        //   type: DataTypes.INTEGER.UNSIGNED,
        //   references: {
        //     model: "profesiones",
        //     key: "id",
        //     // ondDelete: "cascade",
        //   },
        // },

        // // FK
        // id_competencia: {
        //   type: DataTypes.INTEGER,
        //   references: {
        //     model: "",
        //     key: "",
        //   },
        // },

        // // FK
        // id_disponibilidad: {
        //   type: DataTypes.INTEGER.UNSIGNED,
        //   references: {
        //     model: "disponibilidades",
        //     key: "id",
        //     // ondDelete: "cascade",
        //   },
        // },

        // //  FK
        // ADDED AS MANY TO MANY RELATIONSHIP
        // id_idioma: {
        //   type: DataTypes.INTEGER,
        //   references: {
        //     model: "idiomas",
        //     key: "id",
        //   },
        // },

        // TODO FK
        // contactosReferencia: {
        //   type: DataTypes.INTEGER,
        //   references: {
        //     model: "contactos_verificacion",
        //     key: "id",
        //   },
        // },

        createdAt: {
          type: DataTypes.DATE,
          field: "created_at", // Specify column name as "createdAt"
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: "updated_at", // Specify column name as "updatedAt"
        },
        // deletedAt: {
        //   type: DataTypes.DATE,
        //   field: "deleted_at",
        // },
      },
      {
        sequelize,
        modelName: "Usuaria", // Set the model name explicitly
        tableName: "usuarias", // Set the table name explicitly
        timestamps: true,
      }
    );
  }

  // Define custom setter method for role association
}

module.exports = Usuaria;
