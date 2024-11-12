import Filter from "../../app/shared/models/filter";

// TODO: filters should be fetched from products list
export const FILTERS: Filter = {
    brands: ['Nothing', 'Samsung', 'Redmi', 'Realme', 'Apple', 'Google'],
    processor: ['Snapdragon', 'MediaTek', 'Exynos', 'Google Tensor'],
    price: [5000, 10000, 15000, 20000, 30000, 50000, 100000],
    connectivity: ["4G", "5G"],
    battery: [5000, 6000],
    category: ['Premium', 'Budget']
};