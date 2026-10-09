import { Link } from "react-router-dom";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between text-slate-800">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xl shadow-md">
              🏛️
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              EGov<span className="text-red-600">.</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700">
            <Link to="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <div className="relative group cursor-pointer hover:text-red-600 transition-colors flex items-center gap-1">
              Pages ▾
            </div>
            <div className="relative group cursor-pointer hover:text-red-600 transition-colors flex items-center gap-1">
              Department ▾
            </div>
            <Link to="/events" className="hover:text-red-600 transition-colors">
              Event
            </Link>
            <Link to="/blog" className="hover:text-red-600 transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="hover:text-red-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button 
              aria-label="Search portal" 
              className="p-2 text-slate-500 hover:text-red-600 transition-colors"
            >
              🔍
            </button>

            {/* Language Selector */}
            <select className="bg-slate-100 border border-slate-200 text-xs font-semibold rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="en">Eng ▾</option>
              <option value="es">Esp</option>
              <option value="fr">Fra</option>
            </select>

            {/* Report an Issue Button */}
            <Link
              to="/report"
              className="hidden sm:inline-flex items-center px-4 py-2 border border-blue-900 text-xs font-bold uppercase tracking-wider text-blue-950 rounded hover:bg-blue-950 hover:text-white transition-all shadow-sm"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-grow">{children}</main>

      {/* Red Announcement Ribbon Banner */}
      <section className="bg-red-600 text-white py-4 px-4 text-center text-sm font-semibold shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <span>The official guide to living, working, visiting and investing in the city</span>
          <Link
            to="/explore"
            className="underline underline-offset-4 text-white font-bold hover:text-slate-100 transition-colors"
          >
            Let's explore more →
          </Link>
        </div>
      </section>

      {/* Dark Navy Stat Statistics Footer Bar */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          
          <div className="flex flex-col items-center">
            <div className="text-red-500 text-2xl mb-2">🏛️</div>
            <p className="text-3xl font-extrabold text-white">62K</p>
            <p className="text-xs text-slate-400 mt-1">Total People lives in our city</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-red-500 text-2xl mb-2">📍</div>
            <p className="text-3xl font-extrabold text-white">4.8K</p>
            <p className="text-xs text-slate-400 mt-1">Square kilometres region covers</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-red-500 text-2xl mb-2">📊</div>
            <p className="text-3xl font-extrabold text-white">32%</p>
            <p className="text-xs text-slate-400 mt-1">Private vs domestic gender fund</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-red-500 text-2xl mb-2">🏠</div>
            <p className="text-3xl font-extrabold text-white">6th</p>
            <p className="text-xs text-slate-400 mt-1">Average Costs of Home Ownership</p>
          </div>

        </div>

        {/* Copyright notice */}
        <div className="mt-10 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Local Government Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}