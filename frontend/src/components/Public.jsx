import React from 'react'
import { Link } from 'react-router-dom'

const Public = () => {
   return (
      <section>
         <header>
            <h1>Notes Web App</h1>
         </header>
         <main>
            <h1>Meow World</h1>
         </main>
         <footer>
            <Link to="/login">Employee Login</Link>
         </footer>
      </section>
   )
}

export default Public