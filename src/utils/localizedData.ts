import { Product, Notification, SoilTest, PlantDisease } from '../types';

export const getLocalizedProducts = (t: (key: string) => string): Product[] => [
  {
    id: 1,
    name: t('demoData.products.copperFungicide'),
    category: t('demoData.categories.fungicides'),
    price: 1850,
    rating: 4.6,
    inStock: true
  },
  {
    id: 2,
    name: t('demoData.products.glyphosate'),
    category: t('demoData.categories.herbicides'),
    price: 950,
    rating: 4.3,
    inStock: true
  },
  {
    id: 3,
    name: t('demoData.products.neemOil'),
    category: t('demoData.categories.biopesticides'),
    price: 1250,
    rating: 4.8,
    inStock: true
  },
  {
    id: 4,
    name: t('demoData.products.npkFertilizer'),
    category: t('demoData.categories.fertilizers'),
    price: 2100,
    rating: 4.5,
    inStock: false
  },
  {
    id: 5,
    name: t('demoData.products.mancozeb'),
    category: t('demoData.categories.fungicides'),
    price: 1450,
    rating: 4.4,
    inStock: true
  },
  {
    id: 6,
    name: t('demoData.products.2,4-DAmine'),
    category: t('demoData.categories.herbicides'),
    price: 750,
    rating: 4.2,
    inStock: true
  }
];

export const getLocalizedNotifications = (t: (key: string) => string): Notification[] => [
  {
    id: 1,
    title: t('demoData.notifications.soilTestReady'),
    message: t('demoData.notifications.soilTestMessage'),
    time: `2 ${t('demoData.notifications.timeAgo.hoursAgo')}`,
    read: false,
    type: 'success'
  },
  {
    id: 2,
    title: t('demoData.notifications.weatherAlert'),
    message: t('demoData.notifications.weatherMessage'),
    time: `1 ${t('demoData.notifications.timeAgo.dayAgo')}`,
    read: false,
    type: 'warning'
  },
  {
    id: 3,
    title: t('demoData.notifications.pestAlert'),
    message: t('demoData.notifications.pestMessage'),
    time: `2 ${t('demoData.notifications.timeAgo.daysAgo')}`,
    read: true,
    type: 'error'
  }
];

export const getLocalizedSoilTests = (t: (key: string) => string): SoilTest[] => [
  {
    id: 1,
    date: '2025-01-20',
    status: 'completed',
    ph: 6.8,
    nitrogen: 'Medium',
    phosphorus: 'High',
    potassium: 'Low',
    recommendations: [
      t('demoData.soilRecommendations.addPotassium'),
      t('demoData.soilRecommendations.maintainPH'),
      t('demoData.soilRecommendations.goodNitrogen')
    ]
  },
  {
    id: 2,
    date: '2025-01-15',
    status: 'processing',
    recommendations: []
  }
];

export const getLocalizedPlantDiseases = (t: (key: string) => string): PlantDisease[] => [
  {
    id: 1,
    date: '2025-01-18',
    crop: 'Wheat',
    disease: t('demoData.diseases.leafRust'),
    severity: 'Moderate',
    confidence: 85,
    treatment: t('demoData.treatments.applyFungicide'),
    status: 'identified'
  },
  {
    id: 2,
    date: '2025-01-16',
    crop: 'Rice',
    disease: t('demoData.diseases.bacterialBlight'),
    severity: 'High',
    confidence: 92,
    treatment: t('demoData.treatments.useCopper'),
    status: 'treated'
  }
];