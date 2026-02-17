'use client';

import { BuilderProfile, Participant } from '@/types';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { BADGES, LANGUAGE_COLORS } from '@/lib/constants';
import { Github, Twitter, ExternalLink, Star, GitFork, Users, Calendar, Trophy, ArrowDown, Code } from 'lucide-react';
import Link from 'next/link';

interface ProfileClientProps {
  profile: BuilderProfile;
  participations: (Participant & { event?: any })[];
}

export default function ProfileClient({ profile, participations }: ProfileClientProps) {
  const latestWithGithub = participations.find((p) => p.github_username);
  const githubData = latestWithGithub ? {
    avatar: latestWithGithub.github_avatar_url,
    bio: latestWithGithub.github_bio,
    repos: latestWithGithub.github_public_repos,
    followers: latestWithGithub.github_followers,
    stars: latestWithGithub.github_total_stars,
    languages: latestWithGithub.github_top_languages || [],
    reposData: latestWithGithub.github_repos_data || [],
    createdAt: latestWithGithub.github_created_at,
  } : null;

  return (
    <div style={{ minHeight: '100vh' }}>
      <ProfileHero profile={profile} githubData={githubData} />
      {githubData && <GitHubStats githubData={githubData} />}
      {githubData && githubData.reposData.length > 0 && <Repos repos={githubData.reposData} username={profile.github_username || ''} />}
      {participations.length > 0 && <Journey participations={participations} />}
      <BadgesGrid earnedBadges={profile.badges || []} />
    </div>
  );
}

/* ============ HERO ============ */
function ProfileHero({ profile, githubData }: { profile: BuilderProfile; githubData: any }) {
  return (
    <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '25%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'var(--bh-accent)', opacity: 0.02, filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', bottom: '25%', right: '30%', width: 400, height: 400, borderRadius: '50%', background: 'var(--st-accent)', opacity: 0.02, filter: 'blur(100px)' }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '600px', width: '100%' }}>
        <div style={{ marginBottom: '24px' }} className="animate-fade-in-up">
          <img
            src={profile.discord_avatar_url || githubData?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.discord_id}`}
            alt={profile.discord_username}
            style={{ width: 120, height: 120, borderRadius: '20px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)', margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            className="animate-float"
          />
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, marginBottom: '12px' }} className="animate-fade-in-up">
          {profile.discord_username}
        </h1>

        {githubData?.bio && (
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6, fontStyle: 'italic' }} className="animate-fade-in-up">
            &ldquo;{githubData.bio}&rdquo;
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }} className="animate-fade-in-up">
          {profile.github_username && (
            <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: 'var(--text-secondary)', transition: 'all 0.3s' }}>
              <Github style={{ width: 16, height: 16 }} /> {profile.github_username}
            </a>
          )}
          {profile.twitter_handle && (
            <a href={`https://twitter.com/${profile.twitter_handle}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: 'var(--text-secondary)', transition: 'all 0.3s' }}>
              <Twitter style={{ width: 16, height: 16 }} /> @{profile.twitter_handle}
            </a>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }} className="animate-fade-in-up">
          <Pill icon={<Trophy style={{ width: 14, height: 14, color: 'var(--gold)' }} />} text={`${profile.total_wins || 0} Wins`} />
          <Pill icon={<Code style={{ width: 14, height: 14, color: 'var(--bh-accent)' }} />} text={`${profile.total_participations || 0} Projects`} />
          {githubData?.createdAt && (
            <Pill icon={<Calendar style={{ width: 14, height: 14, color: 'var(--st-accent)' }} />} text={`Since ${new Date(githubData.createdAt).getFullYear()}`} />
          )}
        </div>
      </div>
    </section>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'var(--text-secondary)' }}>
      {icon} {text}
    </div>
  );
}

