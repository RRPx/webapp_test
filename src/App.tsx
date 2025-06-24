import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Timeline from './components/Timeline'
import CreateMurmur from './components/CreateMurmur'
import UserDetail from './components/UserDetail'
import UsersList from './components/UsersList'

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 flex gap-4">
        <Link to="/timeline">Timeline</Link>
        <Link to="/create">Create Murmur</Link>
        <Link to="/me">About me</Link>
        <Link to="/all-users">All Users</Link>
      </nav>
      <Routes>
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/create" element={<CreateMurmur />} />
        <Route path="/me" element={<UserDetail />} />
        <Route path="/user/:userId?" element={<UserDetail />} />
        <Route path="/all-users" element={<UsersList />} />
      </Routes>
    </Router>
  )
}
