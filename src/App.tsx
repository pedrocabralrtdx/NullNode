import { useCallback, useMemo, useState } from 'react'
import CyberBackground from './components/CyberBackground'
import CyberButton from './components/CyberButton'
import Sidebar from './components/Sidebar'
import RightSidebar from './components/RightSidebar'
import Composer from './components/Composer'
import PostCard from './components/PostCard'
import NetworkMap3D from './components/NetworkMap3D'
import TerminalPanel from './components/TerminalPanel'
import ProfileCard from './components/ProfileCard'
import NotificationCard from './components/NotificationCard'
import SearchPanel from './components/SearchPanel'
import AuthPanel from './components/AuthPanel'
import LoadingOverlay from './components/LoadingOverlay'
import { ViewKey } from './types'
import { trends as seedTrends } from './data/seed'
import { useStore } from './contexts/StoreContext'
import { useAuth } from './hooks/useAuth'
import { usePosts } from './hooks/usePosts'

export default function App() {
  const { users, currentUser, notifications, isBooting, setIsBooting } = useStore()
  const { posts, commentsByPost, handleCreatePost, handleLike, handleRepost, handleAddComment } = usePosts()
  const { handleAuth, handleFollow } = useAuth()

  const [activeView, setActiveView] = useState<ViewKey>('home')
  const [feedMode, setFeedMode] = useState<'following' | 'global'>('following')
  const [selectedProfileId, setSelectedProfileId] = useState<string>(currentUser?.id || 'u1')
  const [composer, setComposer] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)

  const feedPosts = useMemo(() => {
    if (feedMode === 'global') return posts
    const followSet = new Set(currentUser?.followingIds || [])
    return posts.filter((post) => post.userId === currentUser?.id || followSet.has(post.userId))
  }, [feedMode, posts, currentUser])

  const selectedProfile = useMemo(() => {
    return users.find((user) => user.id === selectedProfileId) ?? currentUser
  }, [users, selectedProfileId, currentUser])

  const handleToggleComments = (id: string) => {
    setActiveCommentPostId((prev) => (prev === id ? null : id))
  }

  const handleNavigate = (view: ViewKey) => {
    setActiveView(view)
    if (view === 'profile') {
      setSelectedProfileId(currentUser?.id || 'u1')
    }
  }

  const handleOpenProfile = useCallback((userId: string) => {
    setSelectedProfileId(userId)
    setActiveView('profile')
  }, [])

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users
    const query = searchQuery.toLowerCase()
    return users.filter((user) =>
      [user.username, user.handle, user.bio].some((field) => field.toLowerCase().includes(query))
    )
  }, [searchQuery, users])

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts.slice(0, 6)
    const query = searchQuery.toLowerCase()
    return posts.filter((post) => post.content.toLowerCase().includes(query))
  }, [searchQuery, posts])

  const profilePosts = useMemo(() => {
    if (!selectedProfile?.id) return []
    return posts.filter((post) => post.userId === selectedProfile.id)
  }, [posts, selectedProfile])

  const onSubmitPost = () => {
    handleCreatePost(composer)
    setComposer('')
  }

  if (!currentUser) return null

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-[#030712]">
      <CyberBackground />
      {isBooting && <LoadingOverlay onFinish={() => setIsBooting(false)} />}
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr_280px]">
          <Sidebar active={activeView} onSelect={handleNavigate} />

          <main className="space-y-6">
            {activeView === 'home' && (
              <>
                <Composer value={composer} onChange={setComposer} onSubmit={onSubmitPost} />
                <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Timeline Feed</h2>
                    <p className="text-xs text-white/60">
                      {feedMode === 'global' ? 'Global stream' : 'Following stream'} · Text-only
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <CyberButton
                      size="sm"
                      variant={feedMode === 'following' ? 'primary' : 'ghost'}
                      onClick={() => setFeedMode('following')}
                    >
                      Following
                    </CyberButton>
                    <CyberButton
                      size="sm"
                      variant={feedMode === 'global' ? 'primary' : 'ghost'}
                      onClick={() => setFeedMode('global')}
                    >
                      Global
                    </CyberButton>
                  </div>
                </div>
                <div className="space-y-4">
                  {feedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      comments={commentsByPost[post.id] ?? []}
                      isCommentOpen={activeCommentPostId === post.id}
                      onLike={handleLike}
                      onToggleComments={handleToggleComments}
                      onAddComment={handleAddComment}
                      onRepost={handleRepost}
                      onProfileClick={handleOpenProfile}
                    />
                  ))}
                </div>
              </>
            )}

            {activeView === 'explore' && (
              <SearchPanel
                query={searchQuery}
                onQueryChange={setSearchQuery}
                userResults={filteredUsers}
                postResults={filteredPosts}
                commentsByPost={commentsByPost}
                activeCommentPostId={activeCommentPostId}
                trends={seedTrends}
                onLike={handleLike}
                onToggleComments={handleToggleComments}
                onAddComment={handleAddComment}
                onRepost={handleRepost}
                onProfileSelect={handleOpenProfile}
              />
            )}

            {activeView === 'network' && (
              <div className="space-y-6">
                <div className="glass-panel p-5">
                  <h2 className="text-lg font-semibold">City Grid</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Each user is bound to a node on the grid. Click a node to inspect.
                  </p>
                </div>
                <NetworkMap3D users={users} currentUserId={currentUser.id} onSelectUser={handleOpenProfile} />
              </div>
            )}

            {activeView === 'terminal' && (
              <TerminalPanel
                users={users}
                currentUser={currentUser}
                postsCount={posts.length}
                onOpenProfile={handleOpenProfile}
              />
            )}

            {activeView === 'notifications' && (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}

            {activeView === 'profile' && selectedProfile && (
              <div className="space-y-6">
                <ProfileCard
                  user={selectedProfile}
                  postsCount={profilePosts.length}
                  isCurrentUser={selectedProfile.id === currentUser.id}
                  onFollow={handleFollow}
                />
                <div className="glass-panel p-5">
                  <h3 className="font-semibold text-white">User Posts</h3>
                  <div className="mt-4 space-y-4">
                    {profilePosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        comments={commentsByPost[post.id] ?? []}
                        isCommentOpen={activeCommentPostId === post.id}
                        onLike={handleLike}
                        onToggleComments={handleToggleComments}
                        onAddComment={handleAddComment}
                        onRepost={handleRepost}
                        onProfileClick={handleOpenProfile}
                      />
                    ))}
                    {profilePosts.length === 0 && (
                      <div className="border border-white/15 bg-black/70 p-4 text-sm text-white/60">
                        No posts yet for this profile.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>

          <div className="space-y-6">
            <AuthPanel onAuth={handleAuth} />
            <RightSidebar
              trends={seedTrends.slice(0, 4)}
              users={users
                .filter(
                  (user) => user.id !== currentUser.id && !currentUser.followingIds.includes(user.id)
                )
                .slice(0, 3)}
              onFollow={handleFollow}
              onProfileSelect={handleOpenProfile}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
