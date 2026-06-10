// NYS Utility Governance Map — data
// Node types: regulator, authority, executive, legislature, oversight, federal, utility, law, process
// Each node: id, label, type, sector tags, blurb (detail panel HTML), link (official source)

const NODES = [
  // ───────────────────────────── REGULATORS / CORE STATE ─────────────────────────────
  {
    id: "psc",
    label: "Public Service Commission (PSC)",
    type: "regulator",
    sectors: ["electric", "gas", "steam", "water", "telecom"],
    blurb: `The central regulator of investor-owned utilities in New York. Up to seven commissioners,
      appointed by the Governor with Senate confirmation, serve six-year terms; the Governor designates the Chair.
      The PSC sets rates, approves utility capital plans and mergers, issues Certificates of Public Convenience
      and Necessity, enforces service-quality and safety standards, and implements major energy policy
      (Clean Energy Standard, net metering successor tariffs, etc.). It regulates electric, gas, steam, water,
      and (more lightly) telecommunications utilities. Its decisions are made in numbered "cases" and "matters"
      through quasi-judicial proceedings, and are reviewable in state court under CPLR Article 78.`,
    link: "https://dps.ny.gov/public-service-commission"
  },
  {
    id: "dps",
    label: "Department of Public Service (DPS)",
    type: "regulator",
    sectors: ["electric", "gas", "steam", "water", "telecom"],
    blurb: `The staff arm of the PSC — the Commission decides, the Department does the work. DPS staff
      audit utility books, litigate rate cases as a party, run the consumer complaint hotline, inspect
      gas pipeline safety, monitor electric reliability, and advise the Commission. The PSC Chair is also
      the CEO of DPS. Since the 2024 RAPID Act, DPS also houses the Office of Renewable Energy Siting
      and Electric Transmission (ORES).`,
    link: "https://dps.ny.gov/"
  },
  {
    id: "ores",
    label: "Office of Renewable Energy Siting & Electric Transmission (ORES)",
    type: "regulator",
    sectors: ["electric"],
    blurb: `One-stop permitting office for major renewable generation (≥25 MW, opt-in at 20–25 MW) and,
      since the 2024 RAPID Act, major electric transmission. Created in 2020 by the Accelerated Renewable
      Energy Growth and Community Benefit Act (Executive Law §94-c), then transferred into DPS and
      re-codified as Public Service Law Article VIII by the RAPID Act. ORES must act on a complete
      application within one year (six months for projects on former commercial/industrial sites),
      applying uniform standards rather than case-by-case review. It can override unreasonably burdensome
      local laws.`,
    link: "https://dps.ny.gov/ores"
  },

  // ───────────────────────────── PUBLIC AUTHORITIES ─────────────────────────────
  {
    id: "nyserda",
    label: "NYSERDA",
    type: "authority",
    sectors: ["electric", "gas"],
    blurb: `The New York State Energy Research and Development Authority — a public-benefit corporation
      that administers most of the state's clean-energy money. NYSERDA runs the Clean Energy Fund,
      procures Renewable Energy Certificates (RECs) and offshore-wind RECs (ORECs) under the Clean Energy
      Standard, administers NY-Sun (distributed solar) and building-decarbonization programs, and publishes
      the State Energy Plan with partners. Funded largely by ratepayer surcharges collected by the utilities
      under PSC orders, plus RGGI auction proceeds.`,
    link: "https://www.nyserda.ny.gov/"
  },
  {
    id: "nypa",
    label: "New York Power Authority (NYPA)",
    type: "authority",
    sectors: ["electric"],
    blurb: `The country's largest state-owned power organization. NYPA owns the big hydro plants
      (Niagara, St. Lawrence-FDR), about a third of the state's high-voltage transmission, and sells
      low-cost power to government customers, businesses (ReCharge NY), and municipal/co-op systems.
      It is governed by trustees appointed by the Governor and is generally NOT rate-regulated by the PSC.
      The 2023 Build Public Renewables Act authorized and directed NYPA to develop renewable generation,
      alone or with partners, and to phase out its fossil "peaker" plants by 2030.`,
    link: "https://www.nypa.gov/"
  },
  {
    id: "lipa",
    label: "Long Island Power Authority (LIPA)",
    type: "authority",
    sectors: ["electric"],
    blurb: `A state-created municipal subdivision that owns the electric grid on Long Island and the
      Rockaways. Day-to-day operation is contracted to PSEG Long Island under an operating-services
      agreement (a structure under recurring legislative debate, including proposals for full
      municipalization). LIPA is outside normal PSC rate jurisdiction, but the LIPA Reform Act of 2013
      gave DPS a dedicated Long Island office to review LIPA/PSEG-LI rates and performance and make
      recommendations.`,
    link: "https://www.lipower.org/"
  },
  {
    id: "nyiso",
    label: "NYISO",
    type: "federal",
    sectors: ["electric"],
    blurb: `The New York Independent System Operator — a private, not-for-profit corporation (not a state
      agency) that operates the state's bulk electric grid and runs the wholesale energy, capacity, and
      ancillary-services markets. Its tariffs are regulated by FERC, not the PSC. NYISO also runs the
      interconnection queue that every new power plant and large battery must pass through, and publishes
      the reliability studies (RNA, Gold Book) that drive transmission planning.`,
    link: "https://www.nyiso.com/"
  },
  {
    id: "ferc",
    label: "FERC (federal)",
    type: "federal",
    sectors: ["electric", "gas"],
    blurb: `The Federal Energy Regulatory Commission regulates what the state cannot: wholesale electricity
      sales and transmission rates (Federal Power Act), interstate natural-gas pipelines (Natural Gas Act),
      and hydro licensing — including NYPA's Niagara license. The state/federal line — retail vs. wholesale —
      shapes everything: the PSC sets delivery rates, but the energy itself clears in FERC-jurisdictional
      NYISO markets. Interstate pipeline expansions are FERC-certificated, though NY has used Clean Water
      Act §401 certifications (via DEC) to block several.`,
    link: "https://www.ferc.gov/"
  },

  // ───────────────────────────── EXECUTIVE / OVERSIGHT ─────────────────────────────
  {
    id: "governor",
    label: "Governor",
    type: "executive",
    sectors: ["electric", "gas", "steam", "water", "telecom"],
    blurb: `Appoints PSC commissioners (with Senate consent) and designates the Chair, appoints NYPA and
      LIPA trustees and NYSERDA's board, signs or vetoes energy legislation, and steers policy through the
      budget and executive agencies. Major utility policy in NY (CLCPA implementation, offshore wind
      procurement targets, nuclear subsidies, the RAPID Act) has typically been governor-driven.`,
    link: "https://www.governor.ny.gov/"
  },
  {
    id: "dec",
    label: "Dept. of Environmental Conservation (DEC)",
    type: "executive",
    sectors: ["electric", "gas", "water"],
    blurb: `Issues the environmental permits utilities and generators need — air (Title V), water
      (SPDES, Clean Water Act §401 certifications), wetlands — and co-leads CLCPA implementation with
      NYSERDA, including the statewide greenhouse-gas emission limits (6 NYCRR Part 496) and the value
      of carbon guidance. DEC's §401 denials have been the state's main lever over FERC-approved
      interstate gas pipelines.`,
    link: "https://dec.ny.gov/"
  },
  {
    id: "ag",
    label: "Attorney General",
    type: "oversight",
    sectors: ["electric", "gas", "water", "telecom"],
    blurb: `Represents the People of New York in PSC rate cases and court, runs consumer-protection
      enforcement against utilities and energy-services companies (ESCOs), and litigates major energy
      matters (e.g., storm-response failures, ESCO marketing abuses). The AG's Environmental Protection
      Bureau also intervenes in FERC and federal proceedings on the state's behalf.`,
    link: "https://ag.ny.gov/"
  },
  {
    id: "uiu",
    label: "Utility Intervention Unit (Dept. of State)",
    type: "oversight",
    sectors: ["electric", "gas", "water"],
    blurb: `A small unit inside the Department of State's Division of Consumer Protection that formally
      intervenes in PSC rate cases and gas-planning proceedings on behalf of residential ratepayers —
      filing testimony, briefs, and exceptions like any other party. One of the few institutional
      ratepayer advocates in the state (NY has no fully independent consumer-advocate office, a perennial
      legislative proposal).`,
    link: "https://dos.ny.gov/utility-intervention"
  },
  {
    id: "comptroller",
    label: "State Comptroller",
    type: "oversight",
    sectors: ["electric", "gas", "water"],
    blurb: `Audits state agencies and public authorities — including NYPA, LIPA, NYSERDA, and DPS itself
      (e.g., audits of DPS oversight of utility storm response and gas safety). Reviews certain authority
      contracts and reports on authority debt. The Comptroller's audits are a primary public window into
      authority performance.`,
    link: "https://www.osc.ny.gov/"
  },
  {
    id: "abo",
    label: "Authorities Budget Office (ABO)",
    type: "oversight",
    sectors: ["electric"],
    blurb: `Created by the Public Authorities Accountability Act of 2005 (strengthened 2009) to oversee
      the governance of public authorities, including NYPA, LIPA, and NYSERDA. Collects board and financial
      reports (PARIS system), issues governance reviews, and can recommend removal of board members who
      fail fiduciary duties.`,
    link: "https://www.abo.ny.gov/"
  },
  {
    id: "cac",
    label: "Climate Action Council",
    type: "executive",
    sectors: ["electric", "gas"],
    blurb: `The 22-member body created by the CLCPA, co-chaired by the heads of DEC and NYSERDA, that wrote
      the 2022 Scoping Plan — the state's roadmap for hitting CLCPA emissions limits. The Scoping Plan is
      not self-executing; it guides PSC proceedings, DEC rulemaking, and legislation (e.g., gas-transition
      and building-electrification debates).`,
    link: "https://climate.ny.gov/"
  },

  // ───────────────────────────── LEGISLATURE ─────────────────────────────
  {
    id: "senate-energy",
    label: "Senate Energy & Telecommunications Committee",
    type: "legislature",
    sectors: ["electric", "gas", "telecom"],
    blurb: `Gatekeeper committee for energy and utility bills in the State Senate; also the committee that
      vets the Governor's PSC nominees before confirmation. Recent fights through this committee: the
      Build Public Renewables Act, the NY HEAT Act (gas-transition; passed Senate repeatedly, stalled in
      Assembly), and utility-accountability bills after major storms.`,
    link: "https://www.nysenate.gov/committees/energy-and-telecommunications"
  },
  {
    id: "assembly-energy",
    label: "Assembly Energy Committee",
    type: "legislature",
    sectors: ["electric", "gas", "telecom"],
    blurb: `The Assembly counterpart for energy legislation. Together with Senate Energy and the corporations
      committees it shapes the Public Service Law. The Legislature also controls the sweep of authority
      funds and ratepayer surcharges through the budget, and amends the Public Authorities Law that
      governs NYPA/LIPA.`,
    link: "https://nyassembly.gov/comm/?id=22"
  },

  // ───────────────────────────── UTILITIES (REGULATED COMPANIES) ─────────────────────────────
  {
    id: "coned",
    label: "Con Edison",
    type: "utility",
    sectors: ["electric", "gas", "steam"],
    blurb: `Consolidated Edison Company of New York — electric delivery for NYC and most of Westchester,
      gas in Manhattan/Bronx/parts of Queens and Westchester, and the largest district steam system in
      the country (Manhattan below ~96th St). Sister company Orange & Rockland serves the lower Hudson
      Valley. Rate-regulated by the PSC; typically files joint electric/gas/steam rate cases every
      few years.`,
    link: "https://www.coned.com/"
  },
  {
    id: "nationalgrid",
    label: "National Grid (NiMo, KEDNY, KEDLI)",
    type: "utility",
    sectors: ["electric", "gas"],
    blurb: `UK-based National Grid operates three NY utilities: Niagara Mohawk (upstate electric & gas),
      KEDNY (Brooklyn/Queens/Staten Island gas), and KEDLI (Long Island gas). Its downstate gas systems
      are at the center of the gas-transition fight (moratorium of 2019, long-term gas plans under PSC
      review).`,
    link: "https://www.nationalgrid.com/"
  },
  {
    id: "avangrid",
    label: "NYSEG & RG&E (Avangrid)",
    type: "utility",
    sectors: ["electric", "gas"],
    blurb: `New York State Electric & Gas and Rochester Gas & Electric — upstate electric/gas utilities
      owned by Avangrid (Iberdrola). Their service quality and billing problems have drawn PSC enforcement
      and management audits in recent years; both file joint rate cases.`,
    link: "https://www.nyseg.com/"
  },
  {
    id: "centralhudson",
    label: "Central Hudson",
    type: "utility",
    sectors: ["electric", "gas"],
    blurb: `Mid-Hudson Valley electric and gas utility (owned by Fortis). Its 2021 billing-system failure
      triggered a major PSC enforcement proceeding and civil penalties — a useful case study in how the
      PSC's penalty and management-audit powers (PSL §§ 25, 66) actually get used.`,
    link: "https://www.cenhud.com/"
  },
  {
    id: "psegli",
    label: "PSEG Long Island",
    type: "utility",
    sectors: ["electric"],
    blurb: `Subsidiary of New Jersey's PSEG that operates LIPA's grid under contract. After Tropical Storm
      Isaias (2020) exposed outage-management failures, the contract was renegotiated into a more
      performance-based agreement, and full public operation ("municipalization") remains under
      legislative study.`,
    link: "https://www.psegliny.com/"
  },
  {
    id: "munis",
    label: "Municipal utilities & rural co-ops",
    type: "utility",
    sectors: ["electric"],
    blurb: `About 50 municipal electric systems (e.g., Jamestown, Plattsburgh, Freeport) and rural
      cooperatives, many served cheap NYPA hydro power. Largely self-governing on rates (lightly touched
      by PSC), they're represented by the NY Association of Public Power and the Municipal Electric
      Utilities Association.`,
    link: "https://www.meua.org/"
  },
  {
    id: "water-utils",
    label: "Private water utilities",
    type: "utility",
    sectors: ["water"],
    blurb: `Investor-owned water companies — by far the largest is Veolia Water New York (formerly SUEZ,
      Rockland/Westchester) plus Long Island systems (NY American Water's former territory, now the
      public Liberty/NY Water Authority areas after a high-profile municipalization fight). Rate-regulated
      by the PSC under PSL Article 4-B; drinking-water quality is regulated separately by the Health
      Department and county health units. (NYC's water system, by contrast, is a city agency — DEP —
      outside PSC jurisdiction.)`,
    link: "https://dps.ny.gov/water"
  },
  {
    id: "telecom",
    label: "Telecom / cable / broadband providers",
    type: "utility",
    sectors: ["telecom"],
    blurb: `Verizon (legacy ILEC), Charter/Spectrum, Altice and others. PSC jurisdiction over telecom is
      much lighter than over energy — service quality and some consumer protections — with the FCC
      preempting most. The PSC famously moved to revoke Charter's merger approval in 2018 over broken
      build-out promises (settled). The ConnectALL office (Empire State Development) now runs state
      broadband expansion.`,
    link: "https://dps.ny.gov/telecommunications"
  },
  {
    id: "escos",
    label: "ESCOs (energy service companies)",
    type: "utility",
    sectors: ["electric", "gas"],
    blurb: `Retail energy marketers that sell electric/gas supply over the utilities' wires under NY's
      1996+ retail-access regime. After years of overcharging findings, the PSC's 2019 "ESCO reset" order
      barred most ESCOs from serving mass-market customers unless they guarantee savings or supply 100%
      renewable power. The AG and DPS both police ESCO marketing.`,
    link: "https://dps.ny.gov/escos"
  },

  // ───────────────────────────── LAWS ─────────────────────────────
  {
    id: "psl",
    label: "Public Service Law",
    type: "law",
    sectors: ["electric", "gas", "steam", "water", "telecom"],
    blurb: `The foundational statute (enacted 1907, under Gov. Charles Evans Hughes) creating the PSC and
      DPS and defining their power over electric, gas, steam, water, and telephone corporations. Key
      provisions: §65 (just & reasonable rates, no undue discrimination), §66 (general supervisory powers,
      management audits), §68 (Certificate of Public Convenience and Necessity), §66-p (zero-emission
      grid target codified from CLCPA), §25/§25-a (civil penalties), Article 2 (consumer protections /
      HEFPA), Article 4-B (water), Article VII (transmission siting), Article VIII (renewable siting,
      post-RAPID). Implemented through PSC regulations in Title 16 NYCRR.`,
    link: "https://www.nysenate.gov/legislation/laws/PBS"
  },
  {
    id: "clcpa",
    label: "CLCPA (Climate Act, 2019)",
    type: "law",
    sectors: ["electric", "gas"],
    blurb: `The Climate Leadership and Community Protection Act — New York's binding climate framework:
      40% GHG reduction by 2030 and 85% by 2050 (from 1990); 70% renewable electricity by 2030; a
      zero-emission grid by 2040; 9 GW offshore wind by 2035, 6 GW distributed solar by 2025, 3 GW
      storage by 2030 (since raised to 6 GW by PSC order); and a requirement that 35–40% of clean-energy
      benefits flow to disadvantaged communities. §7(2) requires all state agencies — including the PSC —
      to weigh consistency with the Act's limits in every permit and approval. It drives the Clean Energy
      Standard, gas-planning proceedings, and most current utility policy.`,
    link: "https://climate.ny.gov/resources/climate-act/"
  },
  {
    id: "hefpa",
    label: "HEFPA (Home Energy Fair Practices Act)",
    type: "law",
    sectors: ["electric", "gas", "steam"],
    blurb: `PSL Article 2 — the residential utility-consumer bill of rights (1981). Governs deferred-payment
      agreements, shutoff protections (winter, medical, elderly/blind/disabled), deposit limits, budget
      billing, and complaint procedures. Enforced by DPS; the 2021 amendments added protections during
      the COVID emergency and arrears-relief programs followed via PSC orders.`,
    link: "https://www.nysenate.gov/legislation/laws/PBS/A2"
  },
  {
    id: "pal",
    label: "Public Authorities Law",
    type: "law",
    sectors: ["electric"],
    blurb: `The statute chartering NYPA (Title 1, §1000 et seq.) and LIPA (§1020 et seq.), defining their
      boards, powers, debt authority, and reporting duties. Amended by the Public Authorities
      Accountability Act (2005/2009) to add the ABO, independent board duties, and disclosure rules —
      and by the Build Public Renewables Act (2023) to expand NYPA's generation mandate.`,
    link: "https://www.nysenate.gov/legislation/laws/PBA"
  },
  {
    id: "bpra",
    label: "Build Public Renewables Act (2023)",
    type: "law",
    sectors: ["electric"],
    blurb: `Passed in the FY2024 budget after a multi-year campaign: directs NYPA to plan and build renewable
      generation (alone or with partners) wherever the private market is falling short of CLCPA targets,
      requires NYPA to retire its six downstate fossil peaker plants by 2030 where reliability allows,
      mandates prevailing-wage/labor standards, and creates the REACH program to deliver bill credits to
      disadvantaged-community customers. NYPA published its first renewables strategic plan in 2024–25
      under this mandate.`,
    link: "https://www.nypa.gov/renewables"
  },
  {
    id: "rapid",
    label: "RAPID Act (2024)",
    type: "law",
    sectors: ["electric"],
    blurb: `The Renewable Action through Project Interconnection and Deployment Act (FY2025 budget):
      moved ORES from Executive Law §94-c into the Department of Public Service, re-codified renewable
      siting as Public Service Law Article VIII, and — the big change — extended the one-stop, deadline-bound
      siting regime to major electric transmission facilities, which previously needed slower PSL
      Article VII certificates.`,
    link: "https://dps.ny.gov/ores"
  },
  {
    id: "aregcba",
    label: "Accelerated Renewable Energy Growth Act (2020)",
    type: "law",
    sectors: ["electric"],
    blurb: `Created the original ORES (Executive Law §94-c) to replace the notoriously slow Article 10
      power-plant siting board for renewables; established uniform permit standards, host-community
      benefit requirements, and the build-ready program (NYSERDA preps brownfield sites for development).
      Also directed bulk-transmission planning to unlock renewable delivery (the "coordinated grid
      planning" that produced projects like Smart Path and the Long Island offshore-wind export studies).`,
    link: "https://www.nysenate.gov/legislation/laws/EXC/94-C"
  },
  {
    id: "utenja",
    label: "Utility Thermal Energy Networks & Jobs Act (2022)",
    type: "law",
    sectors: ["gas", "electric"],
    blurb: `Authorized and required the large gas/electric utilities to propose utility-scale thermal
      energy networks (networked geothermal, waste-heat loops) as regulated pilot projects — a possible
      reuse of gas-utility workforces and rights-of-way in a decarbonized system. The PSC oversees the
      pilots (Case 22-M-0429); Con Edison, National Grid, and others have projects in development.`,
    link: "https://www.nysenate.gov/legislation/bills/2021/S9422"
  },
  {
    id: "lipa-reform",
    label: "LIPA Reform Act (2013)",
    type: "law",
    sectors: ["electric"],
    blurb: `Post-Superstorm-Sandy restructuring of Long Island power: shrank LIPA to a holding/oversight
      entity, expanded the operating contract (PSEG-LI), refinanced LIPA debt through the Utility Debt
      Securitization Authority, and created a DPS Long Island office to review LIPA rates and operations —
      review-and-recommend rather than full PSC jurisdiction.`,
    link: "https://www.lipower.org/about-us/"
  },

  // ───────────────────────────── PROCESSES ─────────────────────────────
  {
    id: "ratecase",
    label: "Rate cases",
    type: "process",
    sectors: ["electric", "gas", "steam", "water"],
    blurb: `How delivery rates get set. A utility files proposed tariffs with supporting testimony; the PSC
      suspends them for up to 11 months (PSL §66(12)) — which is why nearly every case resolves inside
      that window. DPS staff, the AG, UIU, and intervenors (municipalities, large customers, environmental
      and consumer groups) take discovery and file testimony before an Administrative Law Judge; most cases
      settle into a multi-year "joint proposal" the Commission then approves, often with an earnings-sharing
      mechanism, performance metrics, and capital-spending conditions. Revenue requirement = operating
      costs + depreciation + taxes + (rate base × allowed return on equity, lately ~9–9.5%).`,
    link: "https://dps.ny.gov/rate-case-process"
  },
  {
    id: "cpcn",
    label: "Certificates (PSL §68 CPCN)",
    type: "process",
    sectors: ["electric", "gas", "water"],
    blurb: `No one may operate as an electric or gas corporation, or extend service into new territory,
      without a Certificate of Public Convenience and Necessity from the PSC (PSL §68). This is also the
      hook for PSC review of utility mergers and acquisitions (with §70 transfer review) — where the
      Commission extracts "positive benefit adjustments" (rate credits, storm hardening, etc.) as
      conditions of approval.`,
    link: "https://www.nysenate.gov/legislation/laws/PBS/68"
  },
  {
    id: "art7",
    label: "Article VII transmission/pipeline siting",
    type: "process",
    sectors: ["electric", "gas"],
    blurb: `PSL Article VII: major intrastate transmission (125kV+/10+ miles, and large gas pipelines) needs
      a PSC Certificate of Environmental Compatibility and Public Need — a full evidentiary proceeding
      weighing need, environmental impact, and alternatives, which preempts most local approvals. Champlain
      Hudson Power Express and Clean Path NY were certificated this way. Since the RAPID Act, developers of
      major transmission can opt for the faster ORES route instead.`,
    link: "https://dps.ny.gov/article-vii"
  },
  {
    id: "art8-siting",
    label: "Article VIII renewable siting (ex-94-c)",
    type: "process",
    sectors: ["electric"],
    blurb: `The ORES one-stop permit for major renewables (and now transmission): uniform standards set by
      regulation, mandatory one-year decision deadline, host-community benefits, and authority to set aside
      local laws found unreasonably burdensome in light of CLCPA targets. Replaced the old Article 10
      siting board, which approved only a handful of projects in a decade.`,
    link: "https://dps.ny.gov/ores"
  },
  {
    id: "ces",
    label: "Clean Energy Standard / REC procurement",
    type: "process",
    sectors: ["electric"],
    blurb: `The PSC's 2016 Clean Energy Standard order (Case 15-E-0302), expanded in 2020 to match the CLCPA:
      load-serving entities must buy RECs reflecting rising renewable percentages. NYSERDA runs annual
      Tier 1 REC solicitations, offshore-wind OREC contracts, and Tier 4 (renewable delivery into NYC —
      CHPE). The CES also contains the ZEC (zero-emission credit) program subsidizing upstate nuclear
      plants through 2029. Costs flow to ratepayers via utility supply charges.`,
    link: "https://www.nyserda.ny.gov/All-Programs/Clean-Energy-Standard"
  },
  {
    id: "gasplanning",
    label: "Gas system planning & transition",
    type: "process",
    sectors: ["gas"],
    blurb: `The PSC's 2022 gas-planning framework (Case 20-G-0131) requires each gas utility to file long-term
      plans reconciling reliability with CLCPA emission limits — testing non-pipe alternatives before new
      mains, phasing down the "100-foot rule" (free service-line extensions; repeal proposed in the NY HEAT
      Act, which has passed the Senate but not the Assembly as of 2025). Moratoria (Westchester 2019,
      Brooklyn) showed what happens when supply and policy collide.`,
    link: "https://dps.ny.gov/gas-planning"
  },
  {
    id: "complaints",
    label: "Consumer complaints & enforcement",
    type: "process",
    sectors: ["electric", "gas", "steam", "water", "telecom"],
    blurb: `DPS runs the consumer complaint process (hotline + online; informal review, then formal
      hearing rights under HEFPA). Systemic failures escalate to enforcement: PSL §25/§25-a civil penalties,
      §66(2) management & operations audits (each big utility audited roughly every five years), prudence
      disallowances in rate cases, and — the nuclear option — certificate revocation (threatened against
      Charter in 2018). Storm-response investigations after Isaias (2020) produced record penalty
      settlements.`,
    link: "https://dps.ny.gov/complaints"
  },
  {
    id: "vder",
    label: "Net metering / VDER & distributed energy",
    type: "process",
    sectors: ["electric"],
    blurb: `How rooftop solar, community solar, and storage get paid. The PSC's Value of Distributed Energy
      Resources (VDER) "Value Stack" order (2017, Case 15-E-0751) replaced classic net metering for larger
      projects with components for energy, capacity, environmental value, and locational demand reduction.
      Mass-market rooftop solar keeps near-net-metering treatment plus a customer-benefit-contribution
      charge. NY-Sun (NYSERDA) layers incentives on top; community distributed generation made NY the
      national community-solar leader.`,
    link: "https://dps.ny.gov/value-distributed-energy-resources-vder"
  },
  {
    id: "reliability",
    label: "Reliability & storm oversight",
    type: "process",
    sectors: ["electric", "gas", "steam"],
    blurb: `DPS sets reliability metrics (SAIFI/CAIDI) with revenue adjustments for misses, approves utility
      emergency response plans (PSL §66(21)), audits storm performance, and oversees gas pipeline safety as
      FERC/PHMSA's state partner. After major storms the PSC opens investigations that can end in penalties
      or license-revocation proceedings. NYSRC (NY State Reliability Council) sets bulk-grid reliability
      rules that NYISO must follow — e.g., the NYC locational capacity requirement.`,
    link: "https://dps.ny.gov/electric-reliability"
  },
  {
    id: "energyplan",
    label: "State Energy Plan",
    type: "process",
    sectors: ["electric", "gas"],
    blurb: `Energy Law Article 6 requires a State Energy Planning Board (NYSERDA-staffed, agency heads as
      members) to adopt a comprehensive State Energy Plan and keep it current. Agency energy decisions are
      supposed to be consistent with the Plan. A new plan cycle launched in 2024–25 to reconcile CLCPA
      targets with reliability and affordability pressures (data-center load growth, offshore-wind cost
      resets).`,
    link: "https://energyplan.ny.gov/"
  }
];

