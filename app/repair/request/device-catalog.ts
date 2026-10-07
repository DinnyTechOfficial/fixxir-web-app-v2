import { supplementalModelNames } from "./device-model-additions";

export type DeviceType = "phone" | "laptop";

export interface DeviceBrand {
  id: string;
  name: string;
  aliases: string[];
  popularScore: number;
}

export interface DeviceModel {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  aliases: string[];
  series?: string;
  year?: number;
  popularityScore: number;
}

interface BrandSeed extends DeviceBrand {
  deviceType: DeviceType;
  models: Omit<DeviceModel, "brandId" | "brandName">[];
}

const phoneBrands: BrandSeed[] = [
  { id: "apple", name: "Apple", aliases: ["iphone", "ios"], popularScore: 100, deviceType: "phone", models: [
    ["iphone-17-pro-max", "iPhone 17 Pro Max", ["17 pro max", "iphone17promax"], 99, 2025], ["iphone-17-pro", "iPhone 17 Pro", ["17 pro", "iphone17pro"], 97, 2025], ["iphone-17", "iPhone 17", ["iphone17"], 96, 2025], ["iphone-air", "iPhone Air", ["iphoneair"], 95, 2025], ["iphone-16e", "iPhone 16e", ["16e", "iphone16e"], 90, 2025], ["iphone-16-pro-max", "iPhone 16 Pro Max", ["16 pro max"], 94, 2024], ["iphone-16-pro", "iPhone 16 Pro", ["16 pro"], 92, 2024], ["iphone-16", "iPhone 16", ["iphone16"], 91, 2024], ["iphone-16-plus", "iPhone 16 Plus", ["16 plus"], 88, 2024], ["iphone-15-pro-max", "iPhone 15 Pro Max", ["15 pro max", "iphone15promax"], 93, 2023], ["iphone-15-pro", "iPhone 15 Pro", ["15 pro", "iphone15pro"], 90, 2023], ["iphone-15", "iPhone 15", ["iphone15"], 89, 2023], ["iphone-14-pro-max", "iPhone 14 Pro Max", ["14 pro max"], 86, 2022], ["iphone-14-pro", "iPhone 14 Pro", ["14 pro"], 84, 2022], ["iphone-14", "iPhone 14", ["iphone14"], 83, 2022], ["iphone-13-pro-max", "iPhone 13 Pro Max", ["13 pro max"], 80, 2021], ["iphone-13-pro", "iPhone 13 Pro", ["13 pro"], 78, 2021], ["iphone-13", "iPhone 13", ["iphone13"], 79, 2021], ["iphone-12", "iPhone 12", ["iphone12"], 72, 2020], ["iphone-11", "iPhone 11", ["iphone11"], 68, 2019], ["iphone-xr", "iPhone XR", ["xr"], 62, 2018], ["iphone-se-2022", "iPhone SE (2022)", ["se 3", "se 2022"], 60, 2022]].map(([id, name, aliases, popularityScore, year]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number, year: year as number })) },
  { id: "samsung", name: "Samsung", aliases: ["galaxy", "samsung galaxy"], popularScore: 98, deviceType: "phone", models: [
    ["galaxy-s25-ultra", "Galaxy S25 Ultra", ["s25 ultra", "samsung s25 ultra"], 99, 2025], ["galaxy-s25-plus", "Galaxy S25+", ["s25 plus"], 93, 2025], ["galaxy-s25", "Galaxy S25", ["s25"], 92, 2025], ["galaxy-z-fold-7", "Galaxy Z Fold7", ["z fold 7", "fold 7"], 85, 2025], ["galaxy-z-flip-7", "Galaxy Z Flip7", ["z flip 7", "flip 7"], 86, 2025], ["galaxy-s24-ultra", "Galaxy S24 Ultra", ["s24 ultra", "samsung s24 ultra"], 91, 2024], ["galaxy-s24", "Galaxy S24", ["s24"], 87, 2024], ["galaxy-a55", "Galaxy A55", ["a55"], 84, 2024], ["galaxy-s23-ultra", "Galaxy S23 Ultra", ["s23 ultra", "samsung s23 ultra"], 82, 2023], ["galaxy-s23", "Galaxy S23", ["s23"], 78, 2023], ["galaxy-a54", "Galaxy A54", ["a54"], 80, 2023], ["galaxy-a34", "Galaxy A34", ["a34"], 74, 2023], ["galaxy-a14", "Galaxy A14", ["a14"], 68, 2023], ["galaxy-z-fold-5", "Galaxy Z Fold5", ["z fold 5", "fold 5"], 70, 2023], ["galaxy-z-flip-5", "Galaxy Z Flip5", ["z flip 5", "flip 5"], 72, 2023], ["galaxy-s22", "Galaxy S22", ["s22"], 65, 2022], ["galaxy-note-20", "Galaxy Note 20", ["note 20"], 55, 2020]].map(([id, name, aliases, popularityScore, year]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number, year: year as number })) },
  { id: "tecno", name: "Tecno", aliases: ["tecno mobile"], popularScore: 96, deviceType: "phone", models: [
    ["camon-30", "Camon 30", ["camon30"], 92, 2024], ["camon-20-pro", "Camon 20 Pro", ["camon20 pro"], 86, 2023], ["spark-20", "Spark 20", ["spark20"], 92, 2023], ["spark-10-pro", "Spark 10 Pro", ["spark10 pro"], 86, 2023], ["phantom-v-fold", "Phantom V Fold", ["phantom fold"], 70, 2023], ["phantom-v-flip", "Phantom V Flip", ["phantom flip"], 68, 2023]].map(([id, name, aliases, popularityScore, year]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number, year: year as number })) },
  { id: "infinix", name: "Infinix", aliases: ["infinix mobile"], popularScore: 95, deviceType: "phone", models: [
    ["note-50-pro", "Note 50 Pro", ["note50 pro", "note 50"], 92, 2024], ["note-40-pro", "Note 40 Pro", ["note40 pro", "note 40"], 94, 2024], ["note-40", "Note 40", ["note40"], 88, 2024], ["note-30-pro", "Note 30 Pro", ["note30 pro", "note 30"], 86, 2023], ["note-30", "Note 30", ["note30"], 88, 2023], ["hot-40-pro", "Hot 40 Pro", ["hot40 pro", "hot 40"], 90, 2024], ["hot-30", "Hot 30", ["hot30"], 84, 2023], ["zero-30", "Zero 30", ["zero30"], 80, 2023]].map(([id, name, aliases, popularityScore, year]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number, year: year as number })) },
  { id: "itel", name: "itel", aliases: ["itel mobile"], popularScore: 86, deviceType: "phone", models: [["s24", "itel S24", ["s24"], 86, 2024], ["p55", "itel P55", ["p55"], 82, 2023], ["a70", "itel A70", ["a70"], 78, 2024], ["a60s", "itel A60s", ["a60s"], 74, 2023]].map(([id, name, aliases, popularityScore, year]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number, year: year as number })) },
  ...[
    ["xiaomi", "Xiaomi", ["mi"], 82, [
      ["xiaomi-17-ultra", "Xiaomi 17 Ultra", ["17 ultra"], 100, 2026],
      ["xiaomi-17", "Xiaomi 17", ["mi 17"], 98, 2025],
      ["xiaomi-15t-pro", "Xiaomi 15T Pro", ["15t pro", "15 t pro"], 96, 2025],
      ["xiaomi-15t", "Xiaomi 15T", ["15t", "15 t"], 94, 2025],
      ["xiaomi-15-ultra", "Xiaomi 15 Ultra", ["15 ultra"], 93, 2025],
      ["xiaomi-15-pro", "Xiaomi 15 Pro", ["15 pro"], 92, 2025],
      ["xiaomi-15", "Xiaomi 15", ["mi 15"], 90, 2025],
      ["xiaomi-14t-pro", "Xiaomi 14T Pro", ["14t pro", "14 t pro"], 88, 2024],
      ["xiaomi-14t", "Xiaomi 14T", ["14t", "14 t"], 86, 2024],
      ["xiaomi-14-ultra", "Xiaomi 14 Ultra", ["14 ultra"], 85, 2024],
      ["xiaomi-14", "Xiaomi 14", ["mi 14"], 84, 2024],
      ["redmi-note-14-pro-plus-5g", "Redmi Note 14 Pro+ 5G", ["note 14 pro plus"], 82, 2024],
      ["redmi-note-14-pro-5g", "Redmi Note 14 Pro 5G", ["note 14 pro"], 81, 2024],
      ["xiaomi-13t-pro", "Xiaomi 13T Pro", ["13t pro", "13 t pro"], 78, 2023],
      ["xiaomi-13t", "Xiaomi 13T", ["13 t"], 76, 2023],
      ["redmi-note-13-pro-plus-5g", "Redmi Note 13 Pro+ 5G", ["note 13 pro plus"], 75, 2023],
      ["redmi-note-13-pro-5g", "Redmi Note 13 Pro 5G", ["note 13 pro"], 74, 2023],
      ["redmi-note-12-pro-5g", "Redmi Note 12 Pro 5G", ["note 12 pro"], 70, 2023],
    ]],
    ["redmi", "Redmi", ["redmi note", "xiaomi redmi"], 90, [["note-13-pro", "Redmi Note 13 Pro", ["note 13 pro"], 88, 2024], ["note-12", "Redmi Note 12", ["note12"], 82, 2022], ["13c", "Redmi 13C", ["13 c"], 84, 2023]]],
    ["poco", "POCO", ["poco x"], 76, [["x6-pro", "POCO X6 Pro", ["x6 pro"], 78, 2024], ["x5-pro", "POCO X5 Pro", ["x5 pro"], 70, 2023]]],
    ["oppo", "Oppo", ["oppo mobile"], 80, [["reno-11", "Reno 11", ["reno11"], 78, 2024], ["a78", "Oppo A78", ["a78"], 74, 2023]]],
    ["vivo", "Vivo", ["vivo mobile"], 78, [["v30", "Vivo V30", ["v30"], 78, 2024], ["y27", "Vivo Y27", ["y27"], 72, 2023]]],
    ["nokia", "Nokia / HMD", ["nokia", "hmd"], 74, [["g42", "Nokia G42", ["g42"], 70, 2023], ["c32", "Nokia C32", ["c32"], 68, 2023], ["105", "Nokia 105", ["nokia 105"], 65, 2019]]],
    ["huawei", "Huawei", ["hua wei"], 65, [["nova-11", "Huawei Nova 11", ["nova 11"], 64, 2023], ["p30-pro", "Huawei P30 Pro", ["p30 pro"], 60, 2019]]],
    ["honor", "Honor", ["honour"], 67, [["90", "Honor 90", ["honor 90"], 68, 2023], ["x8b", "Honor X8b", ["x8 b"], 66, 2023]]],
    ["oneplus", "OnePlus", ["one plus"], 64, [["12", "OnePlus 12", ["oneplus12"], 68, 2024], ["nord-ce-3", "OnePlus Nord CE 3", ["nord ce 3"], 64, 2023]]],
    ["google", "Google Pixel", ["pixel", "google phone"], 65, [["pixel-8-pro", "Pixel 8 Pro", ["pixel8 pro"], 72, 2023], ["pixel-7", "Pixel 7", ["pixel7"], 68, 2022]]],
    ["motorola", "Motorola", ["moto"], 55, [["edge-40", "Motorola Edge 40", ["edge 40"], 56, 2023], ["g54", "Moto G54", ["moto g54"], 58, 2023]]],
    ["sony", "Sony", ["xperia"], 48, [["xperia-1-v", "Xperia 1 V", ["xperia 1"], 48, 2023]]],
    ["zte", "ZTE", ["nubia", "redmagic"], 48, [["nubia-z60", "Nubia Z60 Ultra", ["z60 ultra"], 48, 2024]]],
    ["nothing", "Nothing", ["nothing phone"], 58, [["phone-2", "Nothing Phone (2)", ["nothing 2"], 60, 2023], ["phone-1", "Nothing Phone (1)", ["nothing 1"], 52, 2022]]],
  ].map(([id, name, aliases, popularScore, models]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularScore: popularScore as number, deviceType: "phone" as const, models: (models as unknown[][]).map(([modelId, modelName, modelAliases, popularityScore, year]) => ({ id: modelId as string, name: modelName as string, aliases: modelAliases as string[], popularityScore: popularityScore as number, year: year as number })) })),
];

