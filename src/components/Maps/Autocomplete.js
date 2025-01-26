// AutocompleteService.ts
import { AutocompleteSessionToken } from "@googlemaps/google-maps-services-js";

export const createAutocompleteRequest = (input) => {
  const token = new AutocompleteSessionToken();
  return {
    input,
    locationRestriction: {
      west: -122.44,
      north: 37.8,
      east: -122.39,
      south: 37.78,
    },
    origin: { lat: 37.7893, lng: -122.4039 },
    includedPrimaryTypes: [],
    language: "it-EU",
    region: "eu",
    sessionToken: token, // Associa il token alla richiesta
  };
};
