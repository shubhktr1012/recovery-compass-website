import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface TestimonialCardProps {
    quote: string;
    name: string;
    attribution?: string | null;
    className?: string;
}

export function TestimonialCard({
    quote,
    name,
    attribution,
    className,
}: TestimonialCardProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-start gap-6 p-8 rounded-xl w-[350px] shrink-0 min-h-[320px]",
                "bg-[oklch(0.95_0.025_146.79)] text-[oklch(0.2475_0.0661_146.79)]",
                className
            )}
        >
            <p className="text-lg font-medium leading-relaxed font-sans whitespace-normal">
                &quot;{quote}&quot;
            </p>

            <div className="flex items-center gap-4 mt-auto">
                <Avatar className="size-12 border-2 border-[oklch(0.2475_0.0661_146.79)]">
                    <AvatarFallback className="bg-[oklch(0.2475_0.0661_146.79)]/10 text-[oklch(0.2475_0.0661_146.79)]">
                        {name
                            .split(" ")
                            .map((part) => part.charAt(0))
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <span className="font-semibold text-base leading-none mb-1">
                        {name}
                    </span>
                    {attribution ? (
                        <span className="text-sm opacity-80 leading-none">
                            {attribution}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
