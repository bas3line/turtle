# Security

Please don't report security problems in a public issue. Use GitHub's private reporting instead: [report a vulnerability](https://github.com/bas3line/turtle/security/advisories/new). It reaches [@bas3line](https://github.com/bas3line) directly.

turtle's site is a static page: it takes no input it sends anywhere, stores nothing and calls no API. The install commands on it point at the reserved `.example` domain, so they can't fetch or run anything. Reports about anything that could run someone else's code on the page, or about a dependency with a known hole, are especially welcome.

Fixes land on `main` and go live with the next deploy.
