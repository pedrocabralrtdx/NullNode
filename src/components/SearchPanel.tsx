import type { Comment, Post, Trend, User } from '../types'
import { SearchIcon } from './Icons'
import PostCard from './PostCard'

type Props = {
  query: string
  onQueryChange: (value: string) => void
  userResults: User[]
  postResults: Post[]
  commentsByPost: Record<string, Comment[]>
  activeCommentPostId: string | null
  trends: Trend[]
  onLike?: (id: string) => void
  onToggleComments?: (id: string) => void
  onAddComment?: (id: string, content: string) => void
  onRepost?: (id: string) => void
  onProfileSelect?: (userId: string) => void
}

export default function SearchPanel({
  query,
  onQueryChange,
  userResults,
  postResults,
  commentsByPost,
  activeCommentPostId,
  trends,
  onLike,
  onToggleComments,
  onAddComment,
  onRepost,
  onProfileSelect
}: Props) {
  const handlers = {
    onLike: onLike ?? (() => {}),
    onToggleComments: onToggleComments ?? (() => {}),
    onAddComment: onAddComment ?? (() => {}),
    onRepost: onRepost ?? (() => {}),
    onProfileClick: onProfileSelect
  }
  return (
    <div className="space-y-6">
      <div className="glass-panel p-5">
        <div className="flex items-center gap-3">
          <SearchIcon className="text-neon-green" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search users, posts, or trends"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white">Trending Topics</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {trends.map((trend) => (
            <div key={trend.id} className="border border-white/15 bg-black/70 p-3">
              <div className="text-sm text-neon-green">{trend.topic}</div>
              <div className="text-xs text-white/60">{trend.mentions}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white">User Results</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {userResults.map((user) => (
            <button
              key={user.id}
              onClick={() => onProfileSelect?.(user.id)}
              className="border border-white/15 bg-black/70 p-3 text-left hover:border-neon-green/60"
            >
              <div className="text-sm text-white">{user.username}</div>
              <div className="text-xs text-neon-green">{user.handle}</div>
              <p className="mt-2 text-xs text-white/60">{user.bio}</p>
            </button>
          ))}
          {userResults.length === 0 && (
            <div className="text-sm text-white/60">No matching users yet.</div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {postResults.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            comments={commentsByPost[post.id] ?? []}
            isCommentOpen={activeCommentPostId === post.id}
            {...handlers}
          />
        ))}
        {postResults.length === 0 && (
          <div className="glass-panel p-5 text-sm text-white/60">
            No posts matched your search. Try a trending topic.
          </div>
        )}
      </div>
    </div>
  )
}
