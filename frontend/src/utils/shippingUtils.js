// Distances in km from Colombo (dispatch center)
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
  'Trincomalee': 260,
  'Batticaloa': 310,
  'Kurunegala': 95,
  'Matale': 145,
  'Badulla': 220,
  'Nuwara Eliya': 165,
};

/**
 * Returns the km distance between two locations.
 * For Sri Lanka, uses the lookup table (distances from Colombo).
 * For international, returns a fixed large value.
 */
export const calculateDistance = (fromCity, fromCountry, toCity, toCountry) => {
  const fCountry = (fromCountry || '').trim().toLowerCase();
  const tCountry = (toCountry || '').trim().toLowerCase();
  const fCity    = (fromCity   || '').trim();
  const tCity    = (toCity     || '').trim();

  const isFromSL = fCountry === 'sri lanka';
  const isToSL   = tCountry === 'sri lanka';

  if (isFromSL && isToSL) {
    const lookup = (city) => {
      const key = Object.keys(SL_CITY_DISTANCES)
        .find(k => k.toLowerCase() === city.toLowerCase());
      return key !== undefined ? SL_CITY_DISTANCES[key] : null;
    };

    const fromDist = lookup(fCity) ?? 0;   // Distance of dispatch city from Colombo
    const toDist   = lookup(tCity) ?? 30;  // Distance of user city from Colombo (30km fallback)

    // If dispatch city IS Colombo (dist=0) → user's distance is the delivery distance
    // Otherwise compute the difference between the two
    const distance = Math.abs(fromDist - toDist);

    // Minimum 2 km for same-area deliveries
    return distance === 0 ? 2 : distance;
  }

  // International: fixed mock (real apps would use a geo API)
  if (!isToSL) return 5000;

  return 50;
};

/**
 * Calculates delivery fee for Sri Lanka (local) OR shipment fee for international.
 * - Sri Lanka: localBase + (distance * localPerKm)
 * - International: internationalBase + (distance * internationalPerKm)
 */
export const calculateDeliveryFee = (distance, rates) => {
  const { localBase = 0, localPerKm = 2 } = rates;
  return localBase + (distance * localPerKm);
};

export const calculateShipmentFee = (distance, rates) => {
  const { internationalBase = 50, internationalPerKm = 0.5 } = rates;
  return internationalBase + (distance * internationalPerKm);
};

// Keep legacy export for backward compat
export const calculateShippingFee = (distance, rates, isLocal) => {
  return isLocal
    ? calculateDeliveryFee(distance, rates)
    : calculateShipmentFee(distance, rates);
};

