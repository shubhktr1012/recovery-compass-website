export const MAX_CART_ITEMS = 1;

export type CartLikeItem = {
    id: string;
};

function dedupeById<T extends CartLikeItem>(items: T[]): T[] {
    return items.filter((item, index) => items.findIndex((candidate) => candidate.id === item.id) === index);
}

export function normalizeCartItems<T extends CartLikeItem>(items: T[]): T[] {
    const dedupedItems = dedupeById(items);

    if (MAX_CART_ITEMS <= 1) {
        return dedupedItems.length > 0 ? [dedupedItems[dedupedItems.length - 1]] : [];
    }

    return dedupedItems.slice(-MAX_CART_ITEMS);
}

export function nextCartItems<T extends CartLikeItem>(existingItems: T[], nextItem: T): T[] {
    if (MAX_CART_ITEMS <= 1) {
        return [nextItem];
    }

    const withoutReplacement = existingItems.filter((item) => item.id !== nextItem.id);
    return normalizeCartItems([...withoutReplacement, nextItem]);
}

export function formatProgramCountLabel(count: number): string {
    return `${count} program${count === 1 ? "" : "s"} selected`;
}

export function formatPaymentDescription(count: number): string {
    return `Payment for ${count} program${count === 1 ? "" : "s"}`;
}
