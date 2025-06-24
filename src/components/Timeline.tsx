// src/pages/Timeline.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Murmur {
  id: number
  text: string
  createdAt: string
  likedBy: { id: number }[]
  user: { id: number; username: string }
}

const MURMURS_PER_PAGE = 10

export default function Timeline() {
  const [murmurs, setMurmurs] = useState<Murmur[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const userId = 1 // hardcoded for now (no auth)

  const fetchTimeline = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/users/${userId}/timeline`,
      )
      setMurmurs(res.data)
    } catch (err) {
      console.error('Failed to load timeline', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (murmurId: number) => {
    try {
      await axios.post(`http://localhost:3001/api/likes`, {
        userId,
        murmurId,
      })
      fetchTimeline()
    } catch (err) {
      console.error('Failed to like murmur', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this murmur?')) return
    try {
      await axios.delete(`http://localhost:3001/api/murmurs/${id}`, {
        data: { userId },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setMurmurs((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      console.error('Failed to delete murmur', err)
    }
  }

  useEffect(() => {
    fetchTimeline()
  }, [])

  if (loading) return <div>Loading...</div>

  // Pagination logic
  const startIndex = (currentPage - 1) * MURMURS_PER_PAGE
  const currentMurmurs = murmurs.slice(
    startIndex,
    startIndex + MURMURS_PER_PAGE,
  )
  const totalPages = Math.ceil(murmurs.length / MURMURS_PER_PAGE)
  console.log(murmurs)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Timeline</h1>
      {currentMurmurs.map((murmur) => (
        <div key={murmur.id} className="border p-3 mb-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">
            @{murmur.user.username} •{' '}
            {new Date(murmur.createdAt).toLocaleString()}
          </div>
          <p className="my-2 text-base">{murmur.text}</p>
          <button
            className="text-blue-600 text-sm mr-4"
            onClick={() => handleLike(murmur.id)}
          >
            ❤️ Like ({murmur.likedBy.length})
          </button>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
