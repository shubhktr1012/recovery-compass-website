export const DIET_PLAN_CART_ID = "custom-diet-plan";
export const DIET_PLAN_CHECKOUT_SLUG = "custom_diet_plan";

export const DIET_PLAN_STANDALONE_PRICE_INR = 1299;
export const DIET_PLAN_ADDON_PRICE_INR = 1299;

export const DIET_PLAN_ADDON_CART_ITEM = {
    id: DIET_PLAN_CART_ID,
    title: "Custom Diet Plan",
    price: DIET_PLAN_ADDON_PRICE_INR,
    tag: "Nutrition Add-on",
} as const;

export type DietPlanCheckoutSlug = typeof DIET_PLAN_CHECKOUT_SLUG;

export function isDietPlanCartId(id: string) {
    return id === DIET_PLAN_CART_ID || id === DIET_PLAN_CHECKOUT_SLUG;
}

export function isDietPlanCheckoutSlug(slug: string): slug is DietPlanCheckoutSlug {
    return slug === DIET_PLAN_CHECKOUT_SLUG;
}
