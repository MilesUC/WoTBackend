const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize');
const Disponibilidad = require("../models/Disponibilidad");
const Jornada = require("../models/Jornada");
const Modalidad = require("../models/Modalidad");
const Area = require("../models/Area");
const Region = require("../models/Region");
const Profesion = require("../models/Profesion");
const Industria = require("../models/Industria");
const Competencia = require("../models/Competencia");
const idioma = require("../models/Idioma");
const FormularioPersonalidad = require("../models/FormularioPersonalidad");
const RangoAnosBusqueda  = require("../models/rangoanosbusqueda");
const PaisDomicilio = require("../models/PaisDomicilio");
const Universidad = require("../models/Universidad");
const Cargo = require("../models/Cargo");
const AniosExperiencia = require("../models/AniosExperiencia");
const ConocioWot = require("../models/ConocioWot");
const Fundacion = require("../models/Fundacion");
const IngresoAnual = require("../models/IngresoAnual");
const CantidadEmpleados = require("../models/CantidadEmpleados");


exports.getDisponibilidades = asyncHandler(async (req, res, next) => {
    try {
        const disponibilidades = await Disponibilidad.findAll();
        res.json(disponibilidades);
    } catch (error) {
        next(error);
    }
});

exports.getJornadas = asyncHandler(async (req, res, next) => {
    try {
        const jornadas = await Jornada.findAll();
        res.json(jornadas);
    } catch (error) {
        next(error);
    }
});

exports.getModalidades = asyncHandler(async (req, res, next) => {
    try {
        const modalidades = await Modalidad.findAll();
        res.json(modalidades);
    } catch (error) {
        next(error);
    }
});

exports.getAreas = asyncHandler(async (req, res, next) => {
    try {
        const areas = await Area.findAll();
        res.json(areas);
    } catch (error) {
        next(error);
    }
});

exports.getRegiones = asyncHandler(async (req, res, next) => {
    try {
        const regiones = await Region.findAll();
        res.json(regiones);
    } catch (error) {
        next(error);
    }
});

exports.getProfesiones = asyncHandler(async (req, res, next) => {
    try {
        const profesiones = await Profesion.findAll();
        res.json(profesiones);
    } catch (error) {
        next(error);
    }
});

exports.getIndustrias = asyncHandler(async (req, res, next) => {
    try {
        const industrias = await Industria.findAll();
        res.json(industrias);
    } catch (error) {
        next(error);
    }
});

exports.getCompetencias = asyncHandler(async (req, res, next) => {
    try {
        const competencias = await Competencia.findAll();
        res.json(competencias);
    } catch (error) {
        next(error);
    }
});

exports.getIdiomas = asyncHandler(async (req, res, next) => {
    try {
        const idiomas = await idioma.findAll();
        res.json(idiomas);
    } catch (error) {
        next(error);
    }
});

exports.getFormularios = asyncHandler(async (req, res, next) => {
    try {
        const formularios = await FormularioPersonalidad.findAll();
        res.json(formularios);
    } catch (error) {
        next(error);
    }
});

exports.getRangoAnos = asyncHandler(async (req, res, next) => {
    try {
        const rangoAnos = await RangoAnosBusqueda.findAll();

        res.json(rangoAnos);
    } catch (error) {
        next(error);
    }
});

exports.getPaises = asyncHandler(async (req, res, next) => {
    try {
        const paises = await PaisDomicilio.findAll();
        res.json(paises);
    } catch (error) {
        next(error);
    }
});

exports.getUniversidades = asyncHandler(async (req, res, next) => {
    try {
        const universidades = await Universidad.findAll();
        res.json(universidades);
    } catch (error) {
        next(error);
    }
});

exports.getCargos = asyncHandler(async (req, res, next) => {
    try {
        const cargos = await Cargo.findAll();
        res.json(cargos);
    } catch (error) {
        next(error);
    }
});

exports.getAniosExperiencia = asyncHandler(async (req, res, next) => {
    try {
        const aniosExperiencia = await AniosExperiencia.findAll();
        res.json(aniosExperiencia);
    } catch (error) {
        next(error);
    }
});

exports.getConocioWot = asyncHandler(async (req, res, next) => {
    try {
        const conocioWot = await ConocioWot.findAll();
        res.json(conocioWot);
    } catch (error) {
        next(error);
    }
});

exports.getAnosFundacion = asyncHandler(async (req, res, next) => {
    try {
        const fundaciones = await Fundacion.findAll();
        res.json(fundaciones);
    } catch (error) {
        next(error);
    }
});

exports.getIngresosAnuales = asyncHandler(async (req, res, next) => {
    try {
        const ingresosAnuales = await IngresoAnual.findAll();
        res.json(ingresosAnuales);
    } catch (error) {
        next(error);
    }
});

exports.getCantidadEmpleados = asyncHandler(async (req, res, next) => {
    try {
        const cantidadEmpleados = await CantidadEmpleados.findAll();
        res.json(cantidadEmpleados);
    } catch (error) {
        next(error);
    }
});
