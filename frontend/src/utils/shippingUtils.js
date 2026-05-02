// Mock function to get distance between two points
// In a real app, you'd use Google Maps Distance Matrix API or Haversine formula with lat/lng
export const calculateDistance = (fromCity, fromCountry, toCity, toCountry) => {
  if (fromCountry === toCountry && fromCity === toCity) return 0;
  
  // Basic mock distances
  if (fromCountry !== toCountry) {
    // International
    return 5000; // Flat 5000km for international mock
  }
  
  // Same country (e.g. Sri Lanka)
  return 50; // Flat 50km for local mock if cities differ
};

export const calculateShippingFee = (distance, rates, isLocal) => {
  if (isLocal) return 0; // Sri Lanka is free as per user request
  
  const { internationalBase, internationalPerKm } = rates;
  return internationalBase + (distance * internationalPerKm);
};
