import React from 'react'
import { Link } from 'react-router-dom'

const RootLayout: React.FC = () => {
  return (
    <div>
      RootLayout
      <Link to='/dashboard/maindashboard'>Dashboard</Link>
    </div>
  )
}

export default RootLayout
