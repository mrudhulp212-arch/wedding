import { useEffect } from 'react'

export default function useScrollDepth() {
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = matchMedia('(hover: hover) and (pointer: fine)')
    const hero = document.querySelector('.hero')
    const sections = [...document.querySelectorAll('.intro, .date-band, .rsvp')]
    const cards = [...document.querySelectorAll('.schedule-item')]
    let frame = 0
    const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value))
    const update = () => {
      frame = 0
      if (motion.matches) return
      if (hero) {
        const bounds = hero.getBoundingClientRect()
        if (bounds.bottom > 0 && bounds.top < innerHeight) {
          const progress = Math.max(0, Math.min(1, -bounds.top / bounds.height))
          hero.style.setProperty('--hero-depth', `${progress * 55}px`)
          hero.style.setProperty('--hero-turn', `${progress * -4}deg`)
        }
      }
      sections.forEach(section => {
        const bounds = section.getBoundingClientRect()
        if (bounds.bottom < 0 || bounds.top > innerHeight) return
        const progress = clamp((innerHeight / 2 - bounds.top - bounds.height / 2) / innerHeight, 1)
        section.style.setProperty('--depth-drift', `${progress * 24}px`)
        section.style.setProperty('--depth-turn', `${progress * 3}deg`)
      })
    }
    const request = () => {
      if (!frame && !motion.matches) frame = requestAnimationFrame(update)
    }
    const resetCard = card => {
      card.style.removeProperty('--tilt-x')
      card.style.removeProperty('--tilt-y')
    }
    const bindings = cards.map(card => {
      const move = event => {
        if (motion.matches || !pointer.matches) return
        const bounds = card.getBoundingClientRect()
        card.style.setProperty('--tilt-x', `${clamp((0.5 - (event.clientY - bounds.top) / bounds.height) * 6, 3)}deg`)
        card.style.setProperty('--tilt-y', `${clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 6, 3)}deg`)
      }
      const leave = () => resetCard(card)
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerleave', leave)
      return () => {
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerleave', leave)
        resetCard(card)
      }
    })
    const clear = () => {
      hero?.style.removeProperty('--hero-depth')
      hero?.style.removeProperty('--hero-turn')
      sections.forEach(section => {
        section.style.removeProperty('--depth-drift')
        section.style.removeProperty('--depth-turn')
      })
      cards.forEach(resetCard)
    }
    const preferenceChanged = () => { clear(); request() }
    addEventListener('scroll', request, { passive: true })
    addEventListener('resize', request)
    motion.addEventListener('change', preferenceChanged)
    pointer.addEventListener('change', preferenceChanged)
    request()
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', request)
      removeEventListener('resize', request)
      motion.removeEventListener('change', preferenceChanged)
      pointer.removeEventListener('change', preferenceChanged)
      bindings.forEach(dispose => dispose())
      clear()
    }
  }, [])
}
