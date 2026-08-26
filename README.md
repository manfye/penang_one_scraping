# Penang One Scraping

A personal-interest project — not affiliated with, endorsed by, or officially connected to the Penang state government, MBPP, or Penang OneMap+.

## What this is

1. `fetch.py` — a small scraper that pulls public open data (EV chargers, AEDs, CCTV locations) from Penang's official [Penang OneMap+](https://pegis.penang.gov.my) ArcGIS FeatureServer, and writes it to `output/` as JSON and CSV.
2. `web/` — **Terdekat**, a mobile-first Next.js app built on top of that data, to find the nearest EV charger / AED / CCTV and get pointed toward it.

This was built for fun / personal learning, to see what could be done with data the state already publishes openly.

## About the data

- Source: [pegis.penang.gov.my](https://pegis.penang.gov.my) (Penang OneMap+), a public ArcGIS REST service.
- The data belongs to the original publisher (Penang state government / MBPP). This repo does not claim ownership of it — it's just a convenience scrape + a small app on top.
- Data can go stale. Re-run `python3 fetch.py` (then `python3 scripts/convert-data.py` to refresh the web app's copy) to get the latest snapshot.
- No guarantee of accuracy, completeness, or availability — verify anything safety-critical (e.g. AED locations) independently.

## Using this repo

Feel free to use, fork, or adapt any of the code here for your own purposes. See `CLAUDE.md` for setup and architecture notes if you want to run or extend it.

If you build something with the underlying open data, consider checking the source portal's own terms for how they'd like it credited/used.
