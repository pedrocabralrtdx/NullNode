import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { nanoid } from 'nanoid'
import type { User } from '../types'

type Line = {
  id: string
  type: 'input' | 'output'
  text: string
  className?: string
}

type Props = {
  users: User[]
  currentUser: User
  postsCount: number
  onOpenProfile: (userId: string) => void
}

const initialLines: Line[] = [
  {
    id: 'l1',
    type: 'output',
    text: 'NULLNODE TERMINAL v2.0.0',
    className: 'typing'
  },
  {
    id: 'l2',
    type: 'output',
    text: 'Type `help` to list available commands.'
  }
]

const commandList = ['help', 'show_users', 'open_profile', 'whoami', 'status', 'clear']

export default function TerminalPanel({ users, currentUser, postsCount, onOpenProfile }: Props) {
  const [lines, setLines] = useState<Line[]>(initialLines)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!outputRef.current) return
    outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [lines])

  const appendLines = (entries: Line[]) => {
    setLines((prev) => [...prev, ...entries].slice(-140))
  }

  const runCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const [command, ...args] = trimmed.split(' ')
    const outputs: Line[] = []

    switch (command.toLowerCase()) {
      case 'help':
        outputs.push(
          {
            id: nanoid(),
            type: 'output',
            text: 'help              -> list commands'
          },
          {
            id: nanoid(),
            type: 'output',
            text: 'clear             -> reset terminal'
          },
          {
            id: nanoid(),
            type: 'output',
            text: 'show_users        -> list visible users'
          },
          {
            id: nanoid(),
            type: 'output',
            text: 'open_profile @id  -> open user profile'
          },
          {
            id: nanoid(),
            type: 'output',
            text: 'whoami            -> show current user'
          },
          {
            id: nanoid(),
            type: 'output',
            text: 'status            -> system status'
          }
        )
        break
      case 'clear':
        setLines(initialLines)
        return
      case 'show_users':
        outputs.push({
          id: nanoid(),
          type: 'output',
          text:
            users.length === 0
              ? 'No users loaded.'
              : users.map((user) => `${user.handle} - ${user.username}`).join(' | ')
        })
        break
      case 'open_profile': {
        const target = args.join(' ').trim()
        if (!target) {
          outputs.push({
            id: nanoid(),
            type: 'output',
            text: 'Usage: open_profile @handle'
          })
          break
        }
        const user = users.find(
          (item) => item.handle.toLowerCase() === target.toLowerCase() || item.username.toLowerCase() === target.toLowerCase()
        )
        if (!user) {
          outputs.push({
            id: nanoid(),
            type: 'output',
            text: `No profile found for ${target}.`
          })
          break
        }
        outputs.push({
          id: nanoid(),
          type: 'output',
          text: `Opening profile: ${user.handle}`
        })
        onOpenProfile(user.id)
        break
      }
      case 'whoami':
        outputs.push({
          id: nanoid(),
          type: 'output',
          text: `${currentUser.handle} - ${currentUser.username}`
        })
        break
      case 'status':
        outputs.push({
          id: nanoid(),
          type: 'output',
          text: `Users: ${users.length} | Posts: ${postsCount} | Sync: ONLINE`
        })
        break
      default:
        outputs.push({
          id: nanoid(),
          type: 'output',
          text: `Unknown command: ${command}`
        })
        break
    }

    appendLines([{ id: nanoid(), type: 'input', text: `> ${trimmed}` }, ...outputs])
  }

  const handleSubmit = () => {
    if (!input.trim()) return
    runCommand(input)
    setHistory((prev) => [input, ...prev])
    setHistoryIndex(null)
    setInput('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault()
      setLines(initialLines)
      setHistoryIndex(null)
      setInput('')
      return
    }
    if (event.key === 'Enter') {
      handleSubmit()
    }
    if (event.key === 'Tab') {
      event.preventDefault()
      const trimmed = input.trim().toLowerCase()
      const match = commandList.find((cmd) => cmd.startsWith(trimmed))
      if (match) {
        setInput(match === 'open_profile' ? `${match} ` : match)
      }
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const nextIndex = historyIndex === null ? 0 : Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex] ?? '')
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex === null) return
      const nextIndex = historyIndex - 1
      if (nextIndex < 0) {
        setHistoryIndex(null)
        setInput('')
      } else {
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex] ?? '')
      }
    }
  }

  return (
    <div className="glass-panel p-6 font-tech panel-sheen">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-white">// NullNode Terminal</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/50">Session 7A</div>
        </div>
        <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.3em] text-white/60">
          <span>Users {users.length}</span>
          <span>Posts {postsCount}</span>
          <span>Sync Online</span>
        </div>
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
        Commands: help • show_users • open_profile @handle • whoami • status • clear
      </div>

      <div
        ref={outputRef}
        onClick={() => inputRef.current?.focus()}
        className="mt-4 max-h-[280px] cursor-text overflow-y-auto border border-white/20 bg-black p-4 text-xs"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={[
              line.type === 'input' ? 'text-white' : 'text-neon-green/90',
              line.className ?? ''
            ].join(' ')}
          >
            {line.text}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 border border-white/20 bg-black p-2 text-xs text-neon-green">
        <span>&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command"
          className="flex-1 bg-transparent text-neon-green placeholder:text-neon-green/40 focus:outline-none"
        />
        <span className="h-4 w-2 bg-neon-green animate-pulse" aria-hidden />
      </div>

    </div>
  )
}
