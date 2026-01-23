import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "../../utils/cn"
import { Link, useLocation } from "react-router-dom"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const currentItem = items.find(item => location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url)))
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [location.pathname, items])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 mb-6 px-4 w-full sm:w-auto",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-white/80 dark:bg-black/80 backdrop-blur-lg py-1 px-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-slate-600 dark:text-slate-400 hover:text-brand-gold-600 dark:hover:text-brand-gold-400",
                isActive && "text-brand-gold-600 dark:text-brand-gold-400",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-brand-gold-100/50 dark:bg-brand-gold-900/30 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-gold-600 rounded-t-full shadow-[0_-1px_10px_rgba(212,175,55,0.6)]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-6 bg-brand-gold-600/20 blur-md rounded-full" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-6 bg-brand-gold-600/20 blur-md rounded-full" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-gold-600/20 blur-sm rounded-full" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
