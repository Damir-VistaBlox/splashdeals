"use client"

import { Icon } from "@/components/ui/Icon";
/* eslint-disable @typescript-eslint/no-unused-vars */
 

import Image from "next/image"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { upload } from "@vercel/blob/client"
import { cn } from "@/lib/utils"
import { updateFacilityLogoAction } from "@/server/actions/governance"

interface FacilityLogoUploadProps {
  value?: string | null
  onChange: (value: string) => void
  facilityId: string
}

// 📐 HTML5 Canvas Client-Side Pre-processing for High-Fidelity preservation
// 📐 HTML5 Hardware-Native Client-Side Pre-processing for Extreme Fidelity
const optimizeLogoOnClient = async (file: File): Promise<Blob> => {
  let bitmap: ImageBitmap | null = null;
  try {
    // 🔥 HARVEST POWER: Decode image directly off-main-thread on hardware
    bitmap = await window.createImageBitmap(file)

    // 1️⃣ Stage A: Generate Temp Canvas for Visual Scoping
    const scanCanvas = window.document.createElement("canvas")
    const sctx = scanCanvas.getContext("2d", { willReadFrequently: true })
    
    // Limit scan dimensions to prevent locks on ultra-high res source files
    const scaleDown = bitmap.width > 1024 ? 1024 / bitmap.width : 1
    scanCanvas.width = bitmap.width * scaleDown
    scanCanvas.height = bitmap.height * scaleDown
    
    if (!sctx) {
      throw new Error("Scanning Context Creation Failed")
    }
    
    // Draw high-performance bitmap instantly (GPU path)
    sctx.drawImage(bitmap, 0, 0, scanCanvas.width, scanCanvas.height)
    const imageData = sctx.getImageData(0, 0, scanCanvas.width, scanCanvas.height).data
    
    // 2️⃣ Stage B: Bounding Box Scavenger (Identify minimum visual geometry)
    let minX = scanCanvas.width, minY = scanCanvas.height, maxX = 0, maxY = 0
    let hasContent = false

    // Stepping by 2 optimizes performance 4x with zero perceptible cost
    for (let y = 0; y < scanCanvas.height; y += 2) {
      for (let x = 0; x < scanCanvas.width; x += 2) {
        const alphaIndex = (y * scanCanvas.width + x) * 4 + 3
        if (imageData[alphaIndex] > 8) { // Ignore noise
           if (x < minX) minX = x
           if (x > maxX) maxX = x
           if (y < minY) minY = y
           if (y > maxY) maxY = y
           hasContent = true
        }
      }
    }

    // Map coordinate deltas back to raw source pixel grid
    const sourceX = hasContent ? (minX / scaleDown) : 0
    const sourceY = hasContent ? (minY / scaleDown) : 0
    const sourceW = hasContent ? ((maxX - minX + 1) / scaleDown) : bitmap.width
    const sourceH = hasContent ? ((maxY - minY + 1) / scaleDown) : bitmap.height

    // 3️⃣ Stage C: Final Rastering Pipeline
    const canvas = window.document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    
    canvas.width = 512
    canvas.height = 512
    
    if (!ctx) {
       throw new Error("Final rastering pipe failure")
    }
    
    ctx.clearRect(0, 0, 512, 512)

    // Maintain professional safe-bleed aesthetic boundaries
    const innerBoundary = 512 - 48 
    const visualAspectRatio = sourceW / sourceH
    
    let dWidth, dHeight
    if (visualAspectRatio > 1) {
      dWidth = innerBoundary
      dHeight = innerBoundary / visualAspectRatio
    } else {
      dHeight = innerBoundary
      dWidth = innerBoundary * visualAspectRatio
    }
    
    const dX = (512 - dWidth) / 2
    const dY = (512 - dHeight) / 2

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Execute dynamic extraction & fitting
    ctx.drawImage(bitmap, sourceX, sourceY, sourceW, sourceH, dX, dY, dWidth, dHeight)

    // Final step: re-encode to high-density modern WebP representation
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error("Re-encoding failure")),
        "image/webp",
        0.90
      )
    })
  } catch (err) {
    console.error("Hardware Raster Exception:", err)
    throw new Error("Device failure encountered during bitmap reconstruction.")
  } finally {
    // 🗑️ CRITICAL GARBAGE PURGE: Flush heavy bitmap memory from hardware store immediately
    if (bitmap) {
      bitmap.close()
    }
  }
}

/**
 * 🎨 FacilityLogoUpload Component
 * Direct-to-storage client-side optimized logo uploader.
 * Now supports Smart-Scaling & Drag-and-Drop.
 */
