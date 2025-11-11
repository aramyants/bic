"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 320)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      type="button"
      aria-label="Вернуться наверх"
      onClick={handleClick}
      className={[
        "group fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full",
        "bg-brand-primary text-white shadow-strong transition-all duration-300",
        "hover:bg-brand-primary-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      ].join(" ")}
      style={{ cursor: "pointer" }}
    >
      <ChevronUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="sr-only">Наверх</span>
    </button>
  )
}
