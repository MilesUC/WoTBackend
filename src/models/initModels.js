const Usuaria = require('./Usuaria');
const Busqueda = require('./Busqueda');
const Rol = require('./Rol');
const Profesion = require('./Profesion');
const Universidad = require('./Universidad');
const Cargo = require('./Cargo');
const Empresa = require('./Empresa');
const Industria = require('./Industria');
const AniosExperiencia = require('./AniosExperiencia');
const FormularioPersonalidad = require('./FormularioPersonalidad');
const Region = require('./Region');
const PaisDomicilio = require('./PaisDomicilio');
const PosibilidadCambiarseRegion = require('./PosibilidadCambiarseRegion');
const Modalidad = require('./Modalidad');
const Jornada = require('./Jornada');
const ConocioWot = require('./ConocioWot');
const Idioma = require('./Idioma');
const Disponibilidad = require('./Disponibilidad');
const UsuariasIdioma = require('./UsuariasIdioma');
const UsuariasDisponibilidad = require('./UsuariasDisponibilidad');
const IngresoAnual = require('./IngresoAnual');
const Fundacion = require('./Fundacion');
const Competencia = require('./Competencia');
const UsuariasCompetencia = require('./UsuariasCompetencia');
const UsuariasIndustria = require('./UsuariasIndustria');
const Area = require('./Area');
const UsuariasAreasExperiencia = require('./UsuariasAreasExperiencia');
const UsuariasProfesion = require('./UsuariasProfesion');
const RelacionProfesion = require('./RelacionProfesion');
const UsuariaAdmin = require('./usuariaadmin');
const UsuariosEmpresa = require('./UsuariosEmpresa');
const BusquedaProfesion = require('./BusquedaProfesion');
const BusquedaIndustria = require('./BusquedaIndustria');
const BusquedaAreasExperiencia = require('./BusquedaAreasExperiencia');
const BusquedaCompetencia = require('./BusquedaCompetencia');
const BusquedaDominioIdioma = require('./BusquedaDominioIdioma');
const Match = require('./Match');
const RangoAnosBusqueda  = require("../models/rangoanosbusqueda");
const ContactosVerificacion = require('./ContactosVerificacion');
const Community = require('./community');
const UsuariaCommunity = require('./usuariacommunity');
const Curriculum = require('./curriculum');
const Post = require('./post');
const PostMultimedia = require('./postmultimedia');
const PostLike = require('./postlike');
const Comment = require('./comment');
const PostRepost = require('./postrepost');
const Notification = require('./notification');
const NotificationPreference = require('./notificationpreference');


