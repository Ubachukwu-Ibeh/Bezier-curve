const canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  w = 350,
  h = 500,
  color = 'white',
  endAngle = 2 * Math.PI;
canvas.width = w;
canvas.height = h;

const {
  x,
  y
} = canvas.getBoundingClientRect()

const getTouch = event => {
  const [touch] = event.touches, {
    clientX,
    clientY
  } = touch;
  return [clientX, clientY];
};

let K, tx, ty, selected;

window.addEventListener('touchstart', event => {
  const [clientX, clientY] = getTouch(event);
  tx = clientX;
  ty = clientY;
})
window.addEventListener('touchmove', event => {
  const [clientX, clientY] = getTouch(event);
  if (selected) {
    selected.x = clientX - x;
    selected.y = clientY - y;
  }
})
window.addEventListener('touchend', () => {
  tx = undefined, ty = undefined;
  selected = undefined;
})

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  setPoint() {
    if (Math.abs(tx - (this.x + x)) <= 20 && Math.abs(ty - (this.y + y)) <= 20 && !selected) {
      selected = this;
    }
  }
}
const keyPoints = [
  [80, 250],
  [180, 150],
  [200, 350],
  [300, 240]
];
const keyPointsArr = [];

for (var i = 0; i < 4; i++) {
  keyPointsArr.push(new Point(keyPoints[i][0], keyPoints[i][1]))
}

const producePoints = (arr, axis) => (Math.pow(1 - K, 3) * arr[0][axis]) + ((3 * Math.pow(1 - K, 2)) * (K * arr[1][axis])) + (3 * (1 - K) * (Math.pow(K, 2)) * arr[2][axis]) + (Math.pow(K, 3) * arr[3][axis]);

const drawCircle = (x, y, r) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, endAngle);
  ctx.stroke();
};
const drawBlueLine = (from, to) => {
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0c80d8';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}
const render = () => {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);

  keyPointsArr.forEach((point, index) => {
    index === 0 || index === 3 ? ctx.strokeStyle = 'pink' : ctx.strokeStyle = 'purple';
    ctx.lineWidth = 10;
    drawCircle(point.x, point.y, 5);
    point.setPoint();
  });
  
  drawBlueLine(keyPointsArr[1], keyPointsArr[2]);

  const fP = [];
  for (var i = 0; i < 1; i += 0.01) {
    K = i;
    fP.push([producePoints(keyPointsArr, 'x'), producePoints(keyPointsArr, 'y')])
  }
  fP.forEach(point => {
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 1;
    drawCircle(point[0], point[1], 1);
  })
  requestAnimationFrame(render);
}
render();