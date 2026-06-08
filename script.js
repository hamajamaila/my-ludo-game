// Ludo Game Implementation
class LudoGame {
    constructor() {
        this.canvas = document.getElementById('gameBoard');
        this.ctx = this.canvas.getContext('2d');
        this.players = ['red', 'yellow', 'blue', 'green'];
        this.playerColors = {
            red: '#ff4444',
            yellow: '#ffdd44',
            blue: '#4444ff',
            green: '#44dd44'
        };
        this.currentPlayerIndex = 0;
        this.diceValue = 0;
        this.gameActive = true;
        this.diceRolled = false;
        this.selectedPiece = null;
        
        // Initialize pieces positions
        // -1 means in home, 0-51 means on board, 52 means in home/win
        this.pieces = {
            red: [-1, -1, -1, -1],
            yellow: [-1, -1, -1, -1],
            blue: [-1, -1, -1, -1],
            green: [-1, -1, -1, -1]
        };

        this.boardPositions = this.generateBoardPositions();
        this.setupEventListeners();
        this.draw();
    }

    setupEventListeners() {
        document.getElementById('diceBtn').addEventListener('click', () => this.rollDice());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('rulesBtn').addEventListener('click', () => this.showRules());
        document.querySelector('.close').addEventListener('click', () => this.closeRules());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        window.addEventListener('click', (e) => this.handleWindowClick(e));
    }

    generateBoardPositions() {
        // Generate 52 positions around the board in a circular pattern
        const positions = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 200;

        for (let i = 0; i < 52; i++) {
            const angle = (i / 52) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            positions.push({ x, y });
        }

        return positions;
    }

    rollDice() {
        if (!this.gameActive || this.diceRolled) return;

        this.diceValue = Math.floor(Math.random() * 6) + 1;
        document.getElementById('diceValue').textContent = this.diceValue;
        this.diceRolled = true;
        document.getElementById('diceBtn').disabled = true;

        // Show which pieces can be moved
        this.highlightMovablePieces();
        this.draw();
    }

    highlightMovablePieces() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const pieces = this.pieces[currentPlayer];

