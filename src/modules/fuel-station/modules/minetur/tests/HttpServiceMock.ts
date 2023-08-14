import { PRODUCTS_VALID } from "./ProductosPetroliferosDtoSamples";

export default class HttpServiceMock {
  axiosRef = {
    get: jest.fn(),
  };
}

export const RESPONSE_VALID = Object.freeze( {
  data: Object.freeze( {
    Fecha: "12/08/2023 19:00:58",
    ListaEESSPrecio: [
      ...PRODUCTS_VALID,
    ],
    Nota: "Archivo de todos los productos en todas las estaciones de servicio. La actualización de precios se realiza cada media hora, con los precios en vigor en ese momento.",
    ResultadoConsulta: "OK",
  } ),
} );

export const RESPONSE_INVALID_NOT_OK = Object.freeze( {
  data: Object.freeze( {
    ...RESPONSE_VALID.data,
    ResultadoConsulta: "KO",
  } ),
} );
