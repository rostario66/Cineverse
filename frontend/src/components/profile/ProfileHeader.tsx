import type { UserProfile } from '../../types';
import { User } from 'lucide-react';

interface ProfileHeaderProps {
    profile: UserProfile;
    isCurrentUser: boolean;
}

export default function ProfileHeader({ profile, isCurrentUser }: ProfileHeaderProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
            <div className="flex items-start gap-6">
                {/* Аватар */}
                <div className="shrink-0 w-24 h-24 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center">
                    <User size={48} className="text-cyan-400" />
                </div>

                {/* Информация */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-1">{profile.userName}</h1>
                    <p className="text-gray-500 text-sm mb-4">
                        Member since {new Date(profile.createdAt).toLocaleDateString('en-US', {
                            month: 'long', year: 'numeric'
                        })}
                    </p>

                    {!isCurrentUser && (
                        <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
                            Follow
                        </button>
                    )}
                </div>

                {/* Статистика */}
                <div className="flex gap-3">
                    <StatCard label="Watched" value={profile.watchedCount} />
                    <StatCard label="Reviews" value={profile.reviewsCount} />
                    <StatCard label="Followers" value={profile.followersCount} />
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 min-w-24">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p className="text-cyan-400 text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
    );
}
