import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface TestimonialCardProps {
    quote: string;
    name: string;
    role: string;
    avatarSrc?: string;
    rating?: number;
    className?: string;
}

export function TestimonialCard({
    quote,
    name,
    role,
    avatarSrc,
    rating = 5,
    className,
}: TestimonialCardProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-start gap-6 p-8 rounded-xl w-[350px] shrink-0 min-h-[380px]",
                "bg-[#d5dec5] text-[#1C2706]",
                className
            )}
        >
            {/* 1. Rating Stars */}
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            "size-5",
                            i < rating ? "fill-[#1C2706] text-[#1C2706]" : "fill-transparent text-[#1C2706]/30"
                        )}
                    />
                ))}
            </div>

            {/* 2. Review Quote */}
            <p className="text-lg font-medium leading-relaxed font-sans whitespace-normal">
                &quot;{quote}&quot;
            </p>

            {/* 3. Author Info */}
            <div className="flex items-center gap-4 mt-auto">
                <Avatar className="size-12 border-2 border-[#1C2706]">
                    <AvatarImage src={avatarSrc} alt={name} className="object-cover" />
                    <AvatarFallback className="bg-[#1C2706]/10 text-[#1C2706]">
                        {name.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                {/* Name & Role */}
                <div className="flex flex-col">
                    <span className="font-semibold text-base leading-none mb-1">
                        {name}
                    </span>
                    <span className="text-sm opacity-80 leading-none">
                        {role}
                    </span>
                </div>
            </div>
        </div>
    );
}
