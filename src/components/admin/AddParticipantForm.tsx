'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { PROJECT_CATEGORIES, TECH_STACK_OPTIONS } from '@/lib/constants';
import {
  Plus,
  Loader2,
  Github,
  Twitter,
  Globe,
  User,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

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

  // Form fields
  const [eventId, setEventId] = useState('');
  const [discordId, setDiscordId] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
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
  const [discordAvatarUrl, setDiscordAvatarUrl] = useState('');

  // Fetch GitHub preview
  async function handleGithubLookup() {
    if (!githubUsername.trim()) return;

    setGithubLoading(true);
    setGithubError('');
    setGithubPreview(null);

    try {
      const res = await fetch(`/api/github/${githubUsername.trim()}`);

      if (res.ok) {
        const data = await res.json();
        setGithubPreview(data);
      } else {
        setGithubError('GitHub user not found');
      }
    } catch {
      setGithubError('Error fetching GitHub profile');
    } finally {
      setGithubLoading(false);
    }
  }

  function handleTechStackToggle(tech: string) {
    setTechStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!eventId || !discordId || !discordUsername || !projectName || !projectOneLiner) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          discord_id: discordId.trim(),
          discord_username: discordUsername.trim(),
          discord_avatar_url: discordAvatarUrl.trim(),
          twitter_handle: twitterHandle.trim(),
          github_username: githubUsername.trim(),
          project_name: projectName.trim(),
          project_one_liner: projectOneLiner.trim(),
          project_pitch: projectPitch.trim(),
          project_link: projectLink.trim(),
          project_github_link: projectGithubLink.trim(),
          project_category: projectCategory,
          tech_stack: techStack,
          project_status: projectStatus,
          team_size: teamSize,
          project_screenshot_url: screenshotUrl.trim(),
          // GitHub data from preview
          github_data: githubPreview || null,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);

        // Reset form
        setDiscordId('');
        setDiscordUsername('');
        setTwitterHandle('');
        setGithubUsername('');
        setProjectName('');
        setProjectOneLiner('');
        setProjectPitch('');
        setProjectLink('');
        setProjectGithubLink('');
        setProjectCategory('');
        setTechStack([]);
        setProjectStatus('building');
        setTeamSize('solo');
        setScreenshotUrl('');
        setDiscordAvatarUrl('');
        setGithubPreview(null);

        onSuccess();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add participant');
      }
    } catch {
      alert('Error adding participant');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
      <h3 className="text-lg font-bold mb-6">Add New Participant</h3>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
          <CheckCircle className="w-4 h-4" />
          Participant added successfully!
        </div>
      )}

      {/* Event Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Select Event *
        </label>
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors appearance-none cursor-pointer"
        >
          <option value="" className="bg-[var(--bg-secondary)]">
            Choose an event...
          </option>
          {events.map((event) => (
            <option key={event.id} value={event.id} className="bg-[var(--bg-secondary)]">
              {event.title} ({event.voting_status})
            </option>
          ))}
        </select>
      </div>

      {/* Builder Info */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <User className="w-4 h-4" />
          Builder Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Discord ID *
            </label>
            <input
              type="text"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="123456789012345678"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Discord Avatar URL (paste from Discord profile)
            </label>
            <input
              type="url"
              value={discordAvatarUrl}
              onChange={(e) => setDiscordAvatarUrl(e.target.value)}
              placeholder="https://cdn.discordapp.com/avatars/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
            />
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">
              Right-click their Discord profile picture → Copy Image Address
            </p>
          </div>

          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Discord Username *
            </label>
            <input
              type="text"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              placeholder="username"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              <Twitter className="w-3 h-3 inline mr-1" />
              Twitter Handle
            </label>
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="@handle (without @)"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              <Github className="w-3 h-3 inline mr-1" />
              GitHub Username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="username"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
              />
              <button
                type="button"
                onClick={handleGithubLookup}
                disabled={githubLoading || !githubUsername.trim()}
                className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 text-sm"
              >
                {githubLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Lookup'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* GitHub Preview */}
        {githubPreview && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <img
                src={githubPreview.user.avatar_url}
                alt={githubPreview.user.login}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-sm font-medium text-green-400">
                  ✅ {githubPreview.user.name || githubPreview.user.login}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {githubPreview.allReposCount} repos • ⭐{' '}
                  {githubPreview.totalStars} stars •{' '}
                  {githubPreview.user.followers} followers
                </div>
              </div>
            </div>
          </div>
        )}

        {githubError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" />
            {githubError}
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Project Information
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Project Name *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome dApp"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              One-Liner * ({projectOneLiner.length}/140)
            </label>
            <input
              type="text"
              value={projectOneLiner}
              onChange={(e) => setProjectOneLiner(e.target.value.slice(0, 140))}
              placeholder="A brief description in one line..."
              required
              maxLength={140}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Full Pitch ({projectPitch.length}/500)
            </label>
            <textarea
              value={projectPitch}
              onChange={(e) => setProjectPitch(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="What problem does this solve? Why should people care?"
              maxLength={500}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Project Link
              </label>
              <input
                type="url"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                placeholder="https://myproject.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Project GitHub Repo
              </label>
              <input
                type="url"
                value={projectGithubLink}
                onChange={(e) => setProjectGithubLink(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Screenshot URL (paste image URL)
            </label>
            <input
              type="url"
              value={screenshotUrl}
              onChange={(e) => setScreenshotUrl(e.target.value)}
              placeholder="https://i.imgur.com/example.png"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Category
            </label>
            <select
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="" className="bg-[var(--bg-secondary)]">
                Select category...
              </option>
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[var(--bg-secondary)]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-2">
              Tech Stack (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK_OPTIONS.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechStackToggle(tech)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    techStack.includes(tech)
                      ? 'bg-[var(--bh-accent)]/10 text-[var(--bh-accent)] border border-[var(--bh-accent)]/30'
                      : 'bg-white/5 text-[var(--text-secondary)] border border-white/5 hover:bg-white/10'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Status + Team Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Project Status
              </label>
              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="idea" className="bg-[var(--bg-secondary)]">💡 Idea</option>
                <option value="building" className="bg-[var(--bg-secondary)]">🔨 Building</option>
                <option value="live" className="bg-[var(--bg-secondary)]">🚀 Live</option>
                <option value="launched" className="bg-[var(--bg-secondary)]">🏆 Launched</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Team Size
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="solo" className="bg-[var(--bg-secondary)]">🧑 Solo</option>
                <option value="duo" className="bg-[var(--bg-secondary)]">👥 Duo</option>
                <option value="team" className="bg-[var(--bg-secondary)]">👥👥 Team</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--bh-accent)] to-[var(--bh-accent-light)] text-black font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Add Participant
      </button>
    </form>
  );
}