const laptopBrands: BrandSeed[] = [
  { id: "hp", name: "HP", aliases: ["hewlett packard", "hewlett-packard"], popularScore: 100, deviceType: "laptop", models: [["elitebook-840-g10", "EliteBook 840 G10", ["elite 840 g10", "840 g10"], 90, 2023], ["elitebook-840-g8", "EliteBook 840 G8", ["elite 840 g8", "840 g8"], 88, 2021], ["pavilion-15", "Pavilion 15", ["hp pavilion"], 92, 2023], ["probook-450-g8", "ProBook 450 G8", ["probook 450"], 84, 2021], ["envy-x360", "Envy x360", ["envy"], 80, 2023]].map(([id, name, aliases, popularityScore, year]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number, year: year as number })) },
  { id: "dell", name: "Dell", aliases: ["dell computers"], popularScore: 97, deviceType: "laptop", models: [["latitude-5420", "Latitude 5420", ["latitude 5420"], 90, 2021], ["latitude-7490", "Latitude 7490", ["7490"], 82, 2018], ["inspiron-15", "Inspiron 15", ["inspiron"], 88, 2023], ["xps-13", "XPS 13", ["xps13"], 78, 2023], ["vostro-15", "Vostro 15", ["vostro"], 76, 2022]].map(([id, name, aliases, popularityScore, year]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number, year: year as number })) },
  { id: "lenovo", name: "Lenovo", aliases: ["thinkpad"], popularScore: 94, deviceType: "laptop", models: [["thinkpad-t14", "ThinkPad T14", ["t14", "thinkpad t14"], 90, 2023], ["thinkpad-x1-carbon", "ThinkPad X1 Carbon", ["x1 carbon"], 86, 2023], ["ideapad-3", "IdeaPad 3", ["ideapad"], 84, 2022], ["legion-5", "Legion 5", ["legion"], 78, 2023], ["yoga-7", "Yoga 7", ["lenovo yoga"], 74, 2023]].map(([id, name, aliases, popularityScore, year]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number, year: year as number })) },
  { id: "apple-laptop", name: "Apple", aliases: ["mac", "macbook", "mac book"], popularScore: 96, deviceType: "laptop", models: [["macbook-air-m3", "MacBook Air M3", ["air m3", "mac m3"], 92, 2024], ["macbook-air-m2", "MacBook Air M2", ["air m2", "mac m2"], 90, 2022], ["macbook-air-m1", "MacBook Air M1", ["air m1", "mac m1"], 88, 2020], ["macbook-pro-14", "MacBook Pro 14-inch", ["pro 14", "macbook 14"], 90, 2023], ["macbook-pro-16", "MacBook Pro 16-inch", ["pro 16", "macbook 16"], 82, 2023]].map(([id, name, aliases, popularityScore, year]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number, year: year as number })) },
  ...[
    ["acer", "Acer", ["aspire"], 82, [["aspire-5", "Aspire 5", ["acer aspire"], 82, 2023], ["swift-3", "Swift 3", ["acer swift"], 72, 2023]]], ["asus", "ASUS", ["asus rog", "vivobook", "zenbook"], 80, [["vivobook-15", "VivoBook 15", ["vivobook"], 82, 2023], ["zenbook-14", "ZenBook 14", ["zenbook"], 76, 2023], ["rog-strix-g15", "ROG Strix G15", ["rog strix"], 70, 2023]]], ["microsoft", "Microsoft Surface", ["surface", "microsoft"], 60, [["surface-laptop-5", "Surface Laptop 5", ["surface laptop"], 68, 2022], ["surface-pro-9", "Surface Pro 9", ["surface pro"], 64, 2022]]], ["msi", "MSI", ["msi gaming"], 58, [["katana-15", "Katana 15", ["msi katana"], 60, 2023], ["modern-14", "Modern 14", ["msi modern"], 52, 2023]]], ["samsung-laptop", "Samsung", ["galaxy book"], 55, [["galaxy-book-4", "Galaxy Book4", ["book 4"], 56, 2024]]], ["huawei-laptop", "Huawei", ["matebook"], 52, [["matebook-d15", "MateBook D15", ["matebook"], 56, 2023]]], ["lg", "LG", ["gram"], 48, [["gram-16", "LG Gram 16", ["lg gram"], 50, 2023]]], ["dynabook", "Dynabook / Toshiba", ["toshiba", "dynabook"], 58, [["satellite-pro", "Satellite Pro", ["toshiba satellite"], 60, 2022]]],
  ].map(([id, name, aliases, popularScore, models]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularScore: popularScore as number, deviceType: "laptop" as const, models: (models as unknown[][]).map(([modelId, modelName, modelAliases, popularityScore, year]) => ({ id: modelId as string, name: modelName as string, aliases: modelAliases as string[], popularityScore: popularityScore as number, year: year as number })) })),
];