/* ============ GITHUB STATS ============ */
function GitHubStats({ githubData }: { githubData: any }) {
  const { ref, isInView } = useInView(0.2);
  const repoCount = useCountUp(githubData.repos || 0, 1500, isInView);
  const starCount = useCountUp(githubData.stars || 0, 1500, isInView);
  const followerCount = useCountUp(githubData.followers || 0, 1500, isInView);

  return (
    <section ref={ref} style={{ padding: '64px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          <Github style={{ width: 24, height: 24, display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          GitHub Stats
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '40px' }}>
          Open source contributions and activity
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          <StatBox value={repoCount} label="Repositories" icon={<Code style={{ width: 20, height: 20, color: 'var(--bh-accent)' }} />} />
          <StatBox value={starCount} label="Stars Earned" icon={<Star style={{ width: 20, height: 20, color: 'var(--gold)' }} />} />
          <StatBox value={followerCount} label="Followers" icon={<Users style={{ width: 20, height: 20, color: 'var(--st-accent)' }} />} />
        </div>

        {githubData.languages && githubData.languages.length > 0 && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>Languages Used</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {githubData.languages.map((lang: any, i: number) => (
                <div key={lang.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: lang.color || '#888' }} />
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{lang.name}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lang.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: isInView ? `${lang.percentage}%` : '0%', backgroundColor: lang.color || '#888', transition: `width 1s ease-out ${0.3 + i * 0.1}s` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatBox({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

/* ============ REPOS ============ */
function Repos({ repos, username }: { repos: any[]; username: string }) {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} style={{ padding: '64px 24px', background: 'rgba(255,255,255,0.005)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Featured Repositories</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '40px' }}>Top open source projects</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {repos.slice(0, 6).map((repo: any) => (
            <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: '20px', display: 'block', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--st-accent)' }}>📂 {repo.name}</h3>
                <ExternalLink style={{ width: 14, height: 14, color: 'var(--text-secondary)', flexShrink: 0, opacity: 0.5 }} />
              </div>
              {repo.description && (
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }} className="line-clamp-2">{repo.description}</p>
              )}
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star style={{ width: 12, height: 12, color: 'var(--gold)' }} />{repo.stargazers_count}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitFork style={{ width: 12, height: 12 }} />{repo.forks_count}</span>
                {repo.language && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: LANGUAGE_COLORS[repo.language] || '#888' }} />
                    {repo.language}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>

        {username && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a href={`https://github.com/${username}?tab=repositories`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Github style={{ width: 16, height: 16 }} /> View all repositories
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============ JOURNEY ============ */
function Journey({ participations }: { participations: (Participant & { event?: any })[] }) {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} style={{ padding: '64px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Builder Journey</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '40px' }}>Every project, every vote, every milestone</p>

        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, var(--bh-accent) 0%, var(--st-accent) 100%)', opacity: 0.15 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {participations.map((p) => {
              const isBH = p.event?.event_type === 'builders_hub';
              return (
                <div key={p.id} style={{ paddingLeft: '56px', position: 'relative' }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: '12px', top: '12px', width: '18px', height: '18px', borderRadius: '50%',
                    border: `2px solid ${p.is_winner ? 'var(--gold)' : isBH ? 'var(--bh-accent)' : 'var(--st-accent)'}`,
                    background: p.is_winner ? 'var(--gold)' : `${isBH ? 'rgba(255,140,0,0.2)' : 'rgba(0,200,255,0.2)'}`,
                  }} />

                  <div className={isBH ? 'glass-card-bh' : 'glass-card-st'} style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500, background: isBH ? 'rgba(255,140,0,0.1)' : 'rgba(0,200,255,0.1)', color: isBH ? 'var(--bh-accent)' : 'var(--st-accent)' }}>
                        {isBH ? "🏗️ Builder's Hub" : '🦈 Shark Tank'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Week {p.event?.week_number || '?'}</span>
                      {p.is_winner && (
                        <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500, background: 'rgba(255,215,0,0.1)', color: 'var(--gold)' }}>Winner 🏆</span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: isBH ? 'var(--bh-accent)' : 'var(--st-accent)', marginBottom: '4px' }}>{p.project_name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>{p.project_one_liner}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                      {p.project_category && (
                        <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{p.project_category}</span>
                      )}
                      {p.tech_stack.slice(0, 3).map((tech) => (
                        <span key={tech} style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{tech}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>🗳️ {p.vote_count} vote{p.vote_count !== 1 ? 's' : ''}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {p.project_link && <a href={p.project_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}><ExternalLink style={{ width: 14, height: 14 }} /></a>}
                        {p.project_github_link && <a href={p.project_github_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}><Github style={{ width: 14, height: 14 }} /></a>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ BADGES ============ */
function BadgesGrid({ earnedBadges }: { earnedBadges: string[] }) {
  const { ref, isInView } = useInView(0.2);
  const allBadgeKeys = Object.keys(BADGES) as (keyof typeof BADGES)[];
  const earnedCount = earnedBadges.length;
  const totalCount = allBadgeKeys.length;
  const progressPercent = Math.round((earnedCount / totalCount) * 100);

  return (
    <section ref={ref} style={{ padding: '64px 24px', background: 'rgba(255,255,255,0.005)' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Badges & Achievements</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          {earnedCount} of {totalCount} badges unlocked
        </p>

        <div style={{ maxWidth: '250px', margin: '0 auto 40px' }}>
          <div className="progress-bar">
            <div className="progress-bar-fill progress-bar-fill-gold" style={{ width: isInView ? `${progressPercent}%` : '0%', transition: 'width 1.5s ease-out 0.3s' }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>{progressPercent}% Complete</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {allBadgeKeys.map((key) => {
            const badge = BADGES[key];
            const isEarned = earnedBadges.includes(key);
            return (
              <div key={key} style={{ textAlign: 'center' }} title={isEarned ? `${badge.name}: ${badge.description}` : `🔒 ${badge.requirement}`}>
                <div
                  className={isEarned ? 'glass-card badge-earned' : 'badge-locked'}
                  style={{ width: '60px', height: '60px', margin: '0 auto 8px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', background: isEarned ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isEarned ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}` }}
                >
                  {isEarned ? badge.icon : '🔒'}
                </div>
                <div style={{ fontSize: '10px', color: isEarned ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {isEarned ? badge.name : '???'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}