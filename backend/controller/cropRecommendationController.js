/**
 * Crop Recommendation Controller
 * Provides crop suggestions based on soil type, season, and region
 */

// Comprehensive crop database with soil and season requirements
const cropDatabase = {
  rice: {
    name: "Rice (Paddy)",
    nameHi: "धान",
    soilTypes: ["clay", "loamy", "alluvial"],
    seasons: ["kharif", "monsoon"],
    months: [6, 7, 8, 9],
    waterRequirement: "high",
    temperature: "25-35°C",
    rainfall: "100-200 cm",
    duration: "120-150 days",
    regions: ["punjab", "haryana", "up", "bihar", "west bengal", "andhra pradesh"],
    benefits: "High yield, staple food crop, good market demand",
    benefitsHi: "उच्च उपज, मुख्य खाद्य फसल, अच्छी बाजार मांग",
  },
  wheat: {
    name: "Wheat",
    nameHi: "गेहूं",
    soilTypes: ["loamy", "clay", "alluvial"],
    seasons: ["rabi", "winter"],
    months: [10, 11, 12],
    waterRequirement: "medium",
    temperature: "10-25°C",
    rainfall: "50-75 cm",
    duration: "120-150 days",
    regions: ["punjab", "haryana", "up", "mp", "rajasthan"],
    benefits: "Staple food crop, excellent market price, easy storage",
    benefitsHi: "मुख्य खाद्य फसल, उत्कृष्ट बाजार मूल्य, आसान भंडारण",
  },
  maize: {
    name: "Maize (Corn)",
    nameHi: "मक्का",
    soilTypes: ["loamy", "sandy", "alluvial"],
    seasons: ["kharif", "rabi"],
    months: [6, 7, 10, 11],
    waterRequirement: "medium",
    temperature: "21-27°C",
    rainfall: "50-75 cm",
    duration: "80-110 days",
    regions: ["karnataka", "mp", "bihar", "up", "rajasthan"],
    benefits: "Versatile crop, good for fodder, multiple uses",
    benefitsHi: "बहुमुखी फसल, चारे के लिए अच्छी, कई उपयोग",
  },
  cotton: {
    name: "Cotton",
    nameHi: "कपास",
    soilTypes: ["black", "alluvial", "loamy"],
    seasons: ["kharif"],
    months: [5, 6, 7],
    waterRequirement: "medium",
    temperature: "21-30°C",
    rainfall: "50-100 cm",
    duration: "180-210 days",
    regions: ["gujarat", "maharashtra", "telangana", "punjab", "haryana"],
    benefits: "High commercial value, good export potential",
    benefitsHi: "उच्च व्यावसायिक मूल्य, अच्छी निर्यात क्षमता",
  },
  sugarcane: {
    name: "Sugarcane",
    nameHi: "गन्ना",
    soilTypes: ["loamy", "clay", "alluvial"],
    seasons: ["year-round"],
    months: [1, 2, 3, 9, 10, 11],
    waterRequirement: "high",
    temperature: "20-35°C",
    rainfall: "75-150 cm",
    duration: "12-18 months",
    regions: ["up", "maharashtra", "karnataka", "tamil nadu", "punjab"],
    benefits: "Long duration crop, high returns, multiple products",
    benefitsHi: "लंबी अवधि की फसल, उच्च रिटर्न, कई उत्पाद",
  },
  soybean: {
    name: "Soybean",
    nameHi: "सोयाबीन",
    soilTypes: ["black", "loamy", "alluvial"],
    seasons: ["kharif"],
    months: [6, 7],
    waterRequirement: "medium",
    temperature: "20-30°C",
    rainfall: "50-75 cm",
    duration: "90-120 days",
    regions: ["mp", "maharashtra", "rajasthan", "karnataka"],
    benefits: "Nitrogen fixing, oil crop, good protein source",
    benefitsHi: "नाइट्रोजन स्थिरीकरण, तेल फसल, अच्छा प्रोटीन स्रोत",
  },
  groundnut: {
    name: "Groundnut (Peanut)",
    nameHi: "मूंगफली",
    soilTypes: ["sandy", "loamy", "red"],
    seasons: ["kharif", "rabi"],
    months: [6, 7, 11, 12],
    waterRequirement: "low",
    temperature: "20-30°C",
    rainfall: "50-75 cm",
    duration: "100-150 days",
    regions: ["gujarat", "andhra pradesh", "tamil nadu", "karnataka"],
    benefits: "Oil seed crop, drought resistant, good market value",
    benefitsHi: "तिलहन फसल, सूखा प्रतिरोधी, अच्छा बाजार मूल्य",
  },
  mustard: {
    name: "Mustard",
    nameHi: "सरसों",
    soilTypes: ["loamy", "sandy", "alluvial"],
    seasons: ["rabi"],
    months: [10, 11],
    waterRequirement: "low",
    temperature: "10-25°C",
    rainfall: "25-40 cm",
    duration: "90-120 days",
    regions: ["rajasthan", "up", "haryana", "mp", "west bengal"],
    benefits: "Oil seed crop, short duration, cold tolerant",
    benefitsHi: "तिलहन फसल, कम अवधि, ठंड सहनशील",
  },
  potato: {
    name: "Potato",
    nameHi: "आलू",
    soilTypes: ["loamy", "sandy", "alluvial"],
    seasons: ["rabi"],
    months: [10, 11, 12],
    waterRequirement: "medium",
    temperature: "15-25°C",
    rainfall: "50-70 cm",
    duration: "90-120 days",
    regions: ["up", "west bengal", "bihar", "punjab", "mp"],
    benefits: "High yield, good market demand, multiple uses",
    benefitsHi: "उच्च उपज, अच्छी बाजार मांग, कई उपयोग",
  },
  tomato: {
    name: "Tomato",
    nameHi: "टमाटर",
    soilTypes: ["loamy", "sandy", "red"],
    seasons: ["year-round"],
    months: [1, 2, 3, 7, 8, 9],
    waterRequirement: "medium",
    temperature: "20-30°C",
    rainfall: "50-75 cm",
    duration: "60-90 days",
    regions: ["karnataka", "andhra pradesh", "mp", "maharashtra"],
    benefits: "High value crop, good market demand, short duration",
    benefitsHi: "उच्च मूल्य फसल, अच्छी बाजार मांग, कम अवधि",
  },
  onion: {
    name: "Onion",
    nameHi: "प्याज",
    soilTypes: ["loamy", "sandy", "alluvial"],
    seasons: ["rabi", "kharif"],
    months: [6, 7, 10, 11],
    waterRequirement: "medium",
    temperature: "15-25°C",
    rainfall: "50-75 cm",
    duration: "120-150 days",
    regions: ["maharashtra", "karnataka", "mp", "gujarat", "bihar"],
    benefits: "High commercial value, good storage life, export potential",
    benefitsHi: "उच्च व्यावसायिक मूल्य, अच्छा भंडारण जीवन, निर्यात क्षमता",
  },
  chickpea: {
    name: "Chickpea (Chana)",
    nameHi: "चना",
    soilTypes: ["loamy", "black", "clay"],
    seasons: ["rabi"],
    months: [10, 11],
    waterRequirement: "low",
    temperature: "20-30°C",
    rainfall: "40-60 cm",
    duration: "120-150 days",
    regions: ["mp", "maharashtra", "rajasthan", "karnataka", "up"],
    benefits: "Pulse crop, nitrogen fixing, drought tolerant",
    benefitsHi: "दलहन फसल, नाइट्रोजन स्थिरीकरण, सूखा सहनशील",
  },
};

