import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Comment, Post } from '../types'
import { timeAgo } from '../lib/time'
import CyberButton from './CyberButton'
import { CommentIcon, HeartIcon, RepostIcon } from './Icons'

const actionClasses =
  'flex items-center gap-2 text-xs text-text-muted transition-colors duration-200'

type Props = {
  post: Post
  comments: Comment[]
  isCommentOpen: boolean
  onLike: (id: string) => void
  onToggleComments: (id: string) => void
  onAddComment: (id: string, content: string) => void
  onRepost: (id: string) => void
  onProfileClick?: (userId: string) => void
}

import { memo } from 'react'

export const PostCard = memo(function PostCard({
  post,
  comments,
  isCommentOpen,
  onLike,
  onToggleComments,
  onAddComment,
  onRepost,
  onProfileClick
}: Props) {
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!isCommentOpen) setDraft('')
  }, [isCommentOpen])

  const submitComment = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onAddComment(post.id, trimmed)
    setDraft('')
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="glass-panel p-5 relative overflow-hidden"
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onProfileClick?.(post.userId)}
          className="h-12 w-12 border border-border bg-surface flex items-center justify-center text-sm font-bold text-text"
        >
          {post.avatar}
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              onClick={() => onProfileClick?.(post.userId)}
              className="font-semibold text-text hover:text-primary"
            >
              {post.username}
            </button>
            <button
              onClick={() => onProfileClick?.(post.userId)}
              className="text-primary/80 hover:text-primary"
            >
              {post.handle}
            </button>
            <span className="text-xs text-text-muted">{timeAgo(post.timestamp)}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text">{post.content}</p>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className={`${actionClasses} ${post.liked ? 'text-primary' : 'hover:text-primary'}`}
              onClick={() => onLike(post.id)}
            >
              <HeartIcon />
              {post.likes.length}
            </motion.button>
            <button
              className={`${actionClasses} hover:text-primary`}
              onClick={() => onToggleComments(post.id)}
            >
              <CommentIcon />
              {post.comments}
            </button>
            <button
              className={`${actionClasses} ${post.reposted ? 'text-primary' : 'hover:text-primary'}`}
              onClick={() => onRepost(post.id)}
            >
              <RepostIcon />
              {post.reposts.length}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {isCommentOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-3 overflow-hidden border border-border bg-surface-elevated p-4"
              >
                <div className="text-xs uppercase tracking-[0.3em] text-text-muted">Comments</div>
                <div className="space-y-3">
                  {comments.length === 0 && (
                    <div className="text-xs text-text-muted">No comments yet.</div>
                  )}
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-8 w-8 border border-border bg-surface text-text flex items-center justify-center text-xs font-semibold">
                        {comment.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-text">{comment.username}</span>
                          <span className="text-primary">{comment.handle}</span>
                          <span className="text-text-muted">{timeAgo(comment.timestamp)}</span>
                        </div>
                        <p className="mt-1 text-sm text-text">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length > 0 && comments.length < post.comments && (
                    <div className="text-xs text-text-muted">
                      Showing latest {comments.length} of {post.comments} comments.
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write a comment..."
                    maxLength={180}
                    className="flex-1 min-w-[180px] border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                  />
                  <CyberButton size="sm" variant="accent" onClick={submitComment}>
                    Send
                  </CyberButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
})

export default PostCard
