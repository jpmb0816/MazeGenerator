let width, height;
let canvas, ctx;

const grid = [];
const rows = 20;
const cols = 20;
const size = 32;

let current;
const stack = [];

function createCanvas(w, h) {
	if (canvas) canvas.parentElement.removeChild(canvas);
	canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
	width = w;
	height = h;
}

function init() {
	createCanvas(cols * size, rows * size);

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			grid.push(new Cell(x, y));
		}
	}

	current = grid[0];

	setInterval(render, 100);
}

function render() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, width, height);

	for (let i = 0; i < grid.length; i++) {
		grid[i].render();
	}

	current.highlight();

	current.visited = true;
	const next = current.checkNeighbors();

	if (next) {
		next.visited = true;
		removeEdges(current, next);
		stack.push(current);
		current = next;
	}
	else if (stack.length > 0) {
		current = stack.pop();
	}
}

function lineTo(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function index(x, y) {
	if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1) {
		return -1;
	}

	return x + y * cols;
}

function removeEdges(a, b) {
	const x = a.x - b.x;
	const y = a.y - b.y;

	if (x === 1) {
		a.edges[3] = false;
		b.edges[1] = false;
	}
	else if (x === -1) {
		a.edges[1] = false;
		b.edges[3] = false;
	}

	if (y === 1) {
		a.edges[0] = false;
		b.edges[2] = false;
	}
	else if (y === -1) {
		a.edges[2] = false;
		b.edges[0] = false;
	}
}

function Cell(x, y) {
	this.x = x;
	this.y = y;

	this.visited = false;
	this.edges = [true, true, true, true];

	this.render = function() {
		ctx.strokeStyle = 'white';

		const x1 = this.x * size;
		const x2 = (this.x + 1) * size;
		const y1 = this.y * size;
		const y2 = (this.y + 1) * size;

		if (this.edges[0]) {
			lineTo(x1, y1, x2, y1);
		}
		if (this.edges[1]) {
			lineTo(x2, y1, x2, y2);
		}
		if (this.edges[2]) {
			lineTo(x2, y2, x1, y2);
		}
		if (this.edges[3]) {
			lineTo(x1, y2, x1, y1);
		}

		if (this.visited) {
			ctx.fillStyle = 'gray';
			ctx.fillRect(x1, y1, size, size);
		}
	};

	this.highlight = function() {
		ctx.fillStyle = 'red';
		ctx.fillRect(this.x * size, this.y * size, size, size);
	};

	this.checkNeighbors = function() {
		const neighbors = [];

		const top = grid[index(this.x, this.y - 1)];
		const right = grid[index(this.x + 1, this.y)];
		const bottom = grid[index(this.x, this.y + 1)];
		const left = grid[index(this.x - 1, this.y)];

		if (top && !top.visited) {
			neighbors.push(top);
		}
		if (right && !right.visited) {
			neighbors.push(right);
		}
		if (bottom && !bottom.visited) {
			neighbors.push(bottom);
		}
		if (left && !left.visited) {
			neighbors.push(left);
		}

		if (neighbors.length > 0) {
			return neighbors[Math.floor(Math.random() * neighbors.length)];
		}

		return undefined;
	};
}