function initModels(sequelize) {
  Busqueda.initModel(sequelize);
  Usuaria.initModel(sequelize);
  Rol.initModel(sequelize);
  Profesion.initModel(sequelize);
  Universidad.initModel(sequelize);
  Cargo.initModel(sequelize);
  Empresa.initModel(sequelize);
  Industria.initModel(sequelize);
  AniosExperiencia.initModel(sequelize);
  FormularioPersonalidad.initModel(sequelize);
  Region.initModel(sequelize);
  PaisDomicilio.initModel(sequelize);
  PosibilidadCambiarseRegion.initModel(sequelize);
  Modalidad.initModel(sequelize);
  Jornada.initModel(sequelize);
  ConocioWot.initModel(sequelize);
  Idioma.initModel(sequelize);
  Disponibilidad.initModel(sequelize);
  UsuariasIdioma.initModel(sequelize);
  UsuariasDisponibilidad.initModel(sequelize);
  Competencia.initModel(sequelize);
  UsuariasCompetencia.initModel(sequelize);
  UsuariasIndustria.initModel(sequelize);
  Area.initModel(sequelize);
  UsuariasAreasExperiencia.initModel(sequelize);
  UsuariasProfesion.initModel(sequelize);
  RelacionProfesion.initModel(sequelize);
  Fundacion.initModel(sequelize);
  IngresoAnual.initModel(sequelize);
  UsuariaAdmin.initModel(sequelize);
  UsuariosEmpresa.initModel(sequelize);
  BusquedaProfesion.initModel(sequelize);
  BusquedaIndustria.initModel(sequelize);
  BusquedaAreasExperiencia.initModel(sequelize);
  BusquedaCompetencia.initModel(sequelize);
  BusquedaDominioIdioma.initModel(sequelize);
  Match.initModel(sequelize);
  RangoAnosBusqueda.initModel(sequelize);
  ContactosVerificacion.initModel(sequelize);
  Community.initModel(sequelize);
  UsuariaCommunity.initModel(sequelize);
  Curriculum.initModel(sequelize);
  Post.initModel(sequelize);
  PostMultimedia.initModel(sequelize);
  PostLike.initModel(sequelize);
  Comment.initModel(sequelize);
  PostRepost.initModel(sequelize);
  Notification.initModel(sequelize);
  NotificationPreference.initModel(sequelize);

  Empresa.hasMany(UsuariosEmpresa, { foreignKey: 'id' });

  Empresa.belongsTo(Industria, {
    foreignKey: 'id_industria',
    as: 'industria',
  });

  Empresa.belongsTo(Fundacion, {
    foreignKey: 'id_fundacion',
    as: 'fundacion',
  });

  Empresa.belongsTo(IngresoAnual, {
    foreignKey: 'id_ingreso_anual',
    as: 'ingresoAnual',
  });

  Empresa.belongsTo(Region, {
    foreignKey: 'id_region',
    as: 'region',
  });

  Usuaria.belongsTo(Rol, {
    foreignKey: 'id_rol',
    as: 'rol',
  });
  Usuaria.belongsTo(Cargo, {
    foreignKey: 'id_cargo',
    as: 'cargo',
  });
  Usuaria.belongsTo(Cargo, {
    foreignKey: 'id_cargo_adicional',
    as: 'aditionalCargo',
  });
  Usuaria.belongsTo(Industria, {
    foreignKey: 'id_industria_actual',
    as: 'industria',
  });
  Usuaria.belongsTo(Industria, {
    foreignKey: 'id_industria_adicional',
    as: 'aditionalIndustria',
  });
  Usuaria.belongsTo(AniosExperiencia, {
    foreignKey: 'id_anios_experiencia',
    as: 'aniosExperiencia',
  });
  Usuaria.belongsTo(FormularioPersonalidad, {
    foreignKey: 'id_personalidad',
    as: 'personalidad',
  });
  Usuaria.belongsTo(Region, {
    foreignKey: 'id_region_con_compromiso',
    as: 'regionCompromiso',
  });

  Usuaria.belongsTo(PaisDomicilio, {
    foreignKey: 'id_pais_domicilio',
    as: 'paisDomicilio',
  });

  Usuaria.belongsTo(Region, {
    foreignKey: 'region_domicilio',
    as: 'regionActualDomicilio',
  });

  Usuaria.belongsTo(PosibilidadCambiarseRegion, {
    foreignKey: 'id_posibilidad_cambiarse_region',
    as: 'posibilidadCambiarseRegion',
  });

  Usuaria.belongsTo(Modalidad, {
    foreignKey: 'id_modalidad',
    as: 'tipoModalidad',
  });

  Usuaria.belongsTo(Jornada, {
    foreignKey: 'id_jornada',
    as: 'tipoJornada',
  });

  Usuaria.belongsTo(ConocioWot, {
    foreignKey: 'id_conocio_wot',
    as: 'conocioWOT',
  });

  // pivote idioma
  Usuaria.belongsToMany(Idioma, {
    through: UsuariasIdioma,
    foreignKey: 'id_usuaria',
    otherKey: 'id_idioma',
    as: 'idiomas',
  });

  Idioma.belongsToMany(Usuaria, {
    through: UsuariasIdioma,
    foreignKey: 'id_idioma',
    otherKey: 'id_usuaria',
    as: 'usuarias',
  });

  // pivote disponibilidad
  Usuaria.belongsToMany(Disponibilidad, {
    through: UsuariasDisponibilidad,
    foreignKey: 'id_usuaria',
    otherKey: 'id_disponibilidad',
    as: 'disponibilidad',
  });

  Disponibilidad.belongsToMany(Usuaria, {
    through: UsuariasDisponibilidad,
    foreignKey: 'id_disponibilidad',
    otherKey: 'id_usuaria',
    as: 'usuarias',
  });

  // pivote competencias
  Usuaria.belongsToMany(Competencia, {
    through: UsuariasCompetencia,
    foreignKey: 'id_usuaria',
    otherKey: 'id_competencia',
    as: 'competencia',
  });

  // Competencia.belongsToMany(Usuaria, {
  //   through: UsuariasDisponibilidad,
  //   foreignKey: 'id_competencia',
  //   otherKey: 'id_usuaria',
  //   as: 'usuarias',
  // });

  // pivote Industrias
  Usuaria.belongsToMany(Industria, {
    through: UsuariasIndustria,
    foreignKey: 'id_usuaria',
    otherKey: 'id_industria',
    as: 'industrias',
  });

  Industria.belongsToMany(Usuaria, {
    through: UsuariasIndustria,
    foreignKey: 'id_industria',
    otherKey: 'id_usuaria',
    as: 'usuarias',
  });

  // pivote Area
  Usuaria.belongsToMany(Area, {
    through: UsuariasAreasExperiencia,
    foreignKey: 'id_usuaria',
    otherKey: 'id_area',
    as: 'areas',
  });

  Area.belongsToMany(Usuaria, {
    through: UsuariasAreasExperiencia,
    foreignKey: 'id_area',
    otherKey: 'id_usuaria',
    as: 'usuarias',
  });

  // pivote Profesion
  Usuaria.belongsToMany(Profesion, {
    through: UsuariasProfesion,
    foreignKey: 'id_usuaria',
    otherKey: 'id_profesion',
    as: 'profesion',
  });

  Profesion.belongsToMany(Usuaria, {
    through: UsuariasProfesion,
    foreignKey: 'id_profesion',
    otherKey: 'id_usuaria',
    as: 'usuarias',
  });

  Busqueda.belongsTo(Empresa, {
    foreignKey: 'id_empresa',
    as: "empresa"
  });
  Busqueda.belongsTo(Cargo, {
    foreignKey: "id_cargo", 
    as: "cargo"
  })
  Busqueda.belongsTo(Jornada,{
    foreignKey: "id_jornada",
    as: "jornada"
  })
  Busqueda.belongsTo(Modalidad, {
    foreignKey: "id_modalidad", 
    as: "modalidad"
  })
  Busqueda.belongsTo(Region,{
    foreignKey: "id_region", 
    as: "region"
  })
  Busqueda.belongsTo(RangoAnosBusqueda, {
    foreignKey: "id_anios_experiencia", 
    as: "anios"
  })
  
  Busqueda.belongsToMany(Profesion, {
    through: BusquedaProfesion,
    foreignKey: 'id_busqueda',
    otherKey: 'id_profesion',
    as: 'profesiones',
    });

  Busqueda.belongsToMany(Competencia, {
    through: BusquedaCompetencia,
    foreignKey: 'id_busqueda',
    otherKey: 'id_competencias',
    as: 'competencias',
  });

  Busqueda.belongsToMany(Industria, {
    through: BusquedaIndustria,
    foreignKey: 'id_busqueda',
    otherKey: 'id_industria',
    as: 'industrias',
  });

  Busqueda.belongsToMany(Idioma, {
    through: BusquedaDominioIdioma,
    foreignKey: 'id_busqueda',
    otherKey: 'id_idioma',
    as: 'idiomas',
  });

  Busqueda.belongsToMany(Area, {
    through: BusquedaAreasExperiencia,
    foreignKey: 'id_busqueda',
    otherKey: 'id_areas',
    as: 'areas',
  });

  UsuariosEmpresa.belongsTo(Empresa, {
    foreignKey: 'id_empresa',
    as: 'empresa',
  });

  UsuariosEmpresa.belongsTo(Rol, {
    foreignKey: 'id_rol',
    as: 'rol',
  });

  UsuariaAdmin.belongsTo(Rol, {
    foreignKey: 'id_rol',
    as: 'rol',
  });
  
  Match.belongsTo(Usuaria, {
    foreignKey: 'id_usuaria',
    as: 'usuaria',
  });
  Match.belongsTo(Busqueda, {
    foreignKey: 'id_busqueda',
    as: 'busqueda',
  });

  UsuariasProfesion.belongsTo(Usuaria, {
    foreignKey: 'id_usuaria',
    as: 'usuaria',
  });
  UsuariasProfesion.belongsTo(Profesion, {
    foreignKey: 'id_profesion',
    as: 'profesion',
  });
  UsuariasIndustria.belongsTo(Usuaria, {
    foreignKey: 'id_usuaria',
    as: 'usuaria',
  });
  UsuariasIndustria.belongsTo(Industria, {
    foreignKey: 'id_industria',
    as: 'industria',
  });
  UsuariasAreasExperiencia.belongsTo(Usuaria, {
    foreignKey: 'id_usuaria',
    as: 'usuaria',
  });
  UsuariasAreasExperiencia.belongsTo(Area, {
    foreignKey: 'id_area',
    as: 'area',
  });

  Usuaria.belongsToMany(Community, {
    through: 'UsuariaCommunities',
    foreignKey: 'id'
  });

  // -------------- TO DO ----------------
  // UsuariaAdmin.hasMany(Community, {
  // });
  // -------------- TO DO ----------------

  /* Busqueda.belongsToMany(Industria, {
    through: BusquedaIndustria,
    foreignKey: 'id_busqueda',
    otherKey: 'id_industria',
    as: 'industrias',
  });
  Profesion.belongsToMany(Usuaria, {
    through: UsuariasProfesion,
    foreignKey: 'id_profesion',
    otherKey: 'id_usuaria',
    as: 'usuarias',
  });
  Usuaria.belongsToMany(Profesion, {
    through: UsuariasProfesion,
    foreignKey: 'id_usuaria',
    otherKey: 'id_profesion',
    as: 'profesion',
  }); */

  Usuaria.hasMany(ContactosVerificacion, {
    foreignKey: 'id_usuaria',
    // onDelete: 'CASCADE',
    as: 'contactos_verificacion',
  })
  
//   Community.belongsTo(Usuaria, {
//     foreignKey: 'ownerId',
//     as: 'owner',
//   });
  Community.hasMany(UsuariaCommunity, {
    foreignKey: 'communityId',
    onDelete: 'CASCADE',
  })

  UsuariaCommunity.belongsTo(Community, {
    foreignKey: 'communityId',
    as: 'community',
  });
  UsuariaCommunity.belongsTo(Usuaria, {
    foreignKey: 'userId',
    as: 'usuaria',
  });
//   Usuaria.hasMany(Community, {
//     foreignKey: 'ownerId',
//     onDelete: 'CASCADE',
//   });
  Usuaria.hasMany(UsuariaCommunity, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
  Usuaria.hasOne(Curriculum, {
    foreignKey: 'usuariaId',
    onDelete: 'CASCADE',
  });
  Curriculum.belongsTo(Usuaria, {
    foreignKey: 'usuariaId',
  });
  
  Community.hasMany(UsuariaCommunity, {
    foreignKey: 'communityId',
    onDelete: 'CASCADE',
  });
  Usuaria.hasMany(Post, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
  Community.hasMany(Post, {
    foreignKey: 'communityId',
    onDelete: 'CASCADE',
  });
  Post.belongsTo(Community, {
    foreignKey: 'communityId',
    as: 'community',
  });
  Post.belongsTo(Usuaria, {
    foreignKey: 'userId',
    as: 'usuaria',
  });
  Post.hasMany(PostMultimedia, {
    foreignKey: 'postId',
    onDelete: 'CASCADE',
  });
  PostMultimedia.belongsTo(Post, {
    foreignKey: 'postId',
    as: 'post',
  });
// Relaciones entre usuaria, post y postlike
  Usuaria.hasOne(Curriculum, {
    foreignKey: 'usuariaId',
    onDelete: 'CASCADE',
  });
  PostLike.belongsTo(Usuaria, {
    foreignKey: 'usuariaId',
  });
  Post.hasMany(PostLike, {
    foreignKey: 'postId',
    onDelete: 'CASCADE',
  });
  PostLike.belongsTo(Post, {
    foreignKey: 'postId',
  });
// Relaciones entre usuaria, post y comentarios
  Usuaria.hasMany(Comment, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
  Post.hasMany(Comment, {
    foreignKey: 'postId',
    onDelete: 'CASCADE',
  });
  Comment.belongsTo(Post, {
    foreignKey: 'postId',
    as: 'post',
  });
  Comment.belongsTo(Usuaria, {
    foreignKey: 'userId',
    as: 'usuaria',
  });
  // Relaciones entre posts y reposts
  Post.hasOne(PostRepost, {
    foreignKey: 'newPostId',
    as: 'repostedPost',
    onDelete: 'CASCADE',
  });
  // Relaciones modelo de notificaciones
  Usuaria.hasMany(Notification, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
  Notification.belongsTo(Usuaria, {
    foreignKey: 'userId',
    as: 'usuaria',
  });
  Usuaria.hasMany(Notification, {
    foreignKey: 'triggerUserId',
    onDelete: 'CASCADE',
  });
  Notification.belongsTo(Usuaria, {
    foreignKey: 'triggerUserId',
    as: 'usuariaTrigger',  // Usuaria que hizo alguna acción que gatilla la notificación para otra usuaria
  });
  Post.hasMany(Notification, {
    foreignKey: 'postId',
    onDelete: 'CASCADE',
  });
  Notification.belongsTo(Post, {
    foreignKey: 'postId',
    as: 'post',
  });
  // Relaciones modelo de preferencia de notificaciones
  NotificationPreference.belongsTo(Usuaria, {
    foreignKey: 'userId',
    as: 'usuaria',
  });
  Usuaria.hasOne(NotificationPreference, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
}


module.exports = initModels;
