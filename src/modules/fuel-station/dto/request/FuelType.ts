// Abreviatudas sacadas de: https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProductosPetroliferos/

export enum FuelType {
  Gasolina95E5 = "G95E5",
  Gasolina95E10 = "G95E510",
  Gasolina95E5Premium = "G95E5+",
  Gasolina98E5 = "G98E5",
  Gasolina98E10 = "G98E10",
  GasoleoA = "GOA",
  GasoleoPremium = "GOA+",
  GasoleoB = "GOB",
  GasoleoC = "GOC",
  Bioetanol = "BIE",
  Biodiesel = "BIO",
  Hidrogeno = "H2",
}

export function stringToFuelTypeOrFail(str: string): FuelType {
  const strCasted = str as FuelType;

  if (Object.values(FuelType).includes(strCasted))
    return strCasted;

  throw new Error(`FuelType ${str} not found`);
}
