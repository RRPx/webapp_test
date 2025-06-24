// src/pages/CreateMurmur.tsx
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function CreateMurmur() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const userId = 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    try {
      setLoading(true)
      await axios.post('http://localhost:3001/api/murmurs', {
        text,
        userId,
      })
      navigate('/timeline')
    } catch (err) {
      console.error('Failed to create murmur', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Murmur</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border rounded p-2 mb-3"
          rows={4}
          maxLength={280}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Murmur'}
        </button>
      </form>
    </div>
  )
}
