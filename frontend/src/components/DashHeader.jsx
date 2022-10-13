import React from 'react'
import { Link } from "react-router-dom";

const DashHeader = () => {
  const content = (
      <header className="dash-header">
         <div className="dash-header__container">
            <Link to="/dash/notes">
               <h1 className="dash-header">Notes</h1>
            </Link>
            <nav className="dash-header__nav">
               {/* nav buttons here */}
            </nav>
         </div>
      </header>
  )
  return content
}

export default DashHeader