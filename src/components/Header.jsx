import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <Home size={28} />
          <h1 className="text-2xl font-bold">يومك بيدك</h1>
        </Link>
        <p className="text-sm text-purple-100">استثمره بحكمة</p>
      </div>
    </header>
  )
}

export default Header