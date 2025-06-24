import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

interface Murmur {
  id: number
  text: string
  createdAt: string
  likedBy: { id: number }[]
}

interface User {
  id: number
  username: string
  followers: { id: number; username: string; name: string; createdAt: Date }[]
  following: { id: number; username: string; name: string; createdAt: Date }[]
}

export default function UserDetail() {
  const { userId: paramUserId } = useParams<{ userId?: string }>()
  const userId = paramUserId ? parseInt(paramUserId, 10) : 1

  const [user, setUser] = useState<User | null>(null)
  const [murmurs, setMurmurs] = useState<Murmur[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/users/${userId}`)
      setUser(res.data)
    } catch (err) {
      console.error('Failed to fetch user info', err)
    }
  }

  const fetchUserMurmurs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/murmurs/user/${userId}`,
      )
      setMurmurs(res.data)
    } catch (err) {
      console.error('Failed to fetch murmurs', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this murmur?')) return
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
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchUserInfo(), fetchUserMurmurs()])
      setLoading(false)
    }
    loadData()
  }, [userId])

  console.log(user)

  if (loading) return <div>Loading...</div>
  if (!user) return <div>User not found.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Username: @{user.username}</h1>
      <div className="text-gray-600 mb-4">
        <p>Followers: {user.followers?.length}</p>
        <p>Following: {user.following?.length}</p>
      </div>

      <h2 className="text-xl font-semibold mb-3">Your Murmurs</h2>
      {murmurs.length === 0 && <p>No murmurs yet.</p>}
      {murmurs.map((murmur) => (
        <div key={murmur.id} className="border p-3 mb-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">
            {new Date(murmur.createdAt).toLocaleString()}
          </div>
          <p className="my-2">{murmur.text}</p>
          <button
            onClick={() => handleDelete(murmur.id)}
            className="text-red-500 text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
