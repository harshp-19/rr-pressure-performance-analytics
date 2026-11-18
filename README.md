# RR Pressure Performance Analytics

A responsive cricket analytics dashboard developed for **Rajasthan Royals SupeRR Selector Season 2, Round 1**. It presents recorded high-leverage chase performance and shows how to interpret rankings, uncertainty, and squad fit for IPL 2027 auction planning.

[Open the deployed dashboard](https://rr-pressure-performance-s2.wirylynx6.chatgpt.site)

This source distribution runs on a clearly labelled fictional demo. It contains no competition Data Pack, match-level inputs, audited player ratings, recruitment records, reports, or presentation files. The deployed competition dashboard is a separate build. This repository contains the presentation layer and does not reproduce the underlying analysis.

## Features

| Section | What it shows |
| --- | --- |
| Overview | Match coverage, pressure definition, and compact batting and bowling leaderboards |
| Batters | Composite scores, exposure, strike rate, dismissals and bootstrap selection frequency |
| Bowlers | Composite scores, exposure, economy, wickets and bootstrap selection frequency |
| Methodology | Win probability, leverage, scoring, shrinkage, bootstrap and a role-specific sensitivity table |
| Uncertainty | Historical ranking, bootstrap stability and split-half repeatability |
| Recruitment | Role fit, retention considerations, conditional options and a separate finisher example |
| Sources | Availability labels and a linked source register |

## Technology

- HTML5, CSS and vanilla JavaScript in a modern browser
- Python 3 standard-library HTTP server for local development
- Static hosting with no build step, package installation, external assets or API credentials

## Project structure

```text
.
├── .gitignore
├── README.md
├── requirements.txt
└── site/
    ├── index.html      # Application entry point and section markup
    ├── styles.css      # Layout, typography and responsive styles
    ├── dashboard.js   # Tables, charts, navigation and interactions
    └── demo-data.js   # Fictional fixtures generated for this distribution
```

## Run locally

Install Python 3 if needed. In the repository root, run:

```sh
python -m http.server 8000 --bind 127.0.0.1 --directory site
```

Use `py -3` on Windows or `python3` on macOS/Linux if `python` is unavailable. Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) and look for the **Synthetic demo** notice. Stop the server with Ctrl+C. To deploy the demo to a static host, serve the contents of `site/` with `index.html` at the web root.

## Data and screenshots

The demo fixture is suitable for public use. Keep any authorized competition data outside this checkout. Use only screenshots taken from the fictional demo when sharing this source repository.

## Screenshots

These screenshots show the fictional demo.

- [Desktop overview](screenshots/desktop-overview.png)
- [Desktop rankings](screenshots/desktop-rankings.png)
- [Mobile overview](screenshots/mobile-overview.png)