// Edges: source, target, rel (short label shown on hover)
const LINKS = [
  // PSC / DPS core
  { source: "dps", target: "psc", rel: "staff arm; Chair is DPS CEO" },
  { source: "governor", target: "psc", rel: "appoints commissioners (Senate consent)" },
  { source: "senate-energy", target: "psc", rel: "confirms nominees; oversight" },
  { source: "psl", target: "psc", rel: "creates & empowers" },
  { source: "psl", target: "dps", rel: "creates & empowers" },
  { source: "ores", target: "dps", rel: "housed within (since RAPID Act)" },

  // PSC regulates utilities
  { source: "psc", target: "coned", rel: "sets rates, oversees" },
  { source: "psc", target: "nationalgrid", rel: "sets rates, oversees" },
  { source: "psc", target: "avangrid", rel: "sets rates, oversees" },
  { source: "psc", target: "centralhudson", rel: "sets rates, penalties" },
  { source: "psc", target: "water-utils", rel: "rate regulation (PSL Art 4-B)" },
  { source: "psc", target: "telecom", rel: "light-touch oversight" },
  { source: "psc", target: "escos", rel: "eligibility & marketing rules" },
  { source: "psc", target: "munis", rel: "limited jurisdiction" },

  // Processes run by PSC/DPS
  { source: "ratecase", target: "psc", rel: "decided by" },
  { source: "cpcn", target: "psc", rel: "issued by" },
  { source: "art7", target: "psc", rel: "certificates issued by" },
  { source: "art8-siting", target: "ores", rel: "administered by" },
  { source: "complaints", target: "dps", rel: "administered by" },
  { source: "reliability", target: "dps", rel: "monitored by" },
  { source: "vder", target: "psc", rel: "tariffs set by" },
  { source: "gasplanning", target: "psc", rel: "framework set by" },
  { source: "ces", target: "psc", rel: "ordered by" },
  { source: "ces", target: "nyserda", rel: "REC/OREC procurement by" },

  // Laws → processes
  { source: "psl", target: "ratecase", rel: "§§65–66, 11-month suspension" },
  { source: "psl", target: "cpcn", rel: "§68" },
  { source: "psl", target: "art7", rel: "Article VII" },
  { source: "psl", target: "complaints", rel: "Art 2 + §25 penalties" },
  { source: "hefpa", target: "complaints", rel: "consumer protections" },
  { source: "hefpa", target: "psl", rel: "is Article 2 of" },
  { source: "rapid", target: "art8-siting", rel: "re-codified as PSL Art VIII" },
  { source: "rapid", target: "ores", rel: "moved into DPS" },
  { source: "aregcba", target: "ores", rel: "created (Exec. Law §94-c)" },
  { source: "aregcba", target: "art8-siting", rel: "established regime" },
  { source: "clcpa", target: "ces", rel: "70×30 / 100×40 targets" },
  { source: "clcpa", target: "gasplanning", rel: "emission limits force transition" },
  { source: "clcpa", target: "cac", rel: "created" },
  { source: "clcpa", target: "psc", rel: "§7(2) consistency duty" },
  { source: "clcpa", target: "dec", rel: "co-implementer; Part 496 limits" },
  { source: "cac", target: "energyplan", rel: "Scoping Plan informs" },
  { source: "utenja", target: "gasplanning", rel: "thermal-network pilots" },
  { source: "utenja", target: "coned", rel: "pilot projects" },
  { source: "bpra", target: "nypa", rel: "renewables build mandate" },
  { source: "pal", target: "nypa", rel: "charters" },
  { source: "pal", target: "lipa", rel: "charters" },
  { source: "lipa-reform", target: "lipa", rel: "restructured" },
  { source: "lipa-reform", target: "dps", rel: "created LI review office" },

  // Authorities & operators
  { source: "governor", target: "nypa", rel: "appoints trustees" },
  { source: "governor", target: "lipa", rel: "appoints most trustees" },
  { source: "governor", target: "nyserda", rel: "appoints board" },
  { source: "lipa", target: "psegli", rel: "operating contract" },
  { source: "dps", target: "lipa", rel: "rate review & recommend (LI office)" },
  { source: "nypa", target: "munis", rel: "low-cost hydro allocations" },
  { source: "nyserda", target: "vder", rel: "NY-Sun incentives" },
  { source: "nyserda", target: "energyplan", rel: "staffs planning board" },
  { source: "ratecase", target: "nyserda", rel: "ratepayer surcharges fund" },

  // Federal / markets
  { source: "ferc", target: "nyiso", rel: "regulates tariffs & markets" },
  { source: "ferc", target: "nypa", rel: "hydro licensing" },
  { source: "nyiso", target: "coned", rel: "wholesale supply via markets" },
  { source: "nyiso", target: "reliability", rel: "bulk-grid planning studies" },
  { source: "dec", target: "ferc", rel: "CWA §401 leverage over pipelines" },
  { source: "art7", target: "nationalgrid", rel: "pipeline/transmission siting" },

  // Oversight
  { source: "ag", target: "ratecase", rel: "intervenes for the People" },
  { source: "uiu", target: "ratecase", rel: "intervenes for ratepayers" },
  { source: "ag", target: "escos", rel: "consumer-protection enforcement" },
  { source: "comptroller", target: "nypa", rel: "audits" },
  { source: "comptroller", target: "lipa", rel: "audits" },
  { source: "comptroller", target: "dps", rel: "audits oversight performance" },
  { source: "abo", target: "nypa", rel: "governance oversight" },
  { source: "abo", target: "lipa", rel: "governance oversight" },
  { source: "abo", target: "nyserda", rel: "governance oversight" },
  { source: "senate-energy", target: "psl", rel: "amends" },
  { source: "assembly-energy", target: "psl", rel: "amends" },
  { source: "senate-energy", target: "clcpa", rel: "enacted (2019)" },
  { source: "assembly-energy", target: "clcpa", rel: "enacted (2019)" },

  // Utility ↔ process touchpoints
  { source: "coned", target: "ratecase", rel: "files cases" },
  { source: "nationalgrid", target: "gasplanning", rel: "long-term gas plans" },
  { source: "avangrid", target: "complaints", rel: "billing enforcement target" },
  { source: "centralhudson", target: "complaints", rel: "2021 billing penalties" },
  { source: "psegli", target: "reliability", rel: "Isaias storm review" },
  { source: "escos", target: "ces", rel: "REC obligations as LSEs" },
  { source: "water-utils", target: "ratecase", rel: "files cases" }
];
