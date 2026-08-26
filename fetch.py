import json, csv, urllib.request

BASE = "https://pegis.penang.gov.my/arcgis/rest/services/Hosted"

layers = {
    "cctv": ("CCTV2026", 0),
    "aed": ("AED_PENANG", 0),
    "ev_charger": ("fl_EV100326", 0),
}

def fetch_all(svc, idx):
    all_feats = []
    offset = 0
    while True:
        url = f"{BASE}/{svc}/FeatureServer/{idx}/query?where=1=1&outFields=*&outSR=4326&f=json&resultOffset={offset}&resultRecordCount=2000"
        with urllib.request.urlopen(url) as r:
            d = json.load(r)
        feats = d.get("features", [])
        all_feats.extend(feats)
        if len(feats) < 2000:
            break
        offset += 2000
    return all_feats

for name, (svc, idx) in layers.items():
    feats = fetch_all(svc, idx)
    print(name, len(feats))
    if not feats:
        continue
    fieldnames = list(feats[0]["attributes"].keys()) + ["geometry_x", "geometry_y"]
    with open(f"output/{name}.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for feat in feats:
            row = dict(feat["attributes"])
            geom = feat.get("geometry") or {}
            row["geometry_x"] = geom.get("x")
            row["geometry_y"] = geom.get("y")
            w.writerow(row)
    with open(f"output/{name}.json", "w", encoding="utf-8") as f:
        json.dump(feats, f, ensure_ascii=False, indent=2)