/**
 * Get crop recommendations based on soil type, season, and region
 */
export const getCropRecommendation = async (req, res) => {
  try {
    const { soilType, season, region, month } = req.query;

    if (!soilType) {
      return res.status(400).json({
        success: false,
        message: "Soil type is required",
      });
    }

    // Normalize inputs
    const normalizedSoilType = soilType.toLowerCase().trim();
    const normalizedSeason = season ? season.toLowerCase().trim() : null;
    const normalizedRegion = region ? region.toLowerCase().trim() : null;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    // Filter crops based on criteria
    let recommendations = Object.entries(cropDatabase).filter(([key, crop]) => {
      // Check soil type match
      const soilMatch = crop.soilTypes.some((soil) =>
        normalizedSoilType.includes(soil)
      );

      // Check season match (if provided)
      const seasonMatch = normalizedSeason
        ? crop.seasons.some((s) => s.includes(normalizedSeason))
        : true;

      // Check month match
      const monthMatch = crop.months.includes(currentMonth);

      // Check region match (if provided)
      const regionMatch = normalizedRegion
        ? crop.regions.some((r) => r.includes(normalizedRegion))
        : true;

      return soilMatch && (seasonMatch || monthMatch) && regionMatch;
    });

    // If no exact matches, provide soil-based recommendations
    if (recommendations.length === 0) {
      recommendations = Object.entries(cropDatabase).filter(([key, crop]) =>
        crop.soilTypes.some((soil) => normalizedSoilType.includes(soil))
      );
    }

    // Format recommendations
    const formattedRecommendations = recommendations.map(([key, crop]) => ({
      id: key,
      name: crop.name,
      nameHi: crop.nameHi,
      soilTypes: crop.soilTypes,
      seasons: crop.seasons,
      waterRequirement: crop.waterRequirement,
      temperature: crop.temperature,
      rainfall: crop.rainfall,
      duration: crop.duration,
      regions: crop.regions,
      benefits: crop.benefits,
      benefitsHi: crop.benefitsHi,
      suitabilityScore: calculateSuitability(crop, {
        soilType: normalizedSoilType,
        season: normalizedSeason,
        region: normalizedRegion,
        month: currentMonth,
      }),
    }));

    // Sort by suitability score
    formattedRecommendations.sort(
      (a, b) => b.suitabilityScore - a.suitabilityScore
    );

    res.json({
      success: true,
      query: {
        soilType: normalizedSoilType,
        season: normalizedSeason,
        region: normalizedRegion,
        month: currentMonth,
      },
      recommendations: formattedRecommendations.slice(0, 5), // Top 5 recommendations
      totalFound: formattedRecommendations.length,
    });
  } catch (error) {
    console.error("Crop Recommendation Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while generating crop recommendations",
      error: error.message,
    });
  }
};

