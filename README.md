# NYS Utility Governance Map

An interactive map of the New York State entities, laws, and processes that govern
utilities — electric, gas, steam, water, and telecom.

## What's in it

- **Entities** — PSC, DPS, ORES, NYSERDA, NYPA, LIPA, DEC, AG, Comptroller, ABO,
  Utility Intervention Unit, legislative committees, NYISO/FERC for federal context,
  and the regulated utilities themselves (Con Edison, National Grid, NYSEG/RG&E,
  Central Hudson, PSEG-LI, munis/co-ops, water companies, telecom, ESCOs).
- **Laws** — Public Service Law, CLCPA, HEFPA, Public Authorities Law,
  Build Public Renewables Act, RAPID Act, Accelerated Renewable Energy Growth Act,
  Utility Thermal Energy Networks & Jobs Act, LIPA Reform Act.
- **Processes** — rate cases, §68 certificates, Article VII and Article VIII siting,
  Clean Energy Standard procurement, gas planning, consumer complaints & enforcement,
  VDER/net metering, reliability & storm oversight, the State Energy Plan.

Each node has a detail panel with an explanation, its connections (clickable),
and a link to the official source. Filter by entity type or utility sector,
search, drag, zoom.

## Run it

No build step — it's static HTML + [D3](https://d3js.org/) from a CDN:

```sh
python3 -m http.server 8765
# then open http://localhost:8765
```

## Editing the map

All content lives in `data.js` (`NODES` and `LINKS`). Add a node, give it a
`type` and `sectors`, wire it up in `LINKS`, and reload.

Unofficial civic reference; current through the 2024 RAPID Act / 2025 session.
