# Rona Collector

Hullo 👋

This main goal of this repo is to speed up the claiming of unemployment benefits in New York

**IMPORTANT**

First step is to signup for an account on the Department Of Labor's website https://dol.ny.gov/

Create `.env` file with the login credentials using the `.env.example` file as the format.

There's two scripts:

- new-claim.js - create a new claim. Should only need to run once.
- weekly-claim.js - submit the weekly claim form. Can we placed on a schedule to run on Sundays when the claim can be certified

### Prerequisites

NodeJS and NPM - https://nodejs.org/en/

### Installing

Install the dependencies

```
npm install
```

### Instructions

Sign up for new claim

```
node new-claim.js
```

Certify Weekly claim

```
node weekly-claim.js
```
