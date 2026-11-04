import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open(r"d:\CSE AI ML\CS\foot\scratch\runtime_crawl_results.json", encoding='utf-8') as f:
    data = json.load(f)

print(f"Total routes crawled: {len(data)}")
for item in data:
    path = item['path']
    title = item['title']
    overflow = item['overflow']
    errors = item['errors']
    net_errs = item['network_failures']
    
    if errors or net_errs or overflow:
        print(f"\n[ISSUE FOUND] Route: {path}")
        print(f"   Title: {title}")
        print(f"   Overflow: {overflow}")
        for t, err in errors:
            print(f"   Console {t}: {err}")
        for status, u in net_errs:
            print(f"   Network {status}: {u}")
