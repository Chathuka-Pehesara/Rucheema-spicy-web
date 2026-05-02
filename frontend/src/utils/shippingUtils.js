// Mock city distances from Colombo (Source)
const SL_CITY_DISTANCES = {
  'Colombo': 0,
  'Dehiwala': 10,
  'Kotte': 12,
  'Kandy': 115,
  'Galle': 125,
  'Jaffna': 395,
  'Negombo': 38,
  'Anuradhapura': 200,
  'Ratnapura': 100,
  'Matara': 160,
};

export const calculateDistance = (fromCity, fromCountry, toCity, toCountry) => {
  if (fromCountry === toCountry && fromCity === toCity) return 0;
  
  if (fromCountry === 'Sri Lanka' && toCountry === 'Sri Lanka') {
    // If it's SL, try to get distance from our table
    const d1 = SL_CITY_DISTANCES[fromCity] || 0;
    const d2 = SL_CITY_DISTANCES[toCity] || 50; // Default 50km if city not in table
    return Math.abs(d1 - d2);
  }
  
  // Basic mock distances for international
  if (fromCountry !== toCountry) {
    return 5000; // Flat 5000km for international mock
  }
  
  return 50; 
};

export const calculateShippingFee = (distance, rates, isLocal) => {
  if (isLocal) {
    const { localBase, localPerKm } = rates;
    return localBase + (distance * localPerKm);
  }
  
  const { internationalBase, internationalPerKm } = rates;
  return internationalBase + (distance * internationalPerKm);
};
