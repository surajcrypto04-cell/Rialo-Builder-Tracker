'use client';

import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import { X, ChevronLeft, ChevronRight, Github, ExternalLink, Star, Image, Shield } from 'lucide-react';
import { CATEGORY_COLORS } from '@/lib/constants';

interface ProjectModalProps {
    participant: Participant | null;
    isOpen: boolean;
    onClose: () => void;
}

import { createPortal } from 'react-dom';

export default function ProjectModal({ participant, isOpen, onClose }: ProjectModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Reset image on open
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [participant]);

    if (!isOpen || !participant || !mounted) return null;

    // Collect all images: Main screenshot + Gallery
    const images = [];
    if (participant.project_screenshot_url) images.push(participant.project_screenshot_url);
    if (participant.gallery_urls && participant.gallery_urls.length > 0) {
        images.push(...participant.gallery_urls);
    }

    // Deduplicate just in case
    const uniqueImages = Array.from(new Set(images));

    const hasMultipleImages = uniqueImages.length > 1;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % uniqueImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
    };

    const categoryColor = participant.project_category ? CATEGORY_COLORS[participant.project_category] || '#888' : '#888';

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
            style={{
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                animation: 'fadeInUp 0.3s ease-out'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="w-full max-w-5xl bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-light)] shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                style={{ animation: 'scaleIn 0.3s ease-out' }}
            >
                {/* Close Button Mobile */}
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                    <X size={20} />
                </button>

                {/* LEFT: Image Gallery (60% width on desktop) */}
                <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center bg-[#050505] overflow-hidden">
                    {uniqueImages.length > 0 ? (
                        <div className="relative w-full h-[300px] md:h-full min-h-[300px] md:min-h-[500px] flex items-center justify-center">
                            {/* Background Blur Effect */}
                            <div
                                className="absolute inset-0 opacity-20 blur-2xl transform scale-110"
                                style={{
                                    backgroundImage: `url(${uniqueImages[currentImageIndex]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />

                            <img
                                src={uniqueImages[currentImageIndex]}
                                alt={participant.project_name}
                                className="relative w-full h-full max-h-[80vh] object-contain z-10"
                            />

                            {/* Navigation Arrows */}
                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all backdrop-blur-sm border border-white/10 z-20 group"
                                    >
                                        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all backdrop-blur-sm border border-white/10 z-20 group"
                                    >
                                        <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>

                                    {/* Dots */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                        {uniqueImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50 w-2'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] gap-4">
                            <div className="p-4 rounded-full bg-white/5">
                                <Image size={32} className="opacity-50" />
                            </div>
                            <span className="text-sm">No images available</span>
                        </div>
                    )}
                </div>

                {/* RIGHT: Details (40% width) */}
                <div className="w-full md:w-2/5 p-8 md:p-10 overflow-y-auto max-h-[50vh] md:max-h-full bg-[var(--bg-secondary)] relative">
                    {/* Close Button Desktop */}
                    <button
                        onClick={onClose}
                        className="hidden md:block absolute top-6 right-6 text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Header */}
                    <div className="mb-6 pr-8">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {participant.project_category && (
                                <span
                                    className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                                    style={{
                                        background: `${categoryColor}15`,
                                        color: categoryColor,
                                        border: `1px solid ${categoryColor}30`
                                    }}
                                >
                                    {participant.project_category}
                                </span>
                            )}
                            {participant.is_winner && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 flex items-center gap-1">
                                    <span className="text-sm">🏆</span> Winner
                                </span>
                            )}
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white leading-tight">
                            {participant.project_name}
                        </h2>
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                            <span>By</span>
                            <img
                                src={participant.discord_avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${participant.discord_id}`}
                                className="w-5 h-5 rounded-full"
                                alt="Avatar"
                            />
                            <span className="font-medium text-[var(--text-primary)]">{participant.discord_username}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">The Pitch</h3>
                            <p className="text-[var(--text-primary)] leading-relaxed text-sm md:text-base">
                                {participant.project_pitch || participant.project_one_liner || "No detailed pitch provided."}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {participant.tech_stack.map((tech) => (
                                    <span key={tech} className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                            <div className="text-center">
                                <div className="text-xl font-bold text-white">{participant.vote_count}</div>
                                <div className="text-[10px] text-[var(--text-muted)] uppercase">Votes</div>
                            </div>
                            {participant.github_username && (
                                <div className="text-center border-l border-[var(--border-subtle)]">
                                    <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                                        {participant.github_total_stars} <Star size={12} className="text-[var(--gold)]" />
                                    </div>
                                    <div className="text-[10px] text-[var(--text-muted)] uppercase">Stars</div>
                                </div>
                            )}
                            <div className="text-center border-l border-[var(--border-subtle)]">
                                <div className="text-xl font-bold text-white capitalize">{participant.team_size}</div>
                                <div className="text-[10px] text-[var(--text-muted)] uppercase">Team</div>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="pt-6 flex flex-col gap-4">
                            {participant.project_link && (
                                <a
                                    href={participant.project_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                                >
                                    <ExternalLink size={18} /> Visit Project
                                </a>
                            )}
                            {participant.project_github_link && (
                                <a
                                    href={participant.project_github_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] text-white hover:bg-[var(--border-light)] transition-colors"
                                >
                                    <Github size={18} /> View Source
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
