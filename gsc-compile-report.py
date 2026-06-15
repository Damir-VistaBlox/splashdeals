#!/usr/bin/env python3
"""
Compile GSC report from existing data (May 2-28, 2026)
This uses the daily and weekly snapshots already on disk.
"""
import json
import os
from pathlib import Path
from collections import defaultdict
from datetime import datetime

DATA_DIR = Path("/home/damir/projects/splashdeals/data/seo")

# Load all available data files
weekly_files = sorted(DATA_DIR.glob("gsc-week-*.json"))
daily_files = sorted(DATA_DIR.glob("gsc-fresh-*.json"))
latest_file = DATA_DIR / "gsc-latest.json"

print(f"Weekly files: {len(weekly_files)}")
print(f"Daily files:  {len(daily_files)}")

# Aggregate query data across all files
query_agg = defaultdict(lambda: {"clicks": 0, "impressions": 0, "positions": []})
page_agg = defaultdict(lambda: {"clicks": 0, "impressions": 0, "positions": []})
daily_records = []

for f in weekly_files + daily_files:
    try:
        data = json.loads(f.read_text())
        
        # Extract query data
        for q in data.get("queryData", []):
            qname = q.get("query", q.get("keys", [""])[0])
            query_agg[qname]["clicks"] += q.get("clicks", 0)
            query_agg[qname]["impressions"] += q.get("impressions", 0)
            if "position" in q or "keys" in f.name:  # may be different formats
                pos = float(q.get("position", q.get("position", 0)))
                if pos > 0:
                    query_agg[qname]["positions"].append(pos)
        
        # Extract page data
        for p in data.get("pageData", []):
            pname = p.get("page", p.get("keys", [""])[0])
            page_agg[pname]["clicks"] += p.get("clicks", 0)
            page_agg[pname]["impressions"] += p.get("impressions", 0)
            if "position" in p:
                pos = float(p.get("position", 0))
                if pos > 0:
                    page_agg[pname]["positions"].append(pos)
                    
        # Extract summary for daily view
        summary = data.get("summary", {})
        date_str = data.get("date", f.name.replace(".json","").split("-")[-1])[:10]
        daily_records.append({
            "date": date_str,
            "clicks": summary.get("totalClicks", "N/A"),
            "impressions": summary.get("totalImpressions", "N/A"),
        })
        
    except Exception as e:
        print(f"  Skipping {f.name}: {e}")

# Build top queries
top_queries = sorted(query_agg.items(), key=lambda x: -x[1]["impressions"])[:30]
top_pages = sorted(page_agg.items(), key=lambda x: -x[1]["impressions"])[:30]

# Compute averages
for items in [query_agg, page_agg]:
    for name, data in items.items():
        if data["positions"]:
            data["avg_position"] = round(sum(data["positions"]) / len(data["positions"]), 1)
        else:
            data["avg_position"] = "N/A"

total_clicks = sum(d["clicks"] for _, d in query_agg.items())
total_impressions = sum(d["impressions"] for _, d in query_agg.items())

# Check for zombie UUID pages
zombie_pages = [p for p in page_agg if any(x in p.lower() for x in [
    "b71d0b6a", "dd9e94c2", "a05a8c06", "/en/ticket/", "/rs/ticket/"
])]

# ========== BUILD REPORT ==========
report = f"""
{'=' * 60}
GSC REPORT — splashdeals.rs (May 2-28, 2026)
{'=' * 60}

📊 SEARCH PERFORMANCE SUMMARY (27 days)
   Total Clicks:       {total_clicks}
   Total Impressions:  {total_impressions:,}
   Avg CTR:            {f'{(total_clicks/total_impressions*100):.2f}%' if total_impressions > 0 else 'N/A'}
   Unique Queries:     {len(query_agg)}
   Unique Pages:       {len(page_agg)}
   Data Files Used:    {len(weekly_files) + len(daily_files)}

🗺️ SITEMAP STATUS
   [Could not fetch fresh data — token expired]
   Last known sitemaps: /sitemap.xml, /server-sitemap.xml

🔍 TOP 10 QUERIES (by impressions)
"""

