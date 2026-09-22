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
    ["iphone-15-pro-max", "iPhone 15 Pro Max", ["15 pro max", "iphone15promax"], 98], ["iphone-15-pro", "iPhone 15 Pro", ["15 pro", "iphone15pro"], 95], ["iphone-15", "iPhone 15", ["iphone15"], 94], ["iphone-14-pro-max", "iPhone 14 Pro Max", ["14 pro max"], 93], ["iphone-14-pro", "iPhone 14 Pro", ["14 pro"], 91], ["iphone-14", "iPhone 14", ["iphone14"], 90], ["iphone-13-pro-max", "iPhone 13 Pro Max", ["13 pro max"], 92], ["iphone-13-pro", "iPhone 13 Pro", ["13 pro"], 89], ["iphone-13", "iPhone 13", ["iphone13"], 95], ["iphone-12", "iPhone 12", ["iphone12"], 82], ["iphone-11", "iPhone 11", ["iphone11"], 78], ["iphone-xr", "iPhone XR", ["xr"], 72], ["iphone-se-2022", "iPhone SE (2022)", ["se 3", "se 2022"], 65]].map(([id, name, aliases, popularityScore]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number })) },
  { id: "samsung", name: "Samsung", aliases: ["galaxy", "samsung galaxy"], popularScore: 98, deviceType: "phone", models: [
    ["galaxy-s24-ultra", "Galaxy S24 Ultra", ["s24 ultra", "samsung s24 ultra"], 98], ["galaxy-s24", "Galaxy S24", ["s24"], 94], ["galaxy-s23-ultra", "Galaxy S23 Ultra", ["s23 ultra", "samsung s23 ultra"], 96], ["galaxy-s23", "Galaxy S23", ["s23"], 92], ["galaxy-s22", "Galaxy S22", ["s22"], 82], ["galaxy-a55", "Galaxy A55", ["a55"], 91], ["galaxy-a54", "Galaxy A54", ["a54"], 94], ["galaxy-a34", "Galaxy A34", ["a34"], 86], ["galaxy-a14", "Galaxy A14", ["a14"], 78], ["galaxy-note-20", "Galaxy Note 20", ["note 20"], 70], ["galaxy-z-fold-5", "Galaxy Z Fold5", ["z fold 5", "fold 5"], 75], ["galaxy-z-flip-5", "Galaxy Z Flip5", ["z flip 5", "flip 5"], 78]].map(([id, name, aliases, popularityScore]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number })) },
  { id: "tecno", name: "Tecno", aliases: ["tecno mobile"], popularScore: 96, deviceType: "phone", models: [
    ["camon-30", "Camon 30", ["camon30"], 92], ["camon-20-pro", "Camon 20 Pro", ["camon20 pro"], 86], ["spark-20", "Spark 20", ["spark20"], 92], ["spark-10-pro", "Spark 10 Pro", ["spark10 pro"], 86], ["phantom-v-fold", "Phantom V Fold", ["phantom fold"], 70], ["phantom-v-flip", "Phantom V Flip", ["phantom flip"], 68]].map(([id, name, aliases, popularityScore]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number })) },
  { id: "infinix", name: "Infinix", aliases: ["infinix mobile"], popularScore: 95, deviceType: "phone", models: [
    ["note-50-pro", "Note 50 Pro", ["note50 pro", "note 50"], 92], ["note-40-pro", "Note 40 Pro", ["note40 pro", "note 40"], 94], ["note-40", "Note 40", ["note40"], 88], ["note-30-pro", "Note 30 Pro", ["note30 pro", "note 30"], 86], ["note-30", "Note 30", ["note30"], 88], ["hot-40-pro", "Hot 40 Pro", ["hot40 pro", "hot 40"], 90], ["hot-30", "Hot 30", ["hot30"], 84], ["zero-30", "Zero 30", ["zero30"], 80]].map(([id, name, aliases, popularityScore]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number })) },
  { id: "itel", name: "itel", aliases: ["itel mobile"], popularScore: 86, deviceType: "phone", models: [["s24", "itel S24", ["s24"], 86], ["p55", "itel P55", ["p55"], 82], ["a70", "itel A70", ["a70"], 78], ["a60s", "itel A60s", ["a60s"], 74]].map(([id, name, aliases, popularityScore]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number })) },
  ...[
    ["xiaomi", "Xiaomi", ["mi"], 82, [["14", "Xiaomi 14", ["mi 14"], 80], ["13t", "Xiaomi 13T", ["13 t"], 78]]],
    ["redmi", "Redmi", ["redmi note", "xiaomi redmi"], 90, [["note-13-pro", "Redmi Note 13 Pro", ["note 13 pro"], 88], ["note-12", "Redmi Note 12", ["note12"], 82], ["13c", "Redmi 13C", ["13 c"], 84]]],
    ["poco", "POCO", ["poco x"], 76, [["x6-pro", "POCO X6 Pro", ["x6 pro"], 78], ["x5-pro", "POCO X5 Pro", ["x5 pro"], 70]]],
    ["oppo", "Oppo", ["oppo mobile"], 80, [["reno-11", "Reno 11", ["reno11"], 78], ["a78", "Oppo A78", ["a78"], 74]]],
    ["vivo", "Vivo", ["vivo mobile"], 78, [["v30", "Vivo V30", ["v30"], 78], ["y27", "Vivo Y27", ["y27"], 72]]],
    ["nokia", "Nokia / HMD", ["nokia", "hmd"], 74, [["g42", "Nokia G42", ["g42"], 70], ["c32", "Nokia C32", ["c32"], 68], ["105", "Nokia 105", ["nokia 105"], 65]]],
    ["huawei", "Huawei", ["hua wei"], 65, [["nova-11", "Huawei Nova 11", ["nova 11"], 64], ["p30-pro", "Huawei P30 Pro", ["p30 pro"], 60]]],
    ["honor", "Honor", ["honour"], 67, [["90", "Honor 90", ["honor 90"], 68], ["x8b", "Honor X8b", ["x8 b"], 66]]],
    ["oneplus", "OnePlus", ["one plus"], 64, [["12", "OnePlus 12", ["oneplus12"], 68], ["nord-ce-3", "OnePlus Nord CE 3", ["nord ce 3"], 64]]],
    ["google", "Google Pixel", ["pixel", "google phone"], 65, [["pixel-8-pro", "Pixel 8 Pro", ["pixel8 pro"], 72], ["pixel-7", "Pixel 7", ["pixel7"], 68]]],
    ["motorola", "Motorola", ["moto"], 55, [["edge-40", "Motorola Edge 40", ["edge 40"], 56], ["g54", "Moto G54", ["moto g54"], 58]]],
    ["sony", "Sony", ["xperia"], 48, [["xperia-1-v", "Xperia 1 V", ["xperia 1"], 48]]],
    ["zte", "ZTE", ["nubia", "redmagic"], 48, [["nubia-z60", "Nubia Z60 Ultra", ["z60 ultra"], 48]]],
    ["nothing", "Nothing", ["nothing phone"], 58, [["phone-2", "Nothing Phone (2)", ["nothing 2"], 60], ["phone-1", "Nothing Phone (1)", ["nothing 1"], 52]]],
  ].map(([id, name, aliases, popularScore, models]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularScore: popularScore as number, deviceType: "phone" as const, models: (models as unknown[][]).map(([modelId, modelName, modelAliases, popularityScore]) => ({ id: modelId as string, name: modelName as string, aliases: modelAliases as string[], popularityScore: popularityScore as number })) })),
];

