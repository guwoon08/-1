const SIZE = 3;
const pieces = [];
let emptyIndex = SIZE * SIZE - 1;
let draggingPiece = null;
let imageUrl = '';

document.getElementById('imageUpload').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result;
            createPuzzle();
        };
        reader.readAsDataURL(file);
    }
}

function createPuzzle() {
    if (!imageUrl) {
        alert('이미지를 선택해 주세요.');
        return;
    }
    
    const puzzleContainer = document.getElementById('puzzle');
    pieces.length = 0; // Clear the array
    for (let i = 0; i < SIZE * SIZE; i++) {
        pieces.push(i);
    }
    pieces.sort(() => Math.random() - 0.5);

    puzzleContainer.innerHTML = '';
    pieces.forEach((piece, index) => {
        const div = document.createElement('div');
        div.className = 'piece';
        div.style.backgroundImage = `url("${imageUrl}")`;
        div.style.backgroundSize = `${SIZE * 100}px ${SIZE * 100}px`;
        div.style.backgroundPosition = `${-((piece % SIZE) * 100)}px ${-((Math.floor(piece / SIZE)) * 100)}px`;
        div.style.left = `${(index % SIZE) * 100}px`;
        div.style.top = `${Math.floor(index / SIZE) * 100}px`;
        div.dataset.index = index;
        div.addEventListener('mousedown', (event) => startDrag(event, div));
        div.addEventListener('mousemove', (event) => drag(event));
        div.addEventListener('mouseup', () => endDrag());
        if (piece === 0) div.classList.add('empty');
        puzzleContainer.appendChild(div);
    });

    emptyIndex = pieces.indexOf(0);
    document.getElementById('message').textContent = ''; // Clear any previous messages
}

function startDrag(event, piece) {
    draggingPiece = piece;
    piece.style.zIndex = 1;
    piece.style.cursor = 'grabbing';
    piece.dataset.startX = event.clientX;
    piece.dataset.startY = event.clientY;
}

function drag(event) {
    if (!draggingPiece) return;

    const dx = event.clientX - draggingPiece.dataset.startX;
    const dy = event.clientY - draggingPiece.dataset.startY;
    
    draggingPiece.style.left = `${parseInt(draggingPiece.style.left) + dx}px`;
    draggingPiece.style.top = `${parseInt(draggingPiece.style.top) + dy}px`;

    draggingPiece.dataset.startX = event.clientX;
    draggingPiece.dataset.startY = event.clientY;

    // Check if the dragged piece is near the empty space
    if (isNearEmptySpace(draggingPiece)) {
        movePiece(draggingPiece);
    }
}

function endDrag() {
    if (draggingPiece) {
        draggingPiece.style.zIndex = '';
        draggingPiece.style.cursor = 'move';
        if (isPuzzleComplete()) {
            document.getElementById('message').textContent = '축하합니다! 퍼즐을 맞추셨습니다!';
        }
        draggingPiece = null;
    }
}

function isNearEmptySpace(piece) {
    const pieceX = parseInt(piece.style.left) / 100;
    const pieceY = parseInt(piece.style.top) / 100;
    const emptyX = (emptyIndex % SIZE);
    const emptyY = Math.floor(emptyIndex / SIZE);

    return (Math.abs(pieceX - emptyX) <= 1 && pieceY === emptyY) ||
           (Math.abs(pieceY - emptyY) <= 1 && pieceX === emptyX);
}

function movePiece(piece) {
    const index = parseInt(piece.dataset.index);
    const emptyPiece = document.querySelector(`.piece.empty`);

    emptyPiece.style.left = piece.style.left;
    emptyPiece.style.top = piece.style.top;

    piece.style.left = `${(emptyIndex % SIZE) * 100}px`;
    piece.style.top = `${Math.floor(emptyIndex / SIZE) * 100}px`;

    emptyPiece.dataset.index = index;
    piece.dataset.index = emptyIndex;

    pieces[emptyIndex] = index;
    pieces[parseInt(piece.dataset.index)] = 0;

    emptyIndex = parseInt(piece.dataset.index);
}

function isPuzzleComplete() {
    return pieces.every((value, index) => value === index);
}

function resetPuzzle() {
    createPuzzle();
}

function shufflePuzzle() {
    createPuzzle();
}

createPuzzle();