        for (let i = 0; i < pieces.length; i++) {
            const pos = pieces[i];
            // Can move if: piece is in home and rolled 6, or piece is on board
            if ((pos === -1 && this.diceValue === 6) || (pos >= 0 && pos < 52)) {
                // This piece can be moved
            }
        }
    }

    handleCanvasClick(e) {
        if (!this.gameActive || !this.diceRolled) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const currentPlayer = this.players[this.currentPlayerIndex];
        const pieces = this.pieces[currentPlayer];

        for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i];
            const canMove = (piece === -1 && this.diceValue === 6) || (piece >= 0 && piece < 52);

            if (!canMove) continue;

            const pos = piece === -1 ? this.getHomePosition(i, currentPlayer) : this.boardPositions[piece];
            const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

            if (distance < 15) {
                this.movePiece(i, currentPlayer, piece);
                return;
            }
        }
    }

    movePiece(pieceIndex, player, currentPos) {
        const newPos = currentPos === -1 ? this.diceValue - 1 : Math.min(currentPos + this.diceValue, 52);

        if (newPos >= 52) {
            this.pieces[player][pieceIndex] = 52; // Win position
            this.checkWinner();
        } else {
            // Check for capture
            this.captureOpponentPiece(newPos, player);
            this.pieces[player][pieceIndex] = newPos;
        }

        // Reset for next turn
        this.diceRolled = false;
        document.getElementById('diceValue').textContent = '-';
        document.getElementById('diceBtn').disabled = false;

        // Check if rolled 6, if not, move to next player
        if (this.diceValue !== 6) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
        }

        this.updateCurrentPlayer();
        this.draw();
    }

    captureOpponentPiece(position, currentPlayer) {
        for (const player of this.players) {
            if (player === currentPlayer) continue;

            for (let i = 0; i < this.pieces[player].length; i++) {
                if (this.pieces[player][i] === position) {
                    this.pieces[player][i] = -1; // Send back to home
                }
            }
        }
    }

    checkWinner() {
        for (const player of this.players) {
            if (this.pieces[player].every(pos => pos === 52)) {
                this.gameActive = false;
                this.showWinner(player);
                return true;
            }
        }
        return false;
    }

    showWinner(player) {
        const playerName = player.charAt(0).toUpperCase() + player.slice(1);
        document.getElementById('winnerText').textContent = `${playerName} Player Wins! 🎉`;
        document.getElementById('winnerModal').style.display = 'block';
    }

    getHomePosition(pieceIndex, player) {
        const homePositions = {
            red: [{ x: 50, y: 50 }, { x: 50, y: 80 }, { x: 80, y: 50 }, { x: 80, y: 80 }],
            yellow: [{ x: this.canvas.width - 50, y: 50 }, { x: this.canvas.width - 50, y: 80 }, { x: this.canvas.width - 80, y: 50 }, { x: this.canvas.width - 80, y: 80 }],
            blue: [{ x: this.canvas.width - 50, y: this.canvas.height - 50 }, { x: this.canvas.width - 50, y: this.canvas.height - 80 }, { x: this.canvas.width - 80, y: this.canvas.height - 50 }, { x: this.canvas.width - 80, y: this.canvas.height - 80 }],
            green: [{ x: 50, y: this.canvas.height - 50 }, { x: 50, y: this.canvas.height - 80 }, { x: 80, y: this.canvas.height - 50 }, { x: 80, y: this.canvas.height - 80 }]
        };
        return homePositions[player][pieceIndex];
    }

    updateCurrentPlayer() {
        const playerName = this.players[this.currentPlayerIndex].charAt(0).toUpperCase() + 
                          this.players[this.currentPlayerIndex].slice(1);
        const playerElement = document.getElementById('currentPlayer');
        playerElement.textContent = playerName;
        playerElement.className = 'player-name ' + this.players[this.currentPlayerIndex] + '-player';
    }

    draw() {
        this.ctx.fillStyle = '#f9f9f9';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw board
        this.drawBoard();

        // Draw pieces
        this.drawPieces();
    }

    drawBoard() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw outer circle
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 200, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Draw board positions
        this.boardPositions.forEach((pos, index) => {
            this.ctx.fillStyle = index % 2 === 0 ? '#e0e0e0' : '#f0f0f0';
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.strokeStyle = '#999';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });

        // Draw home areas
        this.drawHomeArea(10, 10, '#ff4444', 'Red');
        this.drawHomeArea(this.canvas.width - 90, 10, '#ffdd44', 'Yellow');
        this.drawHomeArea(this.canvas.width - 90, this.canvas.height - 90, '#4444ff', 'Blue');
        this.drawHomeArea(10, this.canvas.height - 90, '#44dd44', 'Green');

        // Draw center
        this.ctx.fillStyle = '#ccc';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('HOME', centerX, centerY);
    }

    drawHomeArea(x, y, color, label) {
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillRect(x, y, 80, 80);
        this.ctx.globalAlpha = 1;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, 80, 80);
    }

    drawPieces() {
        for (const player of this.players) {
            const pieces = this.pieces[player];
            const color = this.playerColors[player];

            pieces.forEach((pos, index) => {
                let x, y;

                if (pos === -1) {
                    // In home
                    const homePos = this.getHomePosition(index, player);
                    x = homePos.x;
                    y = homePos.y;
                } else if (pos === 52) {
                    // In win position (center)
                    const offset = (index - 1) * 15 - 15;
                    x = this.canvas.width / 2 + offset;
                    y = this.canvas.height / 2;
                } else {
                    // On board
                    const boardPos = this.boardPositions[pos];
                    x = boardPos.x;
                    y = boardPos.y;
                }

                // Draw piece
                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
                this.ctx.fill();

                // Draw border
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Draw piece number
                this.ctx.fillStyle = player === 'yellow' ? '#000' : '#fff';
                this.ctx.font = 'bold 8px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText((index + 1).toString(), x, y);
            });
        }
    }

    resetGame() {
        this.pieces = {
            red: [-1, -1, -1, -1],
            yellow: [-1, -1, -1, -1],
            blue: [-1, -1, -1, -1],
            green: [-1, -1, -1, -1]
        };
        this.currentPlayerIndex = 0;
        this.diceValue = 0;
        this.gameActive = true;
        this.diceRolled = false;
        document.getElementById('diceValue').textContent = '-';
        document.getElementById('diceBtn').disabled = false;
        document.getElementById('winnerModal').style.display = 'none';
        this.updateCurrentPlayer();
        this.draw();
    }

    showRules() {
        document.getElementById('rulesModal').style.display = 'block';
    }

    closeRules() {
        document.getElementById('rulesModal').style.display = 'none';
    }

    handleWindowClick(e) {
        const rulesModal = document.getElementById('rulesModal');
        const winnerModal = document.getElementById('winnerModal');

        if (e.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
        if (e.target === winnerModal) {
            winnerModal.style.display = 'none';
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LudoGame();
});