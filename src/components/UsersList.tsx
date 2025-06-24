import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

interface User {
  id: number
  username: string
  followCount: number
  followedCount: number
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users')
        setUsers(res.data)
      } catch (err) {
        console.error('Failed to load users', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <div>Loading users...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      {users.map((user) => (
        <div key={user.id} className="border p-3 mb-2 rounded shadow-sm">
          <Link
            to={`/user/${user.id}`}
            className="text-lg text-blue-600 font-medium"
          >
            @{user.username}
          </Link>
        </div>
      ))}
    </div>
  )
}
