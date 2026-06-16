import { Icon } from "@/components/ui/Icon";
import { Metadata } from "next"
import { requireSuperAdmin } from "@/server/lib/auth-guards"
import { prisma } from "@/server/lib/prisma"
import { connection } from "next/server"

export const metadata: Metadata = {
  title: "Security & Operations | Splashdeals Admin",
  description: "Monitor customer support logs and system security protocols.",
}

export default async function SupportPage() {
  await connection()
  await requireSuperAdmin({ redirect: true })

  const [failedCount, pendingCount, recentLogs] = await Promise.all([
    prisma.transaction.count({ where: { status: "FAILED" } }),
    prisma.transaction.count({ where: { status: "PENDING" } }),
    prisma.transaction.findMany({
      where: {
        status: { in: ["FAILED", "PENDING"] }
      },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        facility: {
          select: {
            name: true,
            city: true
          }
        }
      }
    })
  ])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-slate-950 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Security & Operations</h1>
        <p className="text-sm text-slate-400">Monitor platform health and handle incoming support escalations.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="shield" className="size-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">System Integrity</span>
          </div>
          <div className="text-2xl font-black text-white uppercase tracking-tight">Verified</div>
          <div className="text-[9px] text-slate-500 font-mono tracking-tighter">SD-GATEWAY-2026</div>
        </div>
        
        <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="support" className="size-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Critical Escalations</span>
          </div>
          <div className="text-2xl font-black text-white">{failedCount}</div>
          <div className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase">Failed Transactions requiring audit</div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="schedule" className="size-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Fulfillment Queue</span>
          </div>
          <div className="text-2xl font-black text-white">{pendingCount}</div>
          <div className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase">Pending system actions</div>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 p-4 bg-white/5">
          <div className="flex items-center gap-2 text-white">
            <Icon name="terminal" className="size-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Operations Log</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <span className="text-[9px] font-black text-primary uppercase tracking-tight">Active</span>
          </div>
        </div>
        <div className="divide-y divide-white/5 min-h-[300px]">
          {recentLogs.length > 0 ? (
            recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${log.status === 'FAILED' ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}>
                    {log.status === 'FAILED' ? (
                      <Icon name="error" className="size-4 text-rose-500" />
                    ) : (
                      <Icon name="schedule" className="size-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-200">{log.facility.name}</span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                      {log.totalAmount.toLocaleString()} RSD • {log.facility.city}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                    log.status === 'FAILED' ? 'bg-rose-500/5 border-rose-500/20 text-rose-500' : 'bg-amber-500/5 border-amber-500/20 text-amber-500'
                  }`}>
                    {log.status}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <Icon name="terminal" className="size-10 text-muted-foreground/20 mb-4" />
              <h3 className="text-sm font-bold text-slate-200">No Active Escalations</h3>
              <p className="text-[11px] text-slate-500 max-w-[200px] mt-1">
                Platform security is optimal. There are no pending or failed transactions requiring immediate intervention.
              </p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/5 text-center bg-white/[0.02]">
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            End of log
          </span>
        </div>
      </div>
    </div>
  )
}
