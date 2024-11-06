import Filter from "../../app/shared/models/filter";

export const FILTERS: Filter = {
    brands: ['Nothing', 'Samsung', 'Redmi', 'Realme', 'Apple', 'Poco', 'Google', 'Xiaomi', "Lava", "IQOO", "Vivo"],
    processor: ['Snapdragon', 'MediaTek', 'Exynos', 'Google Tensor'],
    price: [5000, 10000, 15000, 20000, 30000, 50000, 100000],
    connectivity: ["4G", "5G"],
    battery: [5000, 6000],
    usp: ['Camera', 'Processor', 'Screen', 'Battery'],
    category: ['Premium', 'Budget']
};