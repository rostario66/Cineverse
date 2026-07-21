export type TabId = "watchlist" | "watched" | "reviews" | "liked";

interface Tab {
    id: TabId,
    label: string;
}

const tabs: Tab[] = [
    { id: "watchlist", label: "Watchlist" },
    { id: "watched", label: "Watched" },
    { id: "reviews", label: "Reviews" },
    { id: "liked", label: "Liked" }
];

interface ProfileTabsProps {
    activeTab: TabId,
    onTabChange: (tab: TabId) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
    return (
        <div className="border-b border-white/10 mb-6">
            <div className="flex gap-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`pb-3 text-sm font-semibold tracking-wider uppercase transition-colors border-b-2 -mb-px ${
                            activeTab === tab.id
                                ? 'text-cyan-400 border-cyan-400'
                                : 'text-gray-500 border-transparent hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