export function FacilityLogoUpload({ value, onChange, facilityId }: FacilityLogoUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [previewBg, setPreviewBg] = React.useState<"dark" | "light">("dark")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image.")
      return
    }

    setIsUploading(true)

    const uploadPromise = (async () => {
      const optimizedBlob = await optimizeLogoOnClient(file)
      const optimizedFile = new File(
        [optimizedBlob],
        `logo-main.webp`,
        { type: "image/webp" }
      )

      const filename = `facilities/${facilityId}/logos/${optimizedFile.name}`
      const blob = await upload(filename, optimizedFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({ facilityId, uploadType: "LOGO" }),
      })

      if (!blob.url) {
        throw new Error("Upload endpoint returned void URL")
      }

      const finalUrl = `${blob.url}?t=${Date.now()}`
      
      // 🔥 INSTANT PERSISTENCE: Write directly to Database immediately
      const dbResult = await updateFacilityLogoAction(facilityId, finalUrl)
      if (!dbResult.success) {
         throw new Error("Storage successful, but database alignment failed.")
      }

      // Update local React-Hook-Form state
      onChange(finalUrl)
      return finalUrl
    })()

    toast.promise(uploadPromise, {
      loading: "Repacking branding & shipping WebP payload...",
      success: "Logo successfully cached & deployed!",
      error: (err) => err.message || "Direct stream failure",
    })

    try {
      await uploadPromise
    } catch (err) {
      console.error("Logo workflow fatal:", err)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  // 🌌 Drag & Drop Event Listeners
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const removeImage = async () => {
    onChange("")
    // 🔥 Instant Cleanup: Ensure removals sync to database immediately
    await updateFacilityLogoAction(facilityId, "")
    toast.success("Asset purged from visual identity.")
  }

  return (
    <div 
      className="space-y-4 relative group/logo"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isUploading && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md animate-pulse" />
            <Icon name="progress_activity" className="text-[32px] animate-spin text-cyan-400 relative z-10" />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 animate-pulse">Rasterizing...</p>
        </div>
      )}

      {value ? (
        <div 
          className="relative group mx-auto h-32 w-32"
        >
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative h-full w-full rounded-2xl overflow-hidden border transition-all cursor-pointer flex items-center justify-center shadow-lg overflow-hidden",
              previewBg === "dark" ? "bg-slate-950/40 border-white/10 hover:border-cyan-500/40" : "bg-slate-200 border-slate-300 hover:border-cyan-600",
              isDragging && "border-cyan-400 bg-cyan-500/5 scale-105 border-dashed"
            )}
          >
          <Image 
            src={value} 
            alt="Facility Logo" 
            fill
            sizes="128px"
            className="object-contain p-3 drop-shadow-md transition-transform group-hover:scale-105 duration-300"
          />
          {!isUploading && (
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Icon name="upload" className="text-[20px] text-cyan-400 animate-bounce" />
              <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">Swap Logo</span>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage()
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 border border-rose-500/30 text-white transition-all scale-90 hover:scale-100"
                title="Remove asset"
              >
                <Icon name="close" className="text-[12px]" />
              </button>
            </div>
          )}
          </div>
          
          {/* 🌓 Contrast Mode Switcher */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setPreviewBg(p => p === "dark" ? "light" : "dark")
            }}
            className={cn(
              "absolute bottom-2 left-2 z-20 p-1 rounded-md backdrop-blur-md border transition-all shadow-sm",
              previewBg === "dark" 
                ? "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white" 
                : "bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900"
            )}
            title="Toggle Contrast Background"
          >
            {previewBg === "dark" ? <Icon name="light_mode" className="text-[10px]" /> : <Icon name="dark_mode" className="text-[10px]" />}
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative h-32 w-32 rounded-2xl border-2 border-dashed bg-slate-950/30 hover:bg-slate-950/60 transition-all duration-300 cursor-pointer mx-auto flex flex-col items-center justify-center text-center p-4 group/drop box-border",
            isDragging 
              ? "border-cyan-400 bg-cyan-500/10 scale-[1.02] shadow-[0_0_25px_rgba(6,182,212,0.15)]" 
              : "border-white/5 hover:border-cyan-500/30"
          )}
        >
          <div className={cn(
             "p-2.5 rounded-xl transition-all duration-300 mb-2",
             isDragging ? "bg-cyan-500/20 text-cyan-400 scale-110" : "bg-slate-900/50 text-slate-500 group-hover/drop:bg-cyan-500/10 group-hover/drop:text-cyan-400"
          )}>
             <Icon name="upload" className="text-[20px]" />
          </div>
          <span className={cn(
            "text-[9px] font-black uppercase tracking-widest transition-colors",
            isDragging ? "text-cyan-300" : "text-slate-400 group-hover/drop:text-slate-200"
          )}>
             {isDragging ? "Release File" : "Upload Logo"}
          </span>
          {!isDragging && (
            <span className="text-[7px] font-bold uppercase tracking-tighter text-slate-500 mt-1 opacity-60">Square WebP</span>
          )}
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onInputChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  )
}
