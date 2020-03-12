/**
 * Created by 15267 on 2017/5/17.
 */
(function (window) {
  function random(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function bezier(cp, t) {
    const p1 = cp[0].mul((1 - t) * (1 - t));
    const p2 = cp[1].mul(2 * t * (1 - t));
    const p3 = cp[2].mul(t * t);
    return p1.add(p2).add(p3);
  }

  function inheart(x, y, r) {
    // x^2+(y-(x^2)^(1/3))^2 = 1
    // http://www.wolframalpha.com/input/?i=x%5E2%2B%28y-%28x%5E2%29%5E%281%2F3%29%29%5E2+%3D+1
    const z = ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x / r) * (x / r) + (y / r) * (y / r) - 1) - (x / r) * (x / r) * (y / r) * (y / r) * (y / r);
    return z < 0;
  }

  Point = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };
  Point.prototype = {
    clone() {
      return new Point(this.x, this.y);
    },
    add(o) {
      p = this.clone();
      p.x += o.x;
      p.y += o.y;
      return p;
    },
    sub(o) {
      p = this.clone();
      p.x -= o.x;
      p.y -= o.y;
      return p;
    },
    div(n) {
      p = this.clone();
      p.x /= n;
      p.y /= n;
      return p;
    },
    mul(n) {
      p = this.clone();
      p.x *= n;
      p.y *= n;
      return p;
    },
  };

  Heart = function () {
    // x = 16 sin^3 t
    // y = 13 cos t - 5 cos 2t - 2 cos 3t - cos 4t
    // http://www.wolframalpha.com/input/?i=x+%3D+16+sin%5E3+t%2C+y+%3D+(13+cos+t+-+5+cos+2t+-+2+cos+3t+-+cos+4t)
    const points = []; let x; let y; let
      t;
    for (let i = 10; i < 30; i += 0.2) {
      t = i / Math.PI;
      x = 16 * Math.pow(Math.sin(t), 3);
      y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      points.push(new Point(x, y));
    }
    this.points = points;
    this.length = points.length;
  };
  Heart.prototype = {
    get(i, scale) {
      return this.points[i].mul(scale || 1);
    },
  };

  Seed = function (tree, point, scale, color) {
    this.tree = tree;

    var scale = scale || 1;
    var color = color || '#FF0000';

    this.heart = {
      point,
      scale,
      color,
      figure: new Heart(),
    };

    this.cirle = {
      point,
      scale,
      color,
      radius: 5,
    };
  };
  Seed.prototype = {
    draw() {
      this.drawHeart();
      this.drawText();
    },
    addPosition(x, y) {
      this.cirle.point = this.cirle.point.add(new Point(x, y));
    },
    canMove() {
      return this.cirle.point.y < (this.tree.height + 20);
    },
    move(x, y) {
      this.clear();
      this.drawCirle();
      this.addPosition(x, y);
    },
    canScale() {
      return this.heart.scale > 0.2;
    },
    setHeartScale(scale) {
      this.heart.scale *= scale;
    },
    scale(scale) {
      this.clear();
      this.drawCirle();
      this.drawHeart();
      this.setHeartScale(scale);
    },
    drawHeart() {
      const { ctx } = this.tree;
      const { heart } = this;
      const { point } = heart;
      const { color } = heart;
      const { scale } = heart;
      ctx.save();
      ctx.fillStyle = color;
      ctx.translate(point.x, point.y);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let i = 0; i < heart.figure.length; i++) {
        const p = heart.figure.get(i, scale);
        ctx.lineTo(p.x, -p.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    drawCirle() {
      const { ctx } = this.tree;
      const { cirle } = this;
      const { point } = cirle;
      const { color } = cirle;
      const { scale } = cirle;
      const { radius } = cirle;
      ctx.save();
      ctx.fillStyle = color;
      ctx.translate(point.x, point.y);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    drawText() {
      const { ctx } = this.tree;
      const { heart } = this;
      const { point } = heart;
      const { color } = heart;
      const { scale } = heart;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.translate(point.x, point.y);
      ctx.scale(scale, scale);
      ctx.moveTo(0, 0);
      ctx.lineTo(15, 15);
      ctx.lineTo(60, 15);
      ctx.stroke();

      ctx.moveTo(0, 0);
      ctx.scale(0.75, 0.75);
      ctx.font = '12px 微软雅黑,Verdana'; // 字号肿么没有用? (ˉ(∞)ˉ)
      ctx.fillText('click here', 23, 16);
      ctx.restore();
    },
    clear() {
      const { ctx } = this.tree;
      const { cirle } = this;
      const { point } = cirle;
      const { scale } = cirle;
      const radius = 26;
      const w = h = (radius * scale);
      ctx.clearRect(point.x - w, point.y - h, 4 * w, 4 * h);
    },
    hover(x, y) {
      const { ctx } = this.tree;
      const pixel = ctx.getImageData(x, y, 1, 1);
      return pixel.data[3] == 255;
    },
  };

  Footer = function (tree, width, height, speed) {
    this.tree = tree;
    this.point = new Point(tree.seed.heart.point.x, tree.height - height / 2);
    this.width = width;
    this.height = height;
    this.speed = speed || 2;
    this.length = 0;
  };
  Footer.prototype = {
    draw() {
      const { ctx } = this.tree;
      const { point } = this;
      const len = this.length / 2;

      ctx.save();
      ctx.strokeStyle = 'rgb(35, 31, 32)';
      ctx.lineWidth = this.height;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.translate(point.x, point.y);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(len, 0);
      ctx.lineTo(-len, 0);
      ctx.stroke();
      ctx.restore();

      if (this.length < this.width) {
        this.length += this.speed;
      }
    },
  };

  Tree = function (canvas, width, height, opt) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.opt = opt || {};

    this.record = {};

    this.initSeed();
    this.initFooter();
    this.initBranch();
    this.initBloom();
  };
  Tree.prototype = {
    initSeed() {
      const seed = this.opt.seed || {};
      const x = seed.x || this.width / 2;
      const y = seed.y || this.height / 2;
      const point = new Point(x, y);
      const color = seed.color || '#FF0000';
      const scale = seed.scale || 1;

      this.seed = new Seed(this, point, scale, color);
    },

    initFooter() {
      const footer = this.opt.footer || {};
      const width = footer.width || this.width;
      const height = footer.height || 5;
      const speed = footer.speed || 2;
      this.footer = new Footer(this, width, height, speed);
    },

    initBranch() {
      const branchs = this.opt.branch || [];
      this.branchs = [];
      this.addBranchs(branchs);
    },

    initBloom() {
      const bloom = this.opt.bloom || {};
      const cache = [];
      const num = bloom.num || 500;
      const width = bloom.width || this.width;
      const height = bloom.height || this.height;
      const { figure } = this.seed.heart;
      const r = 240; let x; let
        y;
      for (let i = 0; i < num; i++) {
        cache.push(this.createBloom(width, height, r, figure));
      }
      this.blooms = [];
      this.bloomsCache = cache;
    },

    toDataURL(type) {
      return this.canvas.toDataURL(type);
    },

    draw(k) {
      const s = this; const
        { ctx } = s;
      const rec = s.record[k];
      if (!rec) {
        return;
      }
      const { point } = rec;
      const { image } = rec;

      ctx.save();
      ctx.putImageData(image, point.x, point.y);
      ctx.restore();
    },

    addBranch(branch) {
      this.branchs.push(branch);
    },

    addBranchs(branchs) {
      const s = this; let b; let p1; let p2; let p3; let r; let l; let
        c;
      for (let i = 0; i < branchs.length; i++) {
        b = branchs[i];
        p1 = new Point(b[0], b[1]);
        p2 = new Point(b[2], b[3]);
        p3 = new Point(b[4], b[5]);
        r = b[6];
        l = b[7];
        c = b[8];
        s.addBranch(new Branch(s, p1, p2, p3, r, l, c));
      }
    },

    removeBranch(branch) {
      const { branchs } = this;
      for (let i = 0; i < branchs.length; i++) {
        if (branchs[i] === branch) {
          branchs.splice(i, 1);
        }
      }
    },

    canGrow() {
      return !!this.branchs.length;
    },
    grow() {
      const { branchs } = this;
      for (let i = 0; i < branchs.length; i++) {
        const branch = branchs[i];
        if (branch) {
          branch.grow();
        }
      }
    },

    addBloom(bloom) {
      this.blooms.push(bloom);
    },

    removeBloom(bloom) {
      const { blooms } = this;
      for (let i = 0; i < blooms.length; i++) {
        if (blooms[i] === bloom) {
          blooms.splice(i, 1);
        }
      }
    },

    createBloom(width, height, radius, figure, color, alpha, angle, scale, place, speed) {
      let x; let
        y;
      while (true) {
        x = random(20, width - 20);
        y = random(20, height - 20);
        if (inheart(x - width / 2, height - (height - 40) / 2 - y, radius)) {
          return new Bloom(this, new Point(x, y), figure, color, alpha, angle, scale, place, speed);
        }
      }
    },

    canFlower() {
      return !!this.blooms.length;
    },
    flower(num) {
      const s = this; let
        blooms = s.bloomsCache.splice(0, num);
      for (let i = 0; i < blooms.length; i++) {
        s.addBloom(blooms[i]);
      }
      blooms = s.blooms;
      for (let j = 0; j < blooms.length; j++) {
        blooms[j].flower();
      }
    },

    snapshot(k, x, y, width, height) {
      const { ctx } = this;
      const image = ctx.getImageData(x, y, width, height);
      this.record[k] = {
        image,
        point: new Point(x, y),
        width,
        height,
      };
    },
    setSpeed(k, speed) {
      this.record[k || 'move'].speed = speed;
    },
    move(k, x, y) {
      const s = this; const
        { ctx } = s;
      const rec = s.record[k || 'move'];
      const { point } = rec;
      const { image } = rec;
      const speed = rec.speed || 10;
      const { width } = rec;
      const { height } = rec;

      i = point.x + speed < x ? point.x + speed : x;
      j = point.y + speed < y ? point.y + speed : y;

      ctx.save();
      ctx.clearRect(point.x, point.y, width, height);
      ctx.putImageData(image, i, j);
      ctx.restore();

      rec.point = new Point(i, j);
      rec.speed = speed * 0.95;

      if (rec.speed < 2) {
        rec.speed = 2;
      }
      return i < x || j < y;
    },

    jump() {
      const s = this; const
        { blooms } = s;
      if (blooms.length) {
        for (var i = 0; i < blooms.length; i++) {
          blooms[i].jump();
        }
      }
      if ((blooms.length && blooms.length < 3) || !blooms.length) {
        const bloom = this.opt.bloom || {};
        const width = bloom.width || this.width;
        const height = bloom.height || this.height;
        const { figure } = this.seed.heart;
        const r = 240; let x; let
          y;
        for (var i = 0; i < random(1, 2); i++) {
          blooms.push(this.createBloom(width / 2 + width, height, r, figure, null, 1, null, 1, new Point(random(-100, 600), 720), random(200, 300)));
        }
      }
    },
  };

  Branch = function (tree, point1, point2, point3, radius, length, branchs) {
    this.tree = tree;
    this.point1 = point1;
    this.point2 = point2;
    this.point3 = point3;
    this.radius = radius;
    this.length = length || 100;
    this.len = 0;
    this.t = 1 / (this.length - 1);
    this.branchs = branchs || [];
  };

  Branch.prototype = {
    grow() {
      const s = this; let
        p;
      if (s.len <= s.length) {
        p = bezier([s.point1, s.point2, s.point3], s.len * s.t);
        s.draw(p);
        s.len += 1;
        s.radius *= 0.97;
      } else {
        s.tree.removeBranch(s);
        s.tree.addBranchs(s.branchs);
      }
    },
    draw(p) {
      const s = this;
      const { ctx } = s.tree;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'rgb(35, 31, 32)';
      ctx.shadowColor = 'rgb(35, 31, 32)';
      ctx.shadowBlur = 2;
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, s.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
  };

  Bloom = function (tree, point, figure, color, alpha, angle, scale, place, speed) {
    this.tree = tree;
    this.point = point;
    this.color = color || `rgb(255,${random(0, 255)},${random(0, 255)})`;
    this.alpha = alpha || random(0.3, 1);
    this.angle = angle || random(0, 360);
    this.scale = scale || 0.1;
    this.place = place;
    this.speed = speed;

    this.figure = figure;
  };
  Bloom.prototype = {
    setFigure(figure) {
      this.figure = figure;
    },
    flower() {
      const s = this;
      s.draw();
      s.scale += 0.1;
      if (s.scale > 1) {
        s.tree.removeBloom(s);
      }
    },
    draw() {
      const s = this; const { ctx } = s.tree; const
        { figure } = s;

      ctx.save();
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.translate(s.point.x, s.point.y);
      ctx.scale(s.scale, s.scale);
      ctx.rotate(s.angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let i = 0; i < figure.length; i++) {
        const p = figure.get(i);
        ctx.lineTo(p.x, -p.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    jump() {
      const s = this; const
        { height } = s.tree;

      if (s.point.x < -20 || s.point.y > height + 20) {
        s.tree.removeBloom(s);
      } else {
        s.draw();
        s.point = s.place.sub(s.point).div(s.speed).add(s.point);
        s.angle += 0.05;
        s.speed -= 1;
      }
    },
  };

  window.random = random;
  window.bezier = bezier;
  window.Point = Point;
  window.Tree = Tree;
}(window));
