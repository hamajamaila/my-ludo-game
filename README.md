# 🎲 Ludo Game

A complete, interactive Ludo game built with vanilla HTML, CSS, and JavaScript. Play against up to 3 other players on a single board.

## Features

✨ **Complete Gameplay**
- 4 players (Red, Yellow, Blue, Green)
- 4 pieces per player
- Full turn-based mechanics
- Dice rolling system

🎮 **Game Mechanics**
- Roll dice to move pieces
- Roll a 6 to bring a piece out from home
- Roll a 6 to get another turn
- Capture opponent pieces by landing on the same square
- Move pieces to the home position to win
- First player to get all pieces home wins!

🎨 **User Interface**
- Beautiful gradient design
- Responsive layout for all devices
- Interactive board with clickable pieces
- Real-time player indicator
- Game rules modal
- Winner announcement

📱 **Responsive Design**
- Works perfectly on desktop, tablet, and mobile
- Touch-friendly interface
- Canvas-based graphics for smooth performance

## How to Play

1. **Start the Game**: Open `index.html` in your web browser
2. **Roll the Dice**: Click the "Roll Dice" button to get a random number (1-6)
3. **Move a Piece**: 
   - To bring a piece out from home, you need to roll a 6
   - Click on a piece to move it by the number shown on the dice
4. **Game Rules**:
   - Each player takes turns rolling the dice
   - Rolling a 6 gives you another turn
   - If you land on an opponent's piece, it goes back to their home
   - First player to get all 4 pieces to the center wins
5. **New Game**: Click "New Game" to reset and play again

## File Structure

```
my-ludo-game/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── script.js       # Game logic and mechanics
└── README.md       # Documentation
```

## How It Works

### HTML (index.html)
- Canvas element for rendering the game board
- Game controls and dice roller
- Modals for rules and winner announcement

### CSS (styles.css)
- Beautiful gradient background
- Responsive grid layout
- Animated buttons and modals
- Color-coded player indicators

### JavaScript (script.js)
- `LudoGame` class managing all game logic
- Piece movement and validation
- Dice rolling mechanics
- Winner detection
- Canvas rendering for board and pieces

## Features Breakdown

### Game Board
- Circular 52-position board layout
- Home areas for each player (corners)
- Central home position
- Visual indicators for all positions

### Piece Management
- Each player starts with 4 pieces in their home area
- Pieces can be at home (-1), on the board (0-51), or in the win position (52)
- Real-time position tracking and rendering

### Turn System
- Turn-based gameplay
- Automatic player rotation
- Extra turns for rolling a 6
- Disabled controls for non-current player

### Win Condition
- First player to move all 4 pieces to the center wins
- Game ends immediately upon winning
- Winner announcement modal with "Play Again" option

## Technical Implementation

### Canvas Rendering
- 600x600px canvas for smooth graphics
- 52 positioned board squares
- Real-time redraw on state changes

### Collision Detection
- Click detection for piece selection
- Distance calculation for accurate picking
- Piece capture on landing detection

### Game State Management
- Piece positions tracked in object structure
- Current player index for turn management
- Dice value persistence for move calculation
- Game active flag for win condition

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Customization

You can easily customize:
- Player colors in `playerColors` object
- Board radius and positions
- Piece size and appearance
- Button styling and colors
- Background gradient

## Future Enhancements

Possible additions:
- AI players for single-player mode
- Sound effects and animations
- Undo move functionality
- Game statistics tracking
- Online multiplayer
- Custom board themes

## License

This game is free to use and modify for personal and educational purposes.

---

**Enjoy playing Ludo! 🎉**