for i, (q, data) in enumerate(top_queries[:10], 1):
    ctr = f"{(data['clicks']/data['impressions']*100):.2f}%" if data['impressions'] > 0 else "0%"
    report += f"   {i:2d}. \"{q:<40}\" {data['clicks']:3d} cl  {data['impressions']:5d} im  {ctr:>6}  pos {data['avg_position']}\n"

report += f"""
📄 TOP 10 PAGES (by impressions)
"""

for i, (p, data) in enumerate(top_pages[:10], 1):
    short = p.replace("https://splashdeals.rs", "")
    ctr = f"{(data['clicks']/data['impressions']*100):.2f}%" if data['impressions'] > 0 else "0%"
    report += f"   {i:2d}. {short:<50} {data['clicks']:3d} cl  {data['impressions']:5d} im  pos {data['avg_position']}\n"

report += f"""
🔍 KEY URL INSPECTION
"""

key_urls = [
    "https://splashdeals.rs/",
    "https://splashdeals.rs/facilities/petroland",
    "https://splashdeals.rs/facilities/novi-sad",
    "https://splashdeals.rs/facilities/aquapark-izvor",
]
for url in key_urls:
    p = page_agg.get(url)
    if p:
        short = url.replace("https://splashdeals.rs", "") or "/"
        report += f"   {short:<40} {p['clicks']:3d} cl  {p['impressions']:5d} im  pos {p['avg_position']}\n"
    else:
        report += f"   {url.replace('https://splashdeals.rs', '') or '/'}  — no data\n"

report += f"""
⚠️ ZOMBIE UUID PAGES
"""

if zombie_pages:
    report += f"   Found {len(zombie_pages)} zombie pages in the data:\n"
    for z in zombie_pages:
        d = page_agg[z]
        report += f"   • {z} — {d['clicks']} cl, {d['impressions']} im\n"
else:
    report += "   ✅ No zombie UUID pages detected in existing data.\n"

report += f"""
{'=' * 60}
RECOMMENDATIONS
{'=' * 60}

"""

# Generate recommendations based on data
# Check queries with good impressions but poor CTR
low_ctr_queries = [(q, d) for q, d in query_agg.items() 
                   if d['impressions'] >= 10 and data['impressions'] > 0 
                   and (d['clicks'] / d['impressions']) < 0.02]

high_pos_queries = [(q, d) for q, d in query_agg.items() 
                    if d['impressions'] >= 5 and data['impressions'] > 0
                    and isinstance(d['avg_position'], (int, float)) 
                    and d['avg_position'] < 10]

report += f"1. GSC Credentials: All OAuth tokens have expired. Re-authentication needed.\n"
report += f"   Run: node scripts/seo/gsc-oauth.js (requires client_secret file in Downloads)\n\n"

if low_ctr_queries:
    report += "2. Low CTR improvement opportunities:\n"
    for q, d in low_ctr_queries[:5]:
        ctr = f"{(d['clicks']/d['impressions']*100):.2f}%"
        report += f"   • \"{q}\" — {d['impressions']} im, {d['clicks']} cl ({ctr}), pos {d['avg_position']}\n"
    report += "\n"

if high_pos_queries:
    report += "3. Strong position queries (can convert more):\n"
    for q, d in high_pos_queries[:5]:
        ctr = f"{(d['clicks']/d['impressions']*100):.2f}%"
        report += f"   • \"{q}\" — pos {d['avg_position']}, {d['impressions']} im, {ctr}\n"
    report += "\n"

report += f"4. Continue daily/fresh GSC pulls once credentials are restored.\n"
report += f"5. Monitor SERP position for key facility pages (Petroland, Novi Sad, Izvor).\n"

print(report)

# Save report
out_path = Path("/home/damir/projects/splashdeals/data/seo/gsc-report-may-2026.md")
out_path.write_text(report)
print(f"\n💾 Report saved to: {out_path}")
