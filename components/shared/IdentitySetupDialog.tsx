"use client"
import { Icon } from "@/components/ui/Icon";

import * as React from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LiquidButton } from "@/components/ui/LiquidButton"
import { toast } from "sonner"

interface IdentitySetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requiresIdentity: boolean
  requiresPhoto: boolean
  onComplete: (data: { holderName?: string; holderPhotoUrl?: string }) => void
}

export function IdentitySetupDialog({
  open,
  onOpenChange,
  requiresIdentity,
  requiresPhoto,
  onComplete,
}: IdentitySetupDialogProps) {
  const [step, setStep] = React.useState<"name" | "photo" | "review">(requiresIdentity ? "name" : "photo")
  const [name, setName] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  // Reset state when closing
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(requiresIdentity ? "name" : "photo")
        setName("")
        setFile(null)
        setPreview(null)
      }, 300)
    }
  }, [open, requiresIdentity])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleNext = () => {
    if (step === "name") {
      if (!name.trim()) {
        toast.error("Please enter your full name.")
        return
      }
      if (requiresPhoto) setStep("photo")
      else setStep("review")
    } else if (step === "photo") {
      if (!file) {
        toast.error("Please attach a photo for your seasonal pass.")
        return
      }
      setStep("review")
    }
  }

  const handleSubmit = async () => {
    setIsUploading(true)
    let photoUrl = ""

    try {
      if (file) {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          body: file,
        })
        const blob = await response.json()
        if (!response.ok) throw new Error("Upload failed")
        photoUrl = blob.url
      }

      onComplete({
        holderName: name || undefined,
        holderPhotoUrl: photoUrl || undefined,
      })
    } catch (error) {
      toast.error("Error saving data. Please try again.")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 p-0 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] opacity-50" />
        
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Icon name="person" className="text-[20px]" />
              </span>
              Pass Setup
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Seasonal passes are personalized and non-transferable.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-6">
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label 
                  htmlFor="holder-name"
                  className="text-sm font-bold uppercase tracking-widest text-zinc-500"
                >
                  Holder&apos;s Full Name
                </label>
                <Input
                  id="holder-name"
                  className="h-14 bg-zinc-900 border-white/10 rounded-2xl text-lg focus:ring-[var(--color-primary)]"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  aria-describedby="name-desc"
                />
                <p id="name-desc" className="text-xs text-zinc-500 italic">
                  This name will be printed on your seasonal pass.
                </p>
              </div>

              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center">
                <label 
                  htmlFor="photo-upload"
                  className="text-sm font-bold uppercase tracking-widest text-zinc-500 block text-left"
                >
                  Identification Photo
                </label>
                
                <div 
                  className="relative group cursor-pointer aspect-square max-w-[200px] mx-auto rounded-3xl overflow-hidden border-2 border-dashed border-white/10 hover:border-[var(--color-primary)]/50 transition-all flex flex-col items-center justify-center bg-zinc-900 shadow-2xl"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                  role="button"
                  aria-label="Click to open camera or upload image"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && document.getElementById("photo-upload")?.click()}
                >
                  {preview ? (
                    <Image 
                      src={preview} 
                      alt="Preview of your photo" 
                      fill 
                      sizes="200px"
                      className="object-cover" 
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-zinc-500 group-hover:text-white transition-colors">
                      <Icon name="photo_camera" className="text-[40px] mb-1" />
                      <span className="text-xs font-bold uppercase tracking-tighter">Click to take a photo</span>
                    </div>
                  )}
                  {preview && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Icon name="upload" className="text-[32px] text-white" />
                    </div>
                  )}
                </div>

                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={handleFileChange}
                  aria-describedby="photo-desc"
                />
                
                <p id="photo-desc" className="text-xs text-zinc-500 italic px-4">
                  Please provide a clear face photo so security can verify your identity.
                </p>
              </div>

            {step === "review" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Icon name="check" className="text-[24px]" />
                   </div>
                   <div>
                      <h4 className="font-bold text-white leading-tight">All set!</h4>
                      <p className="text-xs text-emerald-500/80">Data validated.</p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center p-2">
                  {preview && (
                    <Image 
                      src={preview} 
                      width={80} 
                      height={80} 
                      className="h-20 w-20 rounded-2xl object-cover border border-white/10" 
                      alt="Review" 
                      unoptimized
                    />
                  )}
                  <div className={preview ? "col-span-2" : "col-span-3 text-center"}>
                    <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mb-1">Pass Holder</p>
                    <p className="text-xl font-bold text-white truncate">{name}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step !== (requiresIdentity ? "name" : "photo") && (
                <Button 
                  variant="outline" 
                   className="h-14 rounded-2xl bg-transparent border-white/10 hover:bg-white/5"
                  onClick={() => setStep(step === "review" ? (requiresPhoto ? "photo" : "name") : "name")}
                >
                  Back
                </Button>
              )}
              
              {step === "review" ? (
                <LiquidButton 
                  className="flex-1 h-14 text-md font-black italic shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]"
                  onClick={handleSubmit}
                  isLoading={isUploading}
                >
                  CONFIRM & PAY
                </LiquidButton>
              ) : (
                <Button 
                  className="flex-1 h-14 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
