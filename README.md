# animalmatch

Animal Match is a simple pair-matching memory game where the player turns over pairs of cards and tries to find matching animals. This game is implemented in pure JavaScript using localStorage for leaderboards, so can easily be cheated using the console or modifying web elements, but short of a server-client implementation this is unavoidable. It's still fun to play!

## Install instructions
1. Clone / download & extract the repository to a location of your choice, say `C:/Documents/Git/animalmatch`.
2. Open your browser of choice and enter `<folderUrl>/page.html` in the address bar. In my case that's `C:/Documents/Git/animalmatch/page.html`

And voila! You're all set to start matching animals.

## Notes for use

There are four gamemodes:
 - classic (finding pairs of animals)
 - 3-match (still 12 unique animals, but there are 3 of each)
 - 4-match (4 of each animal)
 - 6-match (you guessed it: 6 of each animal to find)

Naturally,these get progressively harder.

Player highscores are stored in a leaderboard for each gamemode. Names are limited to exactly 3 characters long, reminiscent of old-school videogame leaderboards.

On the menu page there is the option to align cards in a grid. This generally makes playing the game easier, so a star is left by the player's name on the leaderboard to indicate this assistance was used.
