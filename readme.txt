My goals for this project was to create a space themed game in which you save astronauts. The player, represented by a space ship has to collect random number of astronauts to achieve an end state.

For legibility I've organized the order of the code into global variables at the top, next the functions that are object creators, the functions that constantly run and at the bottom the more auxiliary functions.

Currently with ver6, the game will end on a screen that lets the player know they've achieved their goal. There is also a tracker at the top right corner that increases each time you've saved an astronaut. What I wanted my final version to include was the ship to fly to the top, off screen, on the win state. However I haven't been able to get it to move the way I want.

Known bugs, in ver5 are fixed in ver6 with the exception of being unable to repopulate the screen with astronauts should the player miss all 5 that are generated. The astronauts getting stuck on spawn was fixed through applying a range in which the function astronautStart() produces the points that the astronauts should start.