const seeds = [...phoneBrands, ...laptopBrands];

export const deviceBrands = (deviceType: DeviceType): DeviceBrand[] =>
  seeds.filter((brand) => brand.deviceType === deviceType).map(({ id, name, aliases, popularScore }) => ({ id, name, aliases, popularScore }));

export const searchBrands = (deviceType: DeviceType, query: string, limit = 8): DeviceBrand[] => {
  const normalizedQuery = normalizeSearchTerm(query);
  return deviceBrands(deviceType)
    .filter((brand) => !normalizedQuery || normalizeSearchTerm([brand.name, ...brand.aliases].join(" ")).includes(normalizedQuery))
    .sort((a, b) => b.popularScore - a.popularScore)
    .slice(0, limit);
};

export const searchModels = (deviceType: DeviceType, brandId: string, query: string, limit = 8): DeviceModel[] => {
  const normalizedQuery = normalizeSearchTerm(query);
  const brand = seeds.find((item) => item.deviceType === deviceType && item.id === brandId);
  if (!brand) return [];
  const seenNames = new Set<string>();
  const supplementalModels = (supplementalModelNames[brand.id] || []).map((name) => ({
    id: name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    aliases: [] as string[],
    popularityScore: 45,
    year: undefined as number | undefined,
  }));

  return [...brand.models, ...supplementalModels]
    .filter((model) => {
      const normalizedName = normalizeSearchTerm(model.name);
      if (seenNames.has(normalizedName)) return false;
      seenNames.add(normalizedName);
      return true;
    })
    .map((model) => ({ ...model, brandId: brand.id, brandName: brand.name }))
    .filter((model) => !normalizedQuery || normalizeSearchTerm([model.name, ...model.aliases, brand.name].join(" ")).includes(normalizedQuery))
    // Newest models first: models with a known release year are ranked by recency before
    // falling back to popularity, so new releases surface ahead of older, more "popular" ones.
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || b.popularityScore - a.popularityScore)
    .slice(0, limit);
};

export const normalizeSearchTerm = (value: string): string => value.toLowerCase().replace(/[\s_-]+/g, "").trim();

export const getBrandById = (deviceType: DeviceType, brandId: string): DeviceBrand | undefined => deviceBrands(deviceType).find((brand) => brand.id === brandId);
