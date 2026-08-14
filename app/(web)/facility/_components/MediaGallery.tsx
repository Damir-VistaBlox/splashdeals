"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

import { useState, useEffect, useRef, useCallback, type TouchEvent } from "react";
import Image from "next/image";
import type { FacilityMedia } from "@prisma/client";

import { Dict } from "@/lib/types";

interface MediaGalleryProps {
  media: FacilityMedia[];
  dict?: Dict;
}

// Minimum horizontal drag (px) before a touch gesture counts as a swipe.
const SWIPE_THRESHOLD = 45;

/**
 * 📷 MediaGallery Island (Client)
 * Handles full-screen previews and high-energy interactive masonry grid.
 */
export function MediaGallery({ media, dict }: MediaGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const galleryMedia = media.filter((m) => m.isGalleryVisible !== false);
  const galleryLength = galleryMedia.length;

  const showPrev = useCallback(() => {
    setSelectedIdx((idx) => (idx === null ? null : (idx - 1 + galleryLength) % galleryLength));
  }, [galleryLength]);

  const showNext = useCallback(() => {
    setSelectedIdx((idx) => (idx === null ? null : (idx + 1) % galleryLength));
  }, [galleryLength]);

  // Keyboard: Escape closes the lightbox, arrows navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPrev, showNext]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
      if (touchDeltaX.current > 0) showPrev();
      else showNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  if (!galleryMedia.length) return null;

  return (
    <section id="gallery" className="space-y-6 md:space-y-12">
      <div className="mx-auto max-w-2xl space-y-2.5 text-center md:space-y-4">
        <div className="text-primary flex items-center justify-center gap-3 text-xs font-extrabold tracking-widest uppercase">
          <Icon name="photo_camera" className="text-[16px]" />
          {dict?.media_gallery?.eyebrow || "Galerija"}
        </div>
        <h2 className="text-foreground md:text-primary-foreground text-3xl leading-none font-black tracking-tighter uppercase italic md:text-5xl">
          {(() => {
            const fullTitle = dict?.media_gallery?.title || "Doživite Atmosferu";
            const words = fullTitle.split(" ");
            if (words.length > 1) {
              return (
                <>
                  {words.slice(0, -1).join(" ")}{" "}
                  <span className="text-splash">{words[words.length - 1]}</span>
                </>
              );
            }
            return fullTitle;
          })()}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed font-medium md:text-base">
          {dict?.media_gallery?.description ||
            "Uronite u atmosferu naše destinacije kroz objektiv naših posetilaca."}
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl auto-rows-[160px] grid-cols-2 gap-2 sm:gap-4 md:auto-rows-[230px] md:grid-cols-4">
        {galleryMedia.map((m: FacilityMedia, i: number) => (
          <button
            key={m.id}
            onClick={() => setSelectedIdx(i)}
            className="group surface-subtle animate-fade-in-up relative overflow-hidden rounded-2xl md:rounded-[2.5rem]"
            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}
            aria-label={`${dict?.media_gallery?.expand_view} ${i + 1}`}
          >
            {m.type === "VIDEO" ? (
              <div className="relative h-full w-full">
                <video
                  src={m.url}
                  poster={m.thumbnailUrl || undefined}
                  muted
                  preload="none"
                  className="h-full w-full object-cover transition-[transform] duration-1000 group-hover:scale-110"
                />
                <div className="bg-background/20 absolute inset-0 flex items-center justify-center">
                  <Icon
                    name="play_arrow"
                    className="border-border/20 rounded-full border fill-white/20 p-3 text-[48px] text-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>
            ) : (
              <Image
                src={m.url}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="h-full w-full object-cover transition-[transform] duration-1000 group-hover:scale-110 group-hover:rotate-1"
                alt={
                  m.caption?.trim() ||
                  dict?.media_gallery?.fallback_caption ||
                  "Fotografija objekta"
                }
                loading="lazy"
              />
            )}
            <div className="from-background/92 absolute inset-0 flex flex-col justify-end bg-gradient-to-t via-transparent to-transparent p-3 opacity-100 transition-opacity duration-500 sm:p-8 sm:opacity-0 sm:group-hover:opacity-100">
              <div className="space-y-1 transition-transform duration-500 sm:translate-y-4 sm:space-y-2 sm:group-hover:translate-y-0">
                <p className="text-primary-foreground line-clamp-2 text-xs font-bold sm:text-lg">
                  {m.caption || dict?.media_gallery?.fallback_caption || "Letnji Užitak"}
                </p>
                <div className="text-primary hidden items-center gap-2 text-xs font-black tracking-widest uppercase sm:flex">
                  <Icon name="open_in_full" className="text-[16px]" />
                  {m.type === "VIDEO"
                    ? dict?.media_gallery?.play_video || "Pusti Video"
                    : dict?.media_gallery?.expand_view || "Prikaži Veće"}
                </div>
              </div>
              <div className="bg-muted/20 absolute top-6 right-6 hidden scale-75 rounded-full p-3 opacity-0 backdrop-blur-md transition-[transform,opacity] group-hover:scale-100 group-hover:opacity-100 sm:block">
                <Icon
                  name="favorite"
                  className="text-primary-foreground hover:text-destructive cursor-pointer text-[20px] transition-colors"
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 🎭 LIGHTBOX — swipeable on touch, arrow-navigable, close button anchored to the
          image card itself (not the viewport edge) so it's never occluded by the sticky
          site header on mobile. */}
      {selectedIdx !== null && (
        <button
          type="button"
          className="bg-background/95 animate-fade-in fixed inset-0 z-[2000] flex items-center justify-center p-3 backdrop-blur-2xl sm:p-4 md:p-20"
          onClick={() => setSelectedIdx(null)}
          aria-label={dict?.media_gallery?.close || "Zatvori galeriju"}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Position/count indicator */}
          {galleryLength > 1 && (
            <div
              className="bg-muted/30 text-primary-foreground pointer-events-none absolute top-4 left-1/2 z-[2010] -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[11px] font-black tracking-widest backdrop-blur-md sm:top-8"
              aria-live="polite"
            >
              {selectedIdx + 1} / {galleryLength}
            </div>
          )}

          <div
            className="border-border animate-scale-in bg-background relative aspect-video w-full max-w-6xl overflow-hidden rounded-[1.75rem] border shadow-2xl sm:rounded-[3rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close — anchored to the card, always reachable regardless of page chrome */}
            <Button
              variant="ghost"
              size="icon"
              className="border-border bg-muted/40 text-primary-foreground hover:bg-muted/60 absolute top-3 right-3 z-[2010] size-11 rounded-full border backdrop-blur-md"
              onClick={() => setSelectedIdx(null)}
              aria-label={dict?.media_gallery?.close || "Zatvori galeriju"}
            >
              <Icon name="close" className="text-[22px]" />
            </Button>

            {galleryMedia[selectedIdx].type === "VIDEO" ? (
              <video
                src={galleryMedia[selectedIdx].url}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            ) : (
              <Image
                src={galleryMedia[selectedIdx].url}
                fill
                sizes="100vw"
                className="h-full w-full object-contain"
                alt={galleryMedia[selectedIdx].caption || "Expanded view"}
              />
            )}
            {galleryMedia[selectedIdx].caption && (
              <div className="from-background/80 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-5 sm:p-8">
                <p className="text-primary-foreground text-lg font-black tracking-tighter uppercase italic sm:text-2xl">
                  {galleryMedia[selectedIdx].caption}
                </p>
              </div>
            )}
          </div>

          {/* Prev / Next — 44px+ targets, swipe also works on touch devices */}
          {galleryLength > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="border-border bg-muted/30 text-primary-foreground hover:bg-muted/50 absolute top-1/2 left-2 z-[2010] size-11 -translate-y-1/2 rounded-full border backdrop-blur-md sm:left-6"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label={dict?.media_gallery?.previous || "Prethodna fotografija"}
              >
                <Icon name="chevron_left" className="text-[26px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="border-border bg-muted/30 text-primary-foreground hover:bg-muted/50 absolute top-1/2 right-2 z-[2010] size-11 -translate-y-1/2 rounded-full border backdrop-blur-md sm:right-6"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label={dict?.media_gallery?.next || "Sledeća fotografija"}
              >
                <Icon name="chevron_right" className="text-[26px]" />
              </Button>
            </>
          )}
        </button>
      )}
    </section>
  );
}
