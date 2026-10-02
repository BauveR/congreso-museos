import { useRef } from 'react'
import type { CarouselItem } from '../../../content/types'
import { imageUrl } from '../../../services/imagekit'

interface CarouselCardProps {
  item: CarouselItem
  /** Reproducir el video al hover (solo puntero fino y sin reduced motion). */
  playVideo: boolean
}

export function CarouselCard({ item, playVideo }: CarouselCardProps) {
  const video = useRef<HTMLVideoElement>(null)
  const withVideo = playVideo && Boolean(item.video)

  const play = () => void video.current?.play().catch(() => {})
  const stop = () => {
    const v = video.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <figure
      className="group w-56 shrink-0 sm:w-64"
      onMouseEnter={withVideo ? play : undefined}
      onMouseLeave={withVideo ? stop : undefined}
    >
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-superficie">
        <img
          src={imageUrl(item.image.src)}
          alt={item.image.alt}
          width={item.image.width}
          height={item.image.height}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
        {withVideo && (
          <video
            ref={video}
            src={item.video}
            poster={imageUrl(item.image.src)}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
      </div>
      <figcaption className="mt-3">
        <span className="block font-semibold">{item.name}</span>
        <span className="block text-sm text-texto-suave">{item.role}</span>
      </figcaption>
    </figure>
  )
}
