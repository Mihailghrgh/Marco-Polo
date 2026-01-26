export const crime_Endpoints = [
  { location: "London", request_Endpoint: "LONDON_CRIME" },
  { location: "San Francisco", request_Endpoint: "SAN_FRANCISCO_CRIME" },
];

export enum crime_Categories {
  ARSON_AND_CRIMINAL_DAMAGE = "ARSON AND CRIMINAL DAMAGE",
  BURGLARY = "BURGLARY",
  DRUG_OFFENCES = "DRUG OFFENCES",
  MISCELLANEOUS_CRIMES_AGAINST_SOCIETY = "MISCELLANEOUS CRIMES AGAINST SOCIETY",
  POSSESSION_OF_WEAPONS = "POSSESSION OF WEAPONS",
  PUBLIC_ORDER_OFFENCES = "PUBLIC ORDER OFFENCES",
  ROBBERY = "ROBBERY",
  SEXUAL_OFFENCES = "SEXUAL OFFENCES",
  THEFT = "THEFT",
  VEHICLE_OFFENCES = "VEHICLE OFFENCES",
  VIOLENCE_AGAINST_THE_PERSON = "VIOLENCE AGAINST THE PERSON",
  FRAUD_AND_FORGERY = "FRAUD AND FORGERY",
  NFIB_FRAUD = "NFIB FRAUD",
}

export const polygon_Endpoints = [
  { location: "London", request_Endpoint: "LONDON_POLYGON" },
  { location: "San Francisco", request_Endpoint: "SAN_FRANCISCO_POLYGON" },
];

export const design_Endpoints = [
  { type: "Default", request_Endpoint: "DEFAULT_MAP" },
  { type: "Dark", request_Endpoint: "DARK_MAP" },
  { type: "Realistic", request_Endpoint: "REALISTIC_MAP" },
];
