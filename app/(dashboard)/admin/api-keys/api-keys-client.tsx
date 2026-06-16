"use client"

import { useState } from "react"
import { Icon } from "@/components/ui/Icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { format } from "date-fns"
import { useAction } from "@/hooks/use-action"
import { createApiKeyAction, deleteApiKeyAction } from "@/server/actions/api-keys"

interface ApiKey {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
}

export function ApiKeysClient({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys)
  const [newKeyName, setNewKeyName] = useState("")
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [hasCopied, setHasCopied] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null)

  const { execute: handleCreate, isPending: isCreating } = useAction(
    (name: string) => createApiKeyAction(name),
    {
      successMessage: "API key generated",
      refresh: false,
      onSuccess: (result) => {
        const data = result.data as { key?: string } | undefined
        if (data?.key) {
          setGeneratedKey(data.key)
        }
      },
    }
  )

  const { execute: handleDelete } = useAction(
    (id: string) => deleteApiKeyAction(id),
    {
      successMessage: "API key revoked",
      refresh: true,
    }
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setHasCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Agent API Keys</h1>
          <p className="text-muted-foreground text-sm uppercase font-mono mt-1 opacity-70">
            Manage headless access for Paperclip Facility Administrator agents
          </p>
        </div>

        <Dialog onOpenChange={(open) => {
          if (!open) {
            setGeneratedKey(null)
            setHasCopied(false)
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase tracking-tight">
              <Icon name="add" className="mr-2 text-[16px]" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tight">Generate API Key</DialogTitle>
              <DialogDescription className="text-slate-400 font-mono text-xs">
                Give your API key a name to identify it later.
              </DialogDescription>
            </DialogHeader>

            {!generatedKey ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase opacity-70">Key Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Facility Admin Agent" 
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-cyan-500/50"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                  <Icon name="error" className="text-[20px] text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-amber-500 uppercase">Security Warning</p>
                    <p className="text-[10px] text-amber-500/80 font-mono leading-relaxed">
                      Copy this key now. For security reasons, you will not be able to see it again.
                    </p>
                  </div>
                </div>
                <div className="relative group">
                  <Input 
                    value={generatedKey}
                    readOnly
                    className="bg-white/5 border-white/10 font-mono text-xs pr-10 focus:ring-0 focus:border-cyan-500/50"
                  />
                  <button 
                    onClick={() => copyToClipboard(generatedKey)}
                    className="absolute right-2 top-1.5 p-1.5 rounded-md hover:bg-white/10 text-slate-400 transition-colors"
                  >
                    {hasCopied ? <Icon name="check" className="text-[16px] text-emerald-500" /> : <Icon name="content_copy" className="text-[16px]" />}
                  </button>
                </div>
              </div>
            )}

            <DialogFooter>
              {!generatedKey ? (
                <Button 
                  onClick={() => {
                    if (newKeyName) handleCreate(newKeyName)
                  }} 
                  disabled={isCreating || !newKeyName}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase"
                >
                  {isCreating ? <Icon name="progress_activity" className="text-[16px] animate-spin" /> : "Generate Key"}
                </Button>
              ) : (
                <Button 
                  onClick={() => setGeneratedKey(null)}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-black uppercase"
                >
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-950/40 border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            <Icon name="key" className="text-[20px] text-cyan-500" />
            Active API Keys
          </CardTitle>
          <CardDescription className="text-xs font-mono opacity-50 uppercase">
            Keys that currently have access to the REST backend
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] font-black uppercase opacity-40">Name</TableHead>
                <TableHead className="text-[10px] font-black uppercase opacity-40">Prefix</TableHead>
                <TableHead className="text-[10px] font-black uppercase opacity-40">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase opacity-40">Last Used</TableHead>
                <TableHead className="text-[10px] font-black uppercase opacity-40">Created</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase opacity-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-mono text-xs uppercase opacity-40">
                    No API keys generated yet
                  </TableCell>
                </TableRow>
              ) : (
                keys.map((key) => (
                  <TableRow key={key.id} className="border-white/5 group transition-colors hover:bg-white/[0.02]">
                    <TableCell className="font-bold text-sm text-white">{key.name}</TableCell>
                    <TableCell>
                      <code className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-cyan-400">
                        {key.prefix}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black border-emerald-500/30 text-emerald-500 bg-emerald-500/5 uppercase tracking-tighter">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono opacity-60">
                      {key.lastUsedAt ? format(new Date(key.lastUsedAt), "MMM d, HH:mm") : "Never"}
                    </TableCell>
                    <TableCell className="text-[10px] font-mono opacity-60">
                      {format(new Date(key.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => {
                          setKeyToDelete(key.id)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Icon name="delete" className="text-[16px]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-red-500">Revoke API Key</DialogTitle>
            <DialogDescription className="text-slate-400 font-mono text-xs leading-relaxed">
              Are you sure? This will immediately terminate all access for this key. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="font-black uppercase text-xs">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (keyToDelete) {
                  handleDelete(keyToDelete)
                  setIsDeleteDialogOpen(false)
                  setKeyToDelete(null)
                }
              }} 
              className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs"
            >
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
