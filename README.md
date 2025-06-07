This project maintains data on base sizes of models in Warhammer games, and serves that data as a web application using next.js

- [basedesires.com](https://basedesires.com/) for Age of Sigmar
- [40k.basedesires.com](https://40k.basedesires.com/) for 40k
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

Just make sure to set the `NEXT_PUBLIC_GAME` environment variable (that your `.env.local` provides locally) in your hosting environment. Its values are `aos`, `40k`, or `tow` (it being absent should default nicely to AoS, but it's better to be explicit).


## Data

### The Old World
Maintenance of data for The Old World is entirely manual. The data files live in `data/tow/profiles/`.

### Age of Sigmar
This repo contains a copy of the Battle Profiles pdf.

Run the pdf parsing script to extract the base sizes from the pdf
```bash
export NEXT_PUBLIC_GAME=aos && yarn parse-pdf
```
(Doesn't use the `.env.local` file when running this command so we have to set the env var ourselves like this)

The `aosSources` object in `utils/env.ts` contains string values to display as the source of imported profiles and should be updated whenever a new version of the Battles profile is imported.

#### Battle profiles
This will populate (overwrite) the files in `data/aos/profiles` with profiles from the main Battle Profiles section of the pdf.

#### Legends
It will also populate (overwrite) the `data/aos/legends.txt` file, which is not under version control. This file is not used by the application, but is a convenience to assist when manually populating the files in the `data/aos/legends/` directory.

This part of the process is not fully automated because the underlying structure of the Legends section of the pdf is chaotic and a reliable relationship between faction name titles and the profiles visually below them cannot easily be established.

However, a script is provided to compare Legends entries extracted from the pdf during import with those in the manually-maintained data to allow the maintainer to identify discrepancies
```bash
export NEXT_PUBLIC_GAME=aos && yarn check-legends
```

#### Unlisted profiles
The files in `data/aos/unlisted` are entirely under manual control and have no direct current source document: unlike the profiles and legends, they are their own authorities. Profiles can be put in here for models that never got an official battle profile listing and those that have been removed.

#### Corrections and notes
The `data/aos/corrections.txt` and `data/aos/notes.txt` files contain manually-maintained changes that the site will apply to entries from the `data/aos/profiles` directory at run time. This allows the importer to fetch legitimate changes from the pdf without causing merge conflicts when we want to maintain corrections or notes on entries.

The listings in `corrections.txt` replace any imported profile that matches their name. There is no concept of factions in this: all corrections live in this one file and are matched entirely on name.

The listings in `notes.txt` have no base size themselves. Their entries are a name and a set of notes, the latter of which is appended to any imported profile that matches their name. There is no concept of factions in this: all corrections live in this one file and are matched entirely on name.

### Warhammer 40,000
This repo contains a copy of the Chapter Approved Tournament Companion pdf.

Run the pdf parsing script to extract the base sizes from the pdf
```bash
export NEXT_PUBLIC_GAME=40k && yarn parse-pdf
```
(Doesn't use the `.env.local` file when running this command so we have to set the env var ourselves like this)
#### Battle profiles
This will populate (overwrite) the files in `data/40k/profiles` with profiles from the main Battle Profiles section of the pdf.

#### Unlisted profiles
The files in `data/40k/unlisted` are entirely under manual control and have no direct current source document: unlike the profiles, they are their own authorities. Profiles can be put in here for models that never got an official battle profile listing and those that have been removed.

#### Corrections and notes
The `data/40k/corrections.txt` and `data/40k/notes.txt` files contain manually-maintained changes that the site will apply to entries from the `data/40k/profiles` directory at run time. This allows the importer to fetch legitimate changes from the pdf without causing merge conflicts when we want to maintain corrections or notes on entries.

The listings in `corrections.txt` replace any imported profile that matches their name. There is no concept of factions in this: all corrections live in this one file and are matched entirely on name.

The listings in `notes.txt` have no base size themselves. Their entries are a name and a set of notes, the latter of which is appended to any imported profile that matches their name. There is no concept of factions in this: all corrections live in this one file and are matched entirely on name.
