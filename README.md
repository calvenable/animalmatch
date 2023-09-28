# animalmatch

Animal Match is a simple pair-matching memory game where the player turns over pairs of cards and tries to find matching animals. This game is implemented in pure JavaScript using localStorage for leaderboards, so can easily be cheated using the console or modifying web elements, but short of a server-client implementation this is unavoidable. It's still fun to play!

## Notes for use

There are four gamemodes: classic (finding pairs of animals), 3-match (still 12 unique animals, but there are 3 of each), and 4-match and 6-match in the same vein. Of course these get progressively harder.

Player highscores are stored in a leaderboard for each gamemode. Names are limited to exactly 3 characters long, reminiscent of old videogame leaderboards.

On the menu page there is the option to align cards in a grid. This generally makes playing the game easier, so a star is left by the player's name on the leaderboard to indicate this assistance was used.