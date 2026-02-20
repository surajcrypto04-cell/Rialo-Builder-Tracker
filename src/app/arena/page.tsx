'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Participant } from '@/types';
import { fetchParticipantsWithProfiles } from '@/lib/helpers';
import { Swords, Trophy, Github, Users, Star, Zap, ArrowRight, BarChart3, TrendingUp, Monitor } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ArenaPage() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [leftId, setLeftId] = useState<string>('');
    const [rightId, setRightId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch ALL participants from recent events
                const { data: events } = await supabase.from('events').select('id').order('created_at', { ascending: false }).limit(5);
                if (!events) return;

                const allParts: Participant[] = [];
                for (const ev of events) {
                    const p = await fetchParticipantsWithProfiles(ev.id);
                    allParts.push(...p);
                }
                setParticipants(allParts);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        loadData();
    }, []);

    const left = participants.find(p => p.id === leftId);
    const right = participants.find(p => p.id === rightId);

    const StatRow = ({ label, leftVal, rightVal, icon, highlightLeft, highlightRight }: { label: string, leftVal: React.ReactNode, rightVal: React.ReactNode, icon?: React.ReactNode, highlightLeft?: boolean, highlightRight?: boolean }) => (
        <div className="grid grid-cols-3 gap-4 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/5 transition-colors px-6">
            <div className={`text-right font-mono text-sm sm:text-base break-words ${highlightLeft ? 'text-green-400 font-bold' : 'text-gray-400'}`}>{leftVal || '-'}</div>
            <div className="text-center text-[10px] sm:text-xs uppercase text-gray-500 font-bold flex flex-col items-center gap-1">
                {icon} <span className="opacity-70">{label}</span>
            </div>
            <div className={`text-left font-mono text-sm sm:text-base break-words ${highlightRight ? 'text-green-400 font-bold' : 'text-gray-400'}`}>{rightVal || '-'}</div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden bg-[#0A0A0F]">
            {/* Background FX */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-orange-500/5 blur-[120px]" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6 animate-fade-in-down">
                        <Swords className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest text-red-500 uppercase">Head-to-Head Analysis</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-scale-in drop-shadow-2xl text-white">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">ARENA</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fade-in-up leading-relaxed">
                        Select two heavyweights. Compare their stats, tech stacks, and community support in real-time.
                    </p>
                </div>

                {/* VS Controls */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-start mb-12">
                    {/* Left Selector */}
                    <div className="flex flex-col gap-6 animate-slide-in-left">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
                            <div className="relative bg-[#0f0f13] rounded-xl p-1">
                                <select
                                    className="w-full bg-transparent border-none p-4 text-sm font-medium text-white focus:outline-none cursor-pointer text-center appearance-none"
                                    value={leftId}
                                    onChange={(e) => setLeftId(e.target.value)}
                                >
                                    <option value="" className="bg-[#0f0f13] text-gray-400">Select Challenger 1</option>
                                    {participants.map(p => <option key={p.id} value={p.id} className="bg-[#0f0f13] text-white">{p.project_name}</option>)}
                                </select>
                            </div>
                        </div>

                        {left ? (
                            <div className="bg-[#0f0f13] rounded-2xl overflow-hidden border border-white/5 shadow-2xl group transition-all hover:scale-[1.02] duration-500">
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-transparent z-10" />
                                    <img
                                        src={left.project_screenshot_url || left.discord_avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${left.id}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={left.project_name}
                                    />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <h3 className="text-3xl font-black text-white mb-1 drop-shadow-md tracking-tight">{left.project_name}</h3>
                                        <p className="text-sm text-orange-400 font-mono font-medium tracking-wide">@{left.discord_username}</p>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-white/5">
                                    <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{left.project_pitch || left.project_one_liner}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-white/5">
                                <Users className="w-8 h-8 text-white/20 mb-2" />
                                <span className="text-white/30 text-sm font-medium">Waiting for selection...</span>
                            </div>
                        )}
                    </div>

                    {/* VS Badge */}
                    <div className="flex justify-center py-8 md:py-0 self-center relative z-20">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 bg-red-600 blur-[50px] opacity-40 animate-pulse" />
                            <div className="w-20 h-20 rounded-full bg-[#0A0A0F] border-4 border-red-500/50 flex items-center justify-center shadow-2xl shadow-red-500/20 transform hover:scale-110 transition-transform duration-300">
                                <span className="font-black text-3xl italic text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-purple-600 pr-1">VS</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Selector */}
                    <div className="flex flex-col gap-6 animate-slide-in-right">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
                            <div className="relative bg-[#0f0f13] rounded-xl p-1">
                                <select
                                    className="w-full bg-transparent border-none p-4 text-sm font-medium text-white focus:outline-none cursor-pointer text-center appearance-none"
                                    value={rightId}
                                    onChange={(e) => setRightId(e.target.value)}
                                >
                                    <option value="" className="bg-[#0f0f13] text-gray-400">Select Challenger 2</option>
                                    {participants.map(p => <option key={p.id} value={p.id} className="bg-[#0f0f13] text-white">{p.project_name}</option>)}
                                </select>
                            </div>
                        </div>

                        {right ? (
                            <div className="bg-[#0f0f13] rounded-2xl overflow-hidden border border-white/5 shadow-2xl group transition-all hover:scale-[1.02] duration-500">
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-transparent z-10" />
                                    <img
                                        src={right.project_screenshot_url || right.discord_avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${right.id}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={right.project_name}
                                    />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <h3 className="text-3xl font-black text-white mb-1 drop-shadow-md tracking-tight">{right.project_name}</h3>
                                        <p className="text-sm text-blue-400 font-mono font-medium tracking-wide">@{right.discord_username}</p>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-white/5">
                                    <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{right.project_pitch || right.project_one_liner}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-white/5">
                                <Users className="w-8 h-8 text-white/20 mb-2" />
                                <span className="text-white/30 text-sm font-medium">Waiting for selection...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comparison Table */}
                {left && right ? (
                    <div className="bg-[#0f0f13] rounded-2xl overflow-hidden animate-fade-in-up border border-white/5 shadow-2xl">
                        <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 flex items-center gap-2">
                                <BarChart3 size={14} /> Metric Analysis
                            </div>
                        </div>
                        <div className="divide-y divide-white/5">
                            <StatRow
                                label="Total Votes"
                                icon={<Zap size={14} className="text-yellow-500" />}
                                leftVal={<span className="text-xl">{left.vote_count}</span>}
                                rightVal={<span className="text-xl">{right.vote_count}</span>}
                                highlightLeft={left.vote_count > right.vote_count}
                                highlightRight={right.vote_count > left.vote_count}
                            />
                            <StatRow
                                label="Category"
                                icon={<Trophy size={14} className="text-orange-500" />}
                                leftVal={left.project_category}
                                rightVal={right.project_category}
                            />
                            <StatRow
                                label="Team Size"
                                icon={<Users size={14} className="text-blue-500" />}
                                leftVal={<span className="capitalize">{left.team_size}</span>}
                                rightVal={<span className="capitalize">{right.team_size}</span>}
                            />
                            <StatRow
                                label="Tech Stack"
                                icon={<Monitor size={14} className="text-purple-500" />}
                                leftVal={<div className="flex flex-wrap justify-end gap-1.5">{left.tech_stack.slice(0, 3).map(t => <span key={t} className="text-[10px] px-2 py-1 bg-white/5 rounded-md border border-white/5 text-gray-300">{t}</span>)}</div>}
                                rightVal={<div className="flex flex-wrap justify-start gap-1.5">{right.tech_stack.slice(0, 3).map(t => <span key={t} className="text-[10px] px-2 py-1 bg-white/5 rounded-md border border-white/5 text-gray-300">{t}</span>)}</div>}
                            />
                            {left.github_username && right.github_username && (
                                <>
                                    <StatRow
                                        label="GitHub Stars"
                                        icon={<Star size={14} className="text-yellow-400" />}
                                        leftVal={left.github_total_stars}
                                        rightVal={right.github_total_stars}
                                        highlightLeft={left.github_total_stars > right.github_total_stars}
                                        highlightRight={right.github_total_stars > left.github_total_stars}
                                    />
                                    <StatRow
                                        label="Followers"
                                        icon={<Github size={14} />}
                                        leftVal={left.github_followers}
                                        rightVal={right.github_followers}
                                        highlightLeft={left.github_followers > right.github_followers}
                                        highlightRight={right.github_followers > left.github_followers}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 text-gray-600 flex flex-col items-center animate-pulse">
                        <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm font-medium tracking-wide uppercase">Select two projects to begin analysis</p>
                    </div>
                )}
            </div>
        </div>
    );
}