const laptopBrands: BrandSeed[] = [
  { id: "hp", name: "HP", aliases: ["hewlett packard", "hewlett-packard"], popularScore: 100, deviceType: "laptop", models: [["elitebook-840-g10", "EliteBook 840 G10", ["elite 840 g10", "840 g10"], 90], ["elitebook-840-g8", "EliteBook 840 G8", ["elite 840 g8", "840 g8"], 88], ["pavilion-15", "Pavilion 15", ["hp pavilion"], 92], ["probook-450-g8", "ProBook 450 G8", ["probook 450"], 84], ["envy-x360", "Envy x360", ["envy"], 80]].map(([id, name, aliases, popularityScore]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number })) },
  { id: "dell", name: "Dell", aliases: ["dell computers"], popularScore: 97, deviceType: "laptop", models: [["latitude-5420", "Latitude 5420", ["latitude 5420"], 90], ["latitude-7490", "Latitude 7490", ["7490"], 82], ["inspiron-15", "Inspiron 15", ["inspiron"], 88], ["xps-13", "XPS 13", ["xps13"], 78], ["vostro-15", "Vostro 15", ["vostro"], 76]].map(([id, name, aliases, popularityScore]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number })) },
  { id: "lenovo", name: "Lenovo", aliases: ["thinkpad"], popularScore: 94, deviceType: "laptop", models: [["thinkpad-t14", "ThinkPad T14", ["t14", "thinkpad t14"], 90], ["thinkpad-x1-carbon", "ThinkPad X1 Carbon", ["x1 carbon"], 86], ["ideapad-3", "IdeaPad 3", ["ideapad"], 84], ["legion-5", "Legion 5", ["legion"], 78], ["yoga-7", "Yoga 7", ["lenovo yoga"], 74]].map(([id, name, aliases, popularityScore]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number })) },
  { id: "apple-laptop", name: "Apple", aliases: ["mac", "macbook", "mac book"], popularScore: 96, deviceType: "laptop", models: [["macbook-air-m3", "MacBook Air M3", ["air m3", "mac m3"], 92], ["macbook-air-m2", "MacBook Air M2", ["air m2", "mac m2"], 90], ["macbook-air-m1", "MacBook Air M1", ["air m1", "mac m1"], 88], ["macbook-pro-14", "MacBook Pro 14-inch", ["pro 14", "macbook 14"], 90], ["macbook-pro-16", "MacBook Pro 16-inch", ["pro 16", "macbook 16"], 82]].map(([id, name, aliases, popularityScore]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularityScore: popularityScore as number })) },
  ...[
    ["acer", "Acer", ["aspire"], 82, [["aspire-5", "Aspire 5", ["acer aspire"], 82], ["swift-3", "Swift 3", ["acer swift"], 72]]], ["asus", "ASUS", ["asus rog", "vivobook", "zenbook"], 80, [["vivobook-15", "VivoBook 15", ["vivobook"], 82], ["zenbook-14", "ZenBook 14", ["zenbook"], 76], ["rog-strix-g15", "ROG Strix G15", ["rog strix"], 70]]], ["microsoft", "Microsoft Surface", ["surface", "microsoft"], 60, [["surface-laptop-5", "Surface Laptop 5", ["surface laptop"], 68], ["surface-pro-9", "Surface Pro 9", ["surface pro"], 64]]], ["msi", "MSI", ["msi gaming"], 58, [["katana-15", "Katana 15", ["msi katana"], 60], ["modern-14", "Modern 14", ["msi modern"], 52]]], ["samsung-laptop", "Samsung", ["galaxy book"], 55, [["galaxy-book-4", "Galaxy Book4", ["book 4"], 56]]], ["huawei-laptop", "Huawei", ["matebook"], 52, [["matebook-d15", "MateBook D15", ["matebook"], 56]]], ["lg", "LG", ["gram"], 48, [["gram-16", "LG Gram 16", ["lg gram"], 50]]], ["dynabook", "Dynabook / Toshiba", ["toshiba", "dynabook"], 58, [["satellite-pro", "Satellite Pro", ["toshiba satellite"], 60]]],
  ].map(([id, name, aliases, popularScore, models]) => ({ id: id as string, name: name as string, aliases: aliases as string[], popularScore: popularScore as number, deviceType: "laptop" as const, models: (models as unknown[][]).map(([modelId, modelName, modelAliases, popularityScore]) => ({ id: modelId as string, name: modelName as string, aliases: modelAliases as string[], popularityScore: popularityScore as number })) })),
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
  return brand.models
    .map((model) => ({ ...model, brandId: brand.id, brandName: brand.name }))
    .filter((model) => !normalizedQuery || normalizeSearchTerm([model.name, ...model.aliases, brand.name].join(" ")).includes(normalizedQuery))
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit);
};

export const normalizeSearchTerm = (value: string): string => value.toLowerCase().replace(/[\s_-]+/g, "").trim();

export const getBrandById = (deviceType: DeviceType, brandId: string): DeviceBrand | undefined => deviceBrands(deviceType).find((brand) => brand.id === brandId);
