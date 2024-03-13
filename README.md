# 1D-Game
A first-person game from the perspective of a 2D life form, which makes it a 1D game. Try to make it to level 5 without getting a headache!

This project has some of the most messy code that I've written in recent years, but I've already spent too much time on it.

You probably shouldn't play if you are sensitive to flashing colors, especially on the "trippy" setting.

You can play it in your browser by clicking on [this link](https://mashpoe.github.io/1D-Game).

## Controls
Run `cd nodeSocketArduino` in the terminal to move into the nodeSocketArduino folder and run `node app.js` to start the server for connecting the controller to the game. Modify the name of your Arduino device if you need to. Then, open the game in your browser (ideally with the VS Code Live Server extension) and use the arrow keys to move. You can also use the mouse to click on the buttons.

## Important
To run this game, you need to open it in Google Chrome. Safari and Brave (which is Chromium-based) will not work, as they block certain requests.

## State Diagram
                                     ┌──────────────────┐
                                     │   INITIALIZATION │
                                     └──────────────────┘
                                               │
                                               ▼
                                     ┌──────────────────┐
                                     │    GAME RUNNING  │──────────────────────────────┐
                                     └──────────────────┘                              │
                                              │  ▲                                     │
                Player Health > 0             │  │ Player Health <= 0                  │
          ┌─────────────┴────────────────┐    │  │                                     │
          │                              │    │  │                                     │
          ▼                              │    │  │                                     │
  ┌──────────────────┐                   │    │  │                                     │
  │    PLAYER MOVE   │<────Key Press─────┘    │  │                                     │
  └──────────────────┘                        │  │                                     │
          │                                   │  │                                     │
          │                                   │  │                                     │
          │                                   │  │                                     │
 Collectible Found                            │  │                                     │
          │                                   │  │                                     │
          │                                   │  │                                     │
          ▼                                   │  │                                     │
  ┌──────────────────┐                        │  │                                     │
  │  COLLECT ITEM    │                        │  │                                     │
  └──────────────────┘                        │  │                                     │
          │                                   │  │                                     │
    Items < 3                                 │  │                                     │
          │                                   │  │                                     │
          │                                  │  │                                     │
          │                                  │  │                                     │
          │                                  │  │                                     │
          │                                  │  │                                     │
          ▼                                  │  │                                     │
  ┌──────────────────┐                       │  │                                     │
  │  PLAYER COLLIDE  │                       │  │                                     │
  └──────────────────┘                       │  │                                     │
          │                                  │  │                                     │
          │                                  │  │                                     │
          ▼                                  │  │                                     │
  ┌──────────────────┐                       │  │                                     │
  │   ENEMY SHOT     │                       │  │                                     │
  └──────────────────┘                       │  │                                     │
          │                                  │  │                                     │
          │                                  │  │                                     │
          ▼                                  │  │                                     │
  ┌──────────────────┐                       │  │                                     │
  │     GAME OVER    │<──────────────────────┘  └─────────────────────────────────────┘
  └──────────────────┘
          ▲
          │
          │
          │
          │
          │
    Items = 3
          │
          │
          │
          │
          │
          ▼
  ┌──────────────────┐
  │      VICTORY     │
  └──────────────────┘
