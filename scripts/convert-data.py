"""Convert raw ArcGIS output/*.json into slim, app-ready JSON for the Next.js frontend.

Reads from ../output/*.json (produced by fetch.py) and writes one slim JSON
array per category to ../web/public/data/*.json, keeping only fields the app
needs to render the navigator UI (id, name, address, coordinates, category-
specific extras). Run after `python3 fetch.py` whenever the source data changes.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "output")
DEST = os.path.join(ROOT, "web", "public", "data")


def s(v):
    if v is None:
        return None
    v = str(v).strip()
    return v or None


def convert_ev(feat):
    a = feat["attributes"]
    # NOTE: "jumlah_bilangan_unit_pengecas" (charge points per site) is the
    # field that reconciles with the official portal's site-wide EV total,
    # not "jumlah_bay" (a separate bay-count field). One row here = one
    # physical site, which can host multiple charge points.
    return {
        "id": f"ev-{a.get('id_ev') or a.get('objectid')}",
        "category": "ev_charger",
        "name": s(a.get("bangunan")) or s(a.get("jalan")) or "EV Charger",
        "address": s(a.get("alamat_pepasangan")),
        "lat": a.get("lat"),
        "lng": a.get("long"),
        "unitCount": a.get("jumlah_bilangan_unit_pengecas") or 1,
        "extra": {
            "operator": s(a.get("nama_pemegang_lesen_")),
            "acBays": a.get("ac_bay"),
            "dcBays": a.get("dc_bay"),
            "totalBays": a.get("jumlah_bay"),
            "capacityKw": a.get("kapasiti_pepasangan__kw_"),
        },
    }


def convert_aed(feat):
    a = feat["attributes"]
    return {
        "id": f"aed-{a.get('id_aed') or a.get('objectid')}",
        "category": "aed",
        "name": s(a.get("nam")) or s(a.get("keterangan")) or "AED",
        "address": s(a.get("alamat")) or s(a.get("keterangan")),
        "lat": a.get("lat"),
        "lng": a.get("long"),
        "unitCount": a.get("jumlah") or 1,
        "extra": {
            "brand": s(a.get("brand")),
            "status": s(a.get("status")),
            "phone": s(a.get("notel")),
            "ownership": s(a.get("ownership")),
        },
    }


def convert_cctv(feat):
    a = feat["attributes"]
    return {
        "id": f"cctv-{a.get('id_cctv') or a.get('objectid')}",
        "category": "cctv",
        "name": s(a.get("name")) or s(a.get("road_location")) or "CCTV",
        "address": s(a.get("road_location")),
        "lat": a.get("lat"),
        "lng": a.get("long"),
        "unitCount": a.get("jumlah_camera1") or 1,
        "extra": {
            "cameraType": s(a.get("camera_type")),
            "status": s(a.get("status")),
            "direction": s(a.get("direction")),
            "ptz": bool(a.get("cam_ptz")),
            "anpr": bool(a.get("cam_anpr")),
        },
    }


LAYERS = {
    "ev_charger": convert_ev,
    "aed": convert_aed,
    "cctv": convert_cctv,
}


def main():
    os.makedirs(DEST, exist_ok=True)
    manifest = {}
    for name, convert in LAYERS.items():
        feats = json.load(open(os.path.join(SRC, f"{name}.json"), encoding="utf-8"))
        items = []
        for feat in feats:
            row = convert(feat)
            if row["lat"] is None or row["lng"] is None:
                continue
            items.append(row)
        with open(os.path.join(DEST, f"{name}.json"), "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False)
        manifest[name] = {
            "sites": len(items),
            "units": sum(item["unitCount"] for item in items),
        }
        print(name, manifest[name])

    with open(os.path.join(DEST, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
