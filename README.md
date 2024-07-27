This project maintains data on base sizes of models in Warhammer Age of Sigmar, and serves that data as a web application using next.js

- [basedesires.com](https://basedesires.com/) for Age of Sigmar
- [tow.basedesires.com](https://tow.basedesires.com/) for The Old World


## Getting Started

Create a `.env.local` file (not under version control due to `.gitignore` rule) to handle local config.
```bash
cp .env.local.example .env.local
```

Install js dependencies with Yarn.
```bash
yarn
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.


## Deployment

I use Vercel for hosting, but anything that can run a Node application will work.

Just make sure to set the `NEXT_PUBLIC_GAME` environment variable (that your `.env.local` provides locally) in your hosting environment. Its values are `aos` or `tow` (it being absent is partially-supported: you will get aos data but without some aos-specific interface elements).


## Data

### The Old World
Maintenance of data for The Old World is entirely manual. The data files live in `data/tow/profiles/`.

### Age of Sigmar
This repo contains a copy of the Battle Profiles pdf.

Run the pdf parsing script to extract the base sizes from the pdf
```bash
yarn parse-pdf
```
#### Battle profiles
This will populate (overwrite) the files in `data/aos/profiles` with profiles from the main Battle Profiles section of the pdf.

#### Legends
It will also populate (overwrite) the `data/aos/legends.txt` file, which is not under version control. This file is not used by the application, but is a convenience to assist when manually populating the files in the `data/aos/legends/` directory.

This part of the process is not fully automated because the underlying structure of the Legends section of the pdf is chaotic and a reliable relationship between faction name titles and the profiles visually below them cannot easily be established.

#### Unlisted and fan-made
The files in `data/aos/unlisted` and `data/aos/fan-made` are entirely under manual control and have no direct current source document: unlike the profiles and legends, they are their own authorities.
