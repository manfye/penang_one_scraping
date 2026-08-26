# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A scraper for Penang state government open-data ArcGIS FeatureServer layers: EV chargers, AEDs (defibrillators), and CCTV cameras across Penang. `fetch.py` pulls each layer and writes both raw JSON and flattened CSV to `output/`. There is currently no application code — just the scraper and its output.

## Commands

Run the scraper (overwrites all files in `output/`):

```bash
python3 fetch.py
```

No build, lint, or test tooling is set up in this repo.

## Architecture

`fetch.py` is a single script with one pattern repeated for three layers, defined in the `layers` dict:

```python
layers = {
    "cctv": ("CCTV2026", 0),
    "aed": ("AED_PENANG", 0),
    "ev_charger": ("fl_EV100326", 0),
}
```

Each entry maps an output name to `(service_name, layer_index)` on `https://pegis.penang.gov.my/arcgis/rest/services/Hosted`. `fetch_all()` pages through the ArcGIS `query` REST endpoint 2000 records at a time (`resultOffset`/`resultRecordCount`) until a short page signals the end. To add a new layer, add an entry to `layers` — no other code changes needed.

For each layer, output is written twice:
- `output/<name>.json` — the raw ArcGIS feature list (`attributes` + `geometry` per feature), indented.
- `output/<name>.csv` — flattened: `attributes` fields plus `geometry_x`/`geometry_y` pulled out of `geometry`, using the first feature's attribute keys as the CSV header (assumes all features in a layer share the same schema).

### Data shape notes

- Coordinates: each feature's `geometry.x`/`geometry.y` are lon/lat (EPSG:4326, since `outSR=4326` is requested). Most layers also duplicate this in attributes as `lat`/`long`, and EV chargers additionally have a human-readable `location_coordinate` string (`"lat, long"`).
- Field names are a mix of Malay and English and vary per layer (EV charger, AED, and CCTV each have distinct attribute schemas) — there is no shared schema across `output/*.json` beyond `attributes`/`geometry`.
- Nullable fields are common (e.g. `remark`, `pic`, `catatan`); don't assume required fields are populated.
