import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollProps {
    children: ReactNode;
    scrollAmount?: number;
}

export default function HorizontalScroll({ children, scrollAmount = 600 }: HorizontalScrollProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative group/scroll">
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity"
                >
                    <ChevronLeft size={20} />
                </button>
            )}

            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity"
                >
                    <ChevronRight size={20} />
                </button>
            )}

            <div className="w-full overflow-hidden">
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}