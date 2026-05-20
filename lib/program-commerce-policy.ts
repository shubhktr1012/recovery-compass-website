import { canonicalizePublicProgramId } from "@/lib/public-programs";
import { DIET_PLAN_CART_ID, isDietPlanCartId } from "@/lib/diet-plan-product";

export const MAX_CART_ITEMS = 6;

export function canonicalizeWebsiteProgramId(id: string): string {
    const canonicalProgramId = canonicalizePublicProgramId(id);
    if (canonicalProgramId) {
        return canonicalProgramId;
    }

    return isDietPlanCartId(id) ? DIET_PLAN_CART_ID : id;
}

export type CartLikeItem = {
    id: string;
};

function dedupeById<T extends CartLikeItem>(items: T[]): T[] {
    return items.filter((item, index) => items.findIndex((candidate) => candidate.id === item.id) === index);
}

export function normalizeCartItems<T extends CartLikeItem>(items: T[]): T[] {
    const canonicalizedItems = items.map((item) => ({
        ...item,
        id: canonicalizeWebsiteProgramId(item.id),
    }));
    const dedupedItems = dedupeById(canonicalizedItems);

    if (MAX_CART_ITEMS <= 1) {
        return dedupedItems.length > 0 ? [dedupedItems[dedupedItems.length - 1]] : [];
    }

    return dedupedItems.slice(-MAX_CART_ITEMS);
}

export function nextCartItems<T extends CartLikeItem>(existingItems: T[], nextItem: T): T[] {
    const canonicalNextItem = {
        ...nextItem,
        id: canonicalizeWebsiteProgramId(nextItem.id),
    };

    if (MAX_CART_ITEMS <= 1) {
        return [canonicalNextItem];
    }

    const withoutReplacement = existingItems.filter((item) => item.id !== canonicalNextItem.id);
    return normalizeCartItems([...withoutReplacement, canonicalNextItem]);
}

export function formatProgramCountLabel(count: number): string {
    return `${count} program${count === 1 ? "" : "s"} selected`;
}

export function formatPaymentDescription(count: number): string {
    return `Payment for ${count} program${count === 1 ? "" : "s"}`;
}
