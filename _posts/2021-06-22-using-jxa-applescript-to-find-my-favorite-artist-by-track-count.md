---
title: Using JavaScript for Automation (JXA) to Find My Favorite Artist by Track Count
date: 2021-06-22T01:33:08-06:00
author: n8henrie
layout: post
permalink: /2021/06/using-jxa-applescript-to-find-my-favorite-artist-by-track-count/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- applescript
- iTunes
- javascript
- MacOS
---
**Bottom Line:** This JXA script finds my favorite artist by track count in
my iTunes (ahem Music.app) "My Top Rated" playlist.
<!--more-->

I had the idea a couple weeks ago to go through the 600+ songs in my iTunes "My
Top Rated" playlist tally up the artists to see which were most represented.

While I know very little JavaScript, I certainly find it *much* preferable to
use as compared to AppleScript, and I was able to whip this up in an hour or so
in spite of atrocious documentation.

Unfortunately, I think Apple may kill off JXA in the upcoming years, but it is
pretty handy for the time being.

```javascript
(() => {
    const music = Application("Music")
    
    // `doShellScript` gives a permission error if I try to run it from
    // anything other than `Application.currentApplication()`
    const app = Application.currentApplication()
    app.includeStandardAdditions = true

    let myTopRated = music.playlists.whose({
        name: {
            _equals: "My Top Rated"
        }
    })[0]

    var scorecard = {}
    for (track of myTopRated.tracks()) {
        let artist = track.artist()
        // var albArtist = track.albumArtist()

        let score = scorecard[artist] || 0
        scorecard[artist] = score + 1
    }
    
    // Convert object into array of [Artist, Count]
    var entries = Object.entries(scorecard)
    
    // Reverse sort by favorite count
    entries.sort((a, b) => b[1] - a[1])
    let output = entries.map(entry => entry[0] + ": " + entry[1]).join("\n")
    app.doShellScript("cat <<'EOF' > ~/Desktop/MusicFavs.txt\n" + output + "\nEOF\n")
})()
```

My results:

