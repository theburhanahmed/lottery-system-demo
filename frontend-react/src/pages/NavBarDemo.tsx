import { Home, User, Briefcase, FileText } from 'lucide-react'
import { NavBar } from "../components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'About', url: '#', icon: User },
    { name: 'Projects', url: '#', icon: Briefcase },
    { name: 'Resume', url: '#', icon: FileText }
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Tube Light Navbar Demo</h1>
        <p className="text-slate-400">The navbar is fixed at the top (desktop) or bottom (mobile).</p>
      </div>
      <NavBar items={navItems} />
    </div>
  )
}
