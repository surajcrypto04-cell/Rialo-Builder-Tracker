'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { PROJECT_CATEGORIES, TECH_STACK_OPTIONS } from '@/lib/constants';
import { Plus, Loader2, Github, Twitter, Globe, User, CheckCircle, AlertCircle, Search, Image, Code, Layers } from 'lucide-react';

interface AddParticipantFormProps {
  events: Event[];
  onSuccess: () => void;
}

export default function AddParticipantForm({ events, onSuccess }: AddParticipantFormProps) {
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubPreview, setGithubPreview] = useState<any>(null);
  const [githubError, setGithubError] = useState('');
  const [success, setSuccess] = useState(false);
  const [existingUser, setExistingUser] = useState<string | null>(null);

  const [eventId, setEventId] = useState('');
  const [discordId, setDiscordId] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [discordAvatarUrl, setDiscordAvatarUrl] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectOneLiner, setProjectOneLiner] = useState('');
  const [projectPitch, setProjectPitch] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectGithubLink, setProjectGithubLink] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [projectStatus, setProjectStatus] = useState('building');
  const [teamSize, setTeamSize] = useState('solo');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [galleryUrlsText, setGalleryUrlsText] = useState('');

  async function handleDiscordIdBlur() {
    if (discordId.trim()) {
      try {
        const { data } = await supabase
          .from('builder_profiles')
          .select('discord_username, discord_avatar_url, twitter_handle, github_username')
          .eq('discord_id', discordId.trim())
          .single();
        if (data) {
          setExistingUser(data.discord_username);
          setDiscordUsername(data.discord_username || '');
          if (data.discord_avatar_url) setDiscordAvatarUrl(data.discord_avatar_url);
          if (data.twitter_handle) setTwitterHandle(data.twitter_handle);
          if (data.github_username) {
            setGithubUsername(data.github_username);
            handleGithubLookup(data.github_username);
          }
        } else {
          setExistingUser(null);
        }
      } catch { setExistingUser(null); }
    }
  }

  async function handleGithubLookup(username?: string) {
    const name = username || githubUsername.trim();
    if (!name) return;
    setGithubLoading(true);
    setGithubError('');
    setGithubPreview(null);
    try {
      const res = await fetch(`/api/github/${name}`);
      if (res.ok) setGithubPreview(await res.json());
      else setGithubError('GitHub user not found');
    } catch { setGithubError('Error fetching GitHub profile'); }
    finally { setGithubLoading(false); }
  }

  function toggleTech(tech: string) {
    setTechStack((prev) => prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!eventId || !discordId || !discordUsername || !projectName || !projectOneLiner) {
      alert('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const pin = sessionStorage.getItem('admin_pin');

      const galleryUrls = galleryUrlsText
        ? galleryUrlsText.split(',').map(u => u.trim()).filter(u => u.length > 0)
        : [];

      const res = await fetch('/api/admin/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin || '',
        },
        body: JSON.stringify({
          event_id: eventId,
          discord_id: discordId,
          discord_username: discordUsername,
          discord_avatar_url: discordAvatarUrl,
          twitter_handle: twitterHandle,
          github_username: githubUsername,
          github_avatar_url: githubPreview?.user.avatar_url,
          github_bio: githubPreview?.user.bio,
          github_public_repos: githubPreview?.user.public_repos,
          github_followers: githubPreview?.user.followers,
          github_total_stars: githubPreview?.totalStars,
          github_top_languages: githubPreview?.languages,
          github_repos_data: githubPreview?.repos,
          github_created_at: githubPreview?.user.created_at,
          project_name: projectName,
          project_one_liner: projectOneLiner,
          project_pitch: projectPitch,
          project_link: projectLink,
          project_github_link: projectGithubLink,
          project_category: projectCategory,
          tech_stack: techStack,
          project_status: projectStatus,
          team_size: teamSize,
          project_screenshot_url: screenshotUrl,
          gallery_urls: galleryUrls,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
        // Reset form
        setEventId(''); setDiscordId(''); setDiscordUsername(''); setDiscordAvatarUrl('');
        setTwitterHandle(''); setGithubUsername(''); setProjectName(''); setProjectOneLiner('');
        setProjectPitch(''); setProjectLink(''); setProjectGithubLink(''); setProjectCategory('');
        setTechStack([]); setProjectStatus('building'); setTeamSize('solo'); setScreenshotUrl('');
        setGalleryUrlsText('');
        setGithubPreview(null); setExistingUser(null);
        onSuccess();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add participant');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding participant');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 500,
    color: 'var(--text-secondary)', marginBottom: '8px',
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Success Message */}
      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', borderRadius: '14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '24px' }}>
          <CheckCircle style={{ width: 18, height: 18, color: '#22c55e', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 500 }}>Participant added successfully!</span>
        </div>
      )}

      {/* SECTION 1: Select Event */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,140,0,0.1)' }}>
            <Layers style={{ width: 18, height: 18, color: 'var(--bh-accent)' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Select Event</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Required</span>
        </div>

        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
          style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}
        >
          <option value="" style={{ background: 'var(--bg-secondary)' }}>Choose an event...</option>
          {events.map((event) => (
            <option key={event.id} value={event.id} style={{ background: 'var(--bg-secondary)' }}>
              {event.title} ({event.voting_status})
            </option>
          ))}
        </select>

        {events.length === 0 && (
          <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px' }}>
            ⚠️ No events found. Create an event first in the &quot;Manage Events&quot; tab.
          </p>
        )}
      </div>

      {/* SECTION 2: Builder Information */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0,200,255,0.1)' }}>
            <User style={{ width: 18, height: 18, color: 'var(--st-accent)' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Builder Information</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Discord ID */}
          <div>
            <label style={labelStyle}>Discord ID *</label>
            <input
              type="text" value={discordId}
              onChange={(e) => { setDiscordId(e.target.value); setExistingUser(null); }}
              onBlur={handleDiscordIdBlur}
              placeholder="123456789012345678"
              required style={inputStyle}
            />
          </div>

          {/* Discord Username */}
          <div>
            <label style={labelStyle}>Discord Username *</label>
            <input
              type="text" value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              placeholder="username"
              required style={inputStyle}
            />
          </div>

          {/* Discord Avatar URL */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>
              <Image style={{ width: 12, height: 12, display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Discord Avatar URL
            </label>
            <input
              type="url" value={discordAvatarUrl}
              onChange={(e) => setDiscordAvatarUrl(e.target.value)}
              placeholder="https://cdn.discordapp.com/avatars/..."
              style={inputStyle}
            />
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              💡 Right-click their Discord profile picture → Copy Image Address
            </p>
          </div>

          {/* Twitter */}
          <div>
            <label style={labelStyle}>
              <Twitter style={{ width: 12, height: 12, display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Twitter Handle
            </label>
            <input
              type="text" value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="handle (without @)"
              style={inputStyle}
            />
          </div>

          {/* GitHub */}
          <div>
            <label style={labelStyle}>
              <Github style={{ width: 12, height: 12, display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              GitHub Username
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text" value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="username"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={() => handleGithubLookup()}
                disabled={githubLoading || !githubUsername.trim()}
                style={{
                  padding: '0 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
                  fontSize: '12px', fontWeight: 500, cursor: 'pointer', flexShrink: 0,
                  opacity: githubLoading || !githubUsername.trim() ? 0.4 : 1,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {githubLoading ? <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} /> : <Search style={{ width: 14, height: 14 }} />}
                Lookup
              </button>
            </div>
          </div>
        </div>

        {/* Existing User Notice */}
        {existingUser && (
          <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(0,200,255,0.05)', border: '1px solid rgba(0,200,255,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle style={{ width: 16, height: 16, color: 'var(--st-accent)', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: 'var(--st-accent)' }}>
              Existing builder found: <strong>{existingUser}</strong> — New project will be added to their profile
            </span>
          </div>
        )}

        {/* GitHub Preview */}
        {githubPreview && (
          <div style={{ marginTop: '16px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={githubPreview.user.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e', marginBottom: '2px' }}>
                  ✅ {githubPreview.user.name || githubPreview.user.login}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {githubPreview.allReposCount} repos • ⭐ {githubPreview.totalStars} stars • {githubPreview.user.followers} followers
                </div>
              </div>
            </div>
          </div>
        )}

        {githubError && (
          <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle style={{ width: 16, height: 16, color: '#ef4444', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#ef4444' }}>{githubError}</span>
          </div>
        )}
      </div>

      {/* SECTION 3: Project Information */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,215,0,0.1)' }}>
            <Globe style={{ width: 18, height: 18, color: 'var(--gold)' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Project Information</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Project Name */}
          <div>
            <label style={labelStyle}>Project Name *</label>
            <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My Awesome dApp" required style={inputStyle} />
          </div>

          {/* One-Liner */}
          <div>
            <label style={labelStyle}>One-Liner * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({projectOneLiner.length}/140)</span></label>
            <input type="text" value={projectOneLiner} onChange={(e) => setProjectOneLiner(e.target.value.slice(0, 140))} placeholder="A brief description in one line..." required maxLength={140} style={inputStyle} />
          </div>

          {/* Pitch */}
          <div>
            <label style={labelStyle}>Full Pitch <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({projectPitch.length}/500)</span></label>
            <textarea value={projectPitch} onChange={(e) => setProjectPitch(e.target.value.slice(0, 500))} rows={3} placeholder="What problem does this solve? Why should people care?" maxLength={500}
              style={{ ...inputStyle, resize: 'none' as const, lineHeight: 1.6 }} />
          </div>

          {/* Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Project Link</label>
              <input type="url" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} placeholder="https://myproject.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Project GitHub Repo</label>
              <input type="url" value={projectGithubLink} onChange={(e) => setProjectGithubLink(e.target.value)} placeholder="https://github.com/user/repo" style={inputStyle} />
            </div>
          </div>

          {/* Screenshot */}
          <div>
            <label style={labelStyle}>
              <Image style={{ width: 12, height: 12, display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Screenshot URL
            </label>
            <input type="url" value={screenshotUrl} onChange={(e) => setScreenshotUrl(e.target.value)} placeholder="https://i.imgur.com/example.png" style={inputStyle} />

            {/* Screenshot Preview */}
            {screenshotUrl && (
              <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', maxHeight: '200px' }}>
                <img src={screenshotUrl} alt="Preview" style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          {/* Gallery URLs */}
          <div>
            <label style={labelStyle}>
              <Image style={{ width: 12, height: 12, display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Gallery URLs <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma separated)</span>
            </label>
            <textarea
              value={galleryUrlsText}
              onChange={(e) => setGalleryUrlsText(e.target.value)}
              placeholder="https://img1.com, https://img2.com"
              rows={2}
              style={{ ...inputStyle, resize: 'none' as const, lineHeight: 1.6 }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}>
              <option value="" style={{ background: 'var(--bg-secondary)' }}>Select category...</option>
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: 'var(--bg-secondary)' }}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 4: Tech Stack & Details */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(167,139,250,0.1)' }}>
            <Code style={{ width: 18, height: 18, color: '#a78bfa' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Tech Stack & Details</h3>
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Tech Stack <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({techStack.length} selected)</span></label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TECH_STACK_OPTIONS.map((tech) => (
              <button
                key={tech} type="button" onClick={() => toggleTech(tech)}
                style={{
                  padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                  background: techStack.includes(tech) ? 'rgba(255,140,0,0.1)' : 'rgba(255,255,255,0.05)',
                  color: techStack.includes(tech) ? 'var(--bh-accent)' : 'var(--text-secondary)',
                  outline: techStack.includes(tech) ? '1px solid rgba(255,140,0,0.25)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {techStack.includes(tech) && '✓ '}{tech}
              </button>
            ))}
          </div>
        </div>

        {/* Status + Team */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Project Status</label>
            <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}>
              <option value="idea" style={{ background: 'var(--bg-secondary)' }}>💡 Idea</option>
              <option value="building" style={{ background: 'var(--bg-secondary)' }}>🔨 Building</option>
              <option value="live" style={{ background: 'var(--bg-secondary)' }}>🚀 Live</option>
              <option value="launched" style={{ background: 'var(--bg-secondary)' }}>🏆 Launched</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Team Size</label>
            <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}>
              <option value="solo" style={{ background: 'var(--bg-secondary)' }}>🧑 Solo</option>
              <option value="duo" style={{ background: 'var(--bg-secondary)' }}>👥 Duo</option>
              <option value="team" style={{ background: 'var(--bg-secondary)' }}>👥👥 Team</option>
            </select>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit" disabled={loading}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', padding: '16px', borderRadius: '16px', border: 'none',
          background: 'linear-gradient(135deg, var(--bh-accent), var(--bh-accent-light))',
          color: 'black', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
          opacity: loading ? 0.6 : 1, transition: 'all 0.3s',
          boxShadow: '0 8px 24px rgba(255,140,0,0.2)',
        }}
      >
        {loading ? <Loader2 className="animate-spin" style={{ width: 18, height: 18 }} /> : <Plus style={{ width: 18, height: 18 }} />}
        Add Participant
      </button>
    </form>
  );
}