```
Porcupine Tree: 35
Muse: 26
Opeth: 15
Eve 6: 13
Incubus: 13
Red Hot Chili Peppers: 13
Dave Matthews Band: 12
My Chemical Romance: 12
Yellowcard: 12
Fall Out Boy: 10
Green Day: 10
Jay-Z: 9
Rise Against: 9
3oh!3: 9
Breaking Benjamin: 8
The Offspring: 8
Eminem: 7
Goo Goo Dolls: 7
blink-182: 7
Matchbook Romance: 7
Weezer: 7
Chevelle: 6
Dr. Dre: 6
Fair to Midland: 6
Good Charlotte: 6
Jimmy Eat World: 6
New Found Glory: 6
Nirvana: 6
Something Corporate: 6
Third Eye Blind: 6
Marilyn Manson: 5
A Perfect Circle: 5
Staind: 5
Sum 41: 5
Coldplay: 5
AFI: 4
The Bloodhound Gang: 4
Foo Fighters: 4
Kanye West: 4
Maroon 5: 4
The Red Jumpsuit Apparatus: 4
Styx: 4
Ben Harper: 4
311: 3
Adema: 3
The All-American Rejects: 3
James Blake: 3
Dashboard Confessional: 3
Deftones: 3
FloBots: 3
Linkin Park: 3
Ludo: 3
Saliva: 3
Sugar Ray: 3
50 Cent: 3
Bush: 3
Fiel a La Vega: 3
The Ataris: 2
Buckcherry: 2
Cake: 2
Dido: 2
Earshot: 2
Estelle Feat Kanye West: 2
Fort Minor: 2
Fountains of Wayne: 2
Frédéric Chopin: 2
Gerry Rafferty: 2
Jack Johnson: 2
James Blunt: 2
Jonny Lang: 2
La Secta Allstar: 2
Limp Bizkit: 2
Nickelback: 2
Nine Inch Nails: 2
Panic! at the Disco: 2
The Presidents of the United States of America: 2
Rammstein: 2
Seal: 2
Sick Puppies: 2
Static-X: 2
Sublime: 2
Train: 2
Twista: 2
Vertical Horizon: 2
3 Doors Down: 2
3OH!3: 2
Adele: 2
Lady GaGa: 2
Rage Against the Machine: 2
Simple Plan: 2
Steven Wilson: 2
Stone Temple Pilots: 2
Yann Tiersen: 2
Zac Brown Band: 2
A Great Big World: 1
Alien Ant Farm: 1
alt-J (?): 1
Amber Pacific: 1
Anberlin: 1
Asher Roth: 1
Atlas Genius: 1
Awolnation: 1
Band of Horses: 1
Bat Wings For Lab Rats: 1
Big & Rich: 1
Bill Withers: 1
The Black Keys: 1
Blessid Union of Souls: 1
Blur: 1
Boys Like Girls: 1
Break of Reality: 1
Creed: 1
Days of the New: 1
Death Cab For Cutie: 1
Director: 1
Disturbed: 1
The Downtown Fiction: 1
Dream Theater: 1
The Eagles: 1
Elle Varner: 1
F5: 1
Far East Movement: 1
Fastball: 1
Fleetwood Mac: 1
The Fray: 1
Giuseppe Verdi: 1
Grouplove: 1
Herbie Hancock: 1
Howard Shore: 1
Ice Cube: 1
Jars of Clay: 1
Jason Mraz & Colbie Caillat: 1
Johann Sebastian Bach: 1
John Mayer Trio: 1
Kansas: 1
Kelly Clarkson: 1
Kenny Chesney: 1
Alicia Keys: 1
Killaflaw: 1
Lit: 1
Lmfao: 1
Look Mom No Hands: 1
Marc Anthony: 1
Matt Nathanson: 1
John Mayer: 1
MGMT: 1
Michael Jackson: 1
Monchy & Alexandra: 1
Nelly: 1
Notorious B.I.G.: 1
The Notwist: 1
P!nk: 1
Peach: 1
Phantom Planet: 1
Pink Floyd: 1
The Pixies: 1
Rascal Flatts: 1
Rob Dougan: 1
Rob Zombie: 1
The Roots: 1
Santana: 1
Silversun Pickups: 1
Simon & Garfunkel: 1
Smash Mouth: 1
Straylight Run: 1
System of a Down: 1
T.I.: 1
Taking Back Sunday: 1
Thrice: 1
Trapt: 1
Trey Songz: 1
The Verve Pipe: 1
Wolfgang Amadeus Mozart: 1
Ying Yang Twins: 1
10 Years: 1
Alanis Morissette: 1
Arcade Fire: 1
Barenaked Ladies: 1
Ben Howard: 1
James Blake feat. RZA: 1
The Blank Theory: 1
Bone Thugs-N-Harmony: 1
Michael Bublé: 1
The Butterfly Effect: 1
Chumbawamba: 1
Collective Soul: 1
Cursive: 1
Daft Punk feat. Pharrell Williams: 1
Daphni: 1
Daylight Dies: 1
Everclear: 1
BBMak: 1
Finch: 1
Franz Ferdinand: 1
Franz Schubert: 1
G-Unit: 1
Godsmack: 1
Gotye: 1
Hit the Lights: 1
Hoobastank: 1
In Flames: 1
Jack Johnson, Dave Matthews & Tim Reynolds: 1
Jon Boden & Sam Sweeney & Ben Coleman: 1
Semisonic: 1
The Killers: 1
Led Zeppelin: 1
Lunatic Calm: 1
Lynyrd Skynyrd: 1
Mumford & Sons: 1
Nitty: 1
Parker Ainsworth & Butch Walker & Paris Jackson & Jessie Payo: 1
Propellerheads: 1
Puddle of Mudd: 1
Pyotr Ilyich Tchaikovsky: 1
Queens Of The Stone Age: 1
Radiohead: 1
Mark Ronson feat. Bruno Mars: 1
The Smashing Pumpkins: 1
Sugarcult: 1
Taylor Swift: 1
Symphony X: 1
Thirty Stones: 1
Vega4: 1
The Wallflowers: 1
The Whitest Boy Alive: 1
Zero 7: 1
2Pac / Bone Thugs-N-Harmony: 1
Chris Hodges: 1
Sam Hart: 1
Fuel: 1
```