/**
 * Calculate suitability score for a crop based on given conditions
 */
function calculateSuitability(crop, conditions) {
  let score = 0;

  // Soil type match (40 points)
  if (
    crop.soilTypes.some((soil) => conditions.soilType.includes(soil))
  ) {
    score += 40;
  }

  // Season/Month match (30 points)
  if (conditions.season && crop.seasons.some((s) => s.includes(conditions.season))) {
    score += 30;
  } else if (crop.months.includes(conditions.month)) {
    score += 25;
  }

  // Region match (20 points)
  if (
    conditions.region &&
    crop.regions.some((r) => r.includes(conditions.region))
  ) {
    score += 20;
  }

  // Water requirement consideration (10 points)
  // Prefer medium water requirement crops
  if (crop.waterRequirement === "medium") {
    score += 10;
  } else if (crop.waterRequirement === "low") {
    score += 8;
  }

  return score;
}

/**
 * Get all available crops in the database
 */
export const getAllCropsInfo = async (req, res) => {
  try {
    const allCrops = Object.entries(cropDatabase).map(([key, crop]) => ({
      id: key,
      name: crop.name,
      nameHi: crop.nameHi,
      soilTypes: crop.soilTypes,
      seasons: crop.seasons,
      waterRequirement: crop.waterRequirement,
      temperature: crop.temperature,
      duration: crop.duration,
    }));

    res.json({
      success: true,
      crops: allCrops,
      total: allCrops.length,
    });
  } catch (error) {
    console.error("Get All Crops Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching crops",
      error: error.message,
    });
  }
};
