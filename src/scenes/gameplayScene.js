var GamePlayScene = function(game, stage)
{
  var self = this;
  self.canv = stage.drawCanv;

  self.keyer;
  self.presser;
  self.ticker;
  self.drawer;

  self.you;
  self.clock;
  self.selector;
  self.pps = 10;

  var rand = function()  { return Math.random(); }
  var srand = function() { return (rand()*2)-1; }
  var brand = function() { return Math.random() < 0.5; }
  var color = function(r,g,b,a) { return "rgba("+r+","+g+","+b+","+a+")"; }
  var randColor = function(a) { return color(Math.floor(rand()*256),Math.floor(rand()*256),Math.floor(rand()*256),a); }
  var lerp = function(s,e,t) { return s+(e-s)*t; }
  var LerpPart = function()
  {
    var self = this;

    self.init = function(sx,sy,sw,sh,sr,sg,sb,sa,
                         ex,ey,ew,eh,er,eg,eb,ea,
                         deltat)
    {
      self.t = 0;
      self.deltat = deltat;
      self.sx = sx; self.ex = ex;
      self.sy = sy; self.ey = ey;
      self.sw = sw; self.ew = ew;
      self.sh = sh; self.eh = eh;
      self.sr = sr; self.er = er;
      self.sg = sg; self.eg = eg;
      self.sb = sb; self.eb = eb;
      self.sa = sa; self.ea = ea;
    }

    self.lerpAttribs = function()
    {
      self.x = lerp(self.sx,self.ex,self.t);
      self.y = lerp(self.sy,self.ey,self.t);
      self.w = lerp(self.sw,self.ew,self.t);
      self.h = lerp(self.sh,self.eh,self.t);
      self.r = lerp(self.sr,self.er,self.t);
      self.g = lerp(self.sg,self.eg,self.t);
      self.b = lerp(self.sb,self.eb,self.t);
      self.a = lerp(self.sa,self.ea,self.t);
    }

    self.draw = function(canv,offx,offy)
    {
      self.lerpAttribs();
      canv.context.fillStyle = color(self.r,self.g,self.b,self.a);
      canv.context.fillRect(self.x+offx,self.y+offy,self.w,self.h);
    }

    self.tick = function()
    {
      self.t += self.deltat;
      return self.t < 1;
    }
  }

  var Selector = function(scene)
  {
    var self = this;

    var Arrow = function(x,y,w,h)
    {
      var self = this;

      self.x = x;
      self.y = y;
      self.w = w;
      self.h = h;
      self.pressed = false;
      self.press   = function() { self.pressed = true; }
      self.unpress = function() { self.pressed = false; }

      self.draw = function(canv)
      {
        canv.context.strokeStyle = "#000000";
        canv.context.strokeRect(self.x,self.y,self.w,self.h);
      }
    }

    self.tick = function()
    {
      if(self.inc.pressed) scene.pps++;
      if(self.dec.pressed) scene.pps--;
      if(scene.pps < 0)   scene.pps = 0;
    };

    self.draw = function(canv)
    {
      self.inc.draw(canv);
      self.dec.draw(canv);
      canv.context.fillStyle = "#000000";
      canv.context.fillText(scene.you.pool.count,10,45);
    }

    self.inc = new Arrow(10,10,20,20);
    self.dec = new Arrow(10,50,20,20);
  }

  var Clock = function()
  {
    var self = this;

    self.t = 0;
    self.r = 50;
    self.lr = 5;

    self.tick = function()
    {
      self.t += 0.1;
    }

    self.draw = function(canv)
    {
      var x = canv.canvas.width/2+self.r*Math.cos(self.t);
      var y = canv.canvas.height/2+self.r*Math.sin(self.t);

      canv.context.strokeStyle = "#000000"
      canv.context.lineWidth = 1;

      canv.context.beginPath();
      canv.context.arc(
      x,
      y,
      self.lr,
      0,
      2*Math.PI,
      true);
      canv.context.stroke();

      canv.context.beginPath();
      canv.context.arc(
      canv.canvas.width/2,
      canv.canvas.height/2,
      self.r,
      0,
      2*Math.PI,
      true);
      canv.context.stroke();
    }
  }

  var YouPart = function(id)
  {
    var self = this;

    self.id = id;
    self.lr = new LerpPart();

    self.init = function(x,y,xv,yv,red)
    {
      var w = 4;
      var r = rand()*2*Math.PI;
      var ox = Math.cos(r);
      var oy = Math.sin(r);
      r = 10+rand()*10;
      self.lr.init(x-(w/2)               , y-(w/2)               , w, w, red,0,0,1,
                   x-(w/2)+(xv*10)+(r*ox), y-(w/2)+(yv*10)+(r*oy), w, w, red,0,0,0,
                   rand()/200+0.01);
    }

    self.draw = function(canv, offx, offy) { self.lr.draw(canv,offx,offy); }
    self.tick = function()                 { return self.lr.tick(); }
  }

  var YouPartPool;
  var good = false;
  if(good)
  {
    YouPartPool = function()
    {
      var self = this;

      self.max = 3000;
      self.count = 0;
      self.data = [];
      for(var i = 0; i < self.max; i++)
        self.data[i] = new YouPart(i);

      self.get = function(x,y,xv,yv,red)
      {
        if(self.count >= self.max)
        {
          for(var i = self.max; i < self.max*2; i++)
            self.data[i] = new YouPart(i);
          self.max *= 2;
        }
        self.data[self.count].init(x,y,xv,yv,red);
        return self.data[self.count++];
      }
      self.retire = function(youpart)
      {
        var old = self.data[self.count-1];
        self.data[self.count-1] = youpart;
        self.data[youpart.id] = old;
        old.id = youpart.id;
        youpart.id = self.count-1;
        self.count--;
      }
    }
  }
  else
  {
    YouPartPool = function()
    {
      var self = this;

      self.count = 0;
      self.data = [];

      self.get = function(x,y,xv,yv,red)
      {
        self.data.push(new YouPart(self.count));
        self.data[self.count].init(x,y,xv,yv,red);
        self.count++;
        return self.data[self.count-1];
      }
      self.retire = function(youpart)
      {
        self.data.splice(youpart.id,1);
        for(var i = youpart.id; i < self.count-1; i++)
          self.data[i].id = i;

        self.count--;
      }
    }
  }

  var You = function(scene)
  {
    var self = this;

    self.x = 100;
    self.y = 100;
    self.w = 50;
    self.h = 50;

    self.minix = self.x;
    self.miniy = self.y;

    self.wd = false;
    self.ad = false;
    self.sd = false;
    self.dd = false;

    self.xv = 0;
    self.yv = 0;
    self.maxvel = 20;

    self.int = new Q();
    self.inc = new Q();

    self.pool = new YouPartPool();

    self.key = function(t,c)
    {
      self.int.push(t);
      self.inc.push(c);
    }

    self.tick = function()
    {
      var t;
      var c;
      while((t = self.int.pop()) !== undefined && (c = self.inc.pop()) !== undefined)
      {
             if(c == 87) { self.wd = t; } //w
        else if(c == 65) { self.ad = t; } //a
        else if(c == 83) { self.sd = t; } //s
        else if(c == 68) { self.dd = t; } //d
        else if(c == 32)
        {
          console.log("w:"+self.wd+" a:"+self.ad+" s:"+self.sd+" d:"+self.dd);
        }
      }

      if(self.wd && self.yv > -self.maxvel) { self.yv-=2; }
      if(self.ad && self.xv > -self.maxvel) { self.xv-=2; }
      if(self.sd && self.yv <  self.maxvel) { self.yv+=2; }
      if(self.dd && self.xv <  self.maxvel) { self.xv+=2; }

      if(self.yv < 0 && (!self.wd || (self.wd && self.sd))) self.yv++;
      if(self.yv > 0 && (!self.sd || (self.wd && self.sd))) self.yv--;
      if(self.xv < 0 && (!self.ad || (self.ad && self.dd))) self.xv++;
      if(self.xv > 0 && (!self.dd || (self.ad && self.dd))) self.xv--;

      self.x += self.xv;
      self.y += self.yv;

      if(self.x+self.w > stage.drawCanv.canvas.width)  { self.x = stage.drawCanv.canvas.width-self.w;  scene.drawer.shake(self.xv); self.xv = -self.xv; }
      if(self.x        < 0)                            { self.x = 0;                                   scene.drawer.shake(self.xv); self.xv = -self.xv; }
      if(self.y+self.h > stage.drawCanv.canvas.height) { self.y = stage.drawCanv.canvas.height-self.h; scene.drawer.shake(self.yv); self.yv = -self.yv; }
      if(self.y        < 0)                            { self.y = 0;                                   scene.drawer.shake(self.yv); self.yv = -self.yv; }

      self.minix = self.minix+((self.x-self.minix)*0.1);
      self.miniy = self.miniy+((self.y-self.miniy)*0.1);

      for(var i = 0; i < scene.pps; i++)
      {
        var x = self.w;
        var y = self.h;
        while(x*x + y*y > self.w/2*self.h/2)
        {
          x = rand()*self.w;
          y = rand()*self.h;
        }
        if(brand()) x = -x;
        if(brand()) y = -y;
        self.pool.get(self.x+self.w/2+x,self.y+self.h/2+y,self.xv,self.yv,Math.abs(Math.round(scene.drawer.shakeamt*100)));
      }

      for(var i = 0; i < self.pool.count; i++)
      {
        if(!self.pool.data[i].tick())
          self.pool.retire(self.pool.data[i--]);
      }
    }

    self.draw = function(canv, offx, offy)
    {
      for(var i = 0; i < self.pool.count; i++)
        self.pool.data[i].draw(canv, offx, offy);
    }
  }

  self.ready = function()
  {
    self.keyer = new Keyer({});
    self.presser = new Presser({source:stage.dispCanv.canvas});
    self.ticker = new Ticker({});
    self.drawer = new Drawer({source:stage.drawCanv});

    self.ticker.register(self.drawer);
    self.you = new You(self);
    self.keyer.register(self.you);
    self.ticker.register(self.you);
    self.drawer.register(self.you);
    self.clock = new Clock();
    self.ticker.register(self.clock);
    self.drawer.register(self.clock);
    self.selector = new Selector(self);

    self.drawer.register(self.selector);
    self.drawer.register(self.selector);
    self.ticker.register(self.selector);
    self.ticker.register(self.selector);
    self.presser.register(self.selector.inc);
    self.presser.register(self.selector.dec);
  };

  self.tick = function()
  {
    self.keyer.flush();
    self.presser.flush();
    self.ticker.flush();
  };

  self.draw = function()
  {
    self.drawer.flush();
  };

  self.cleanup = function()
  {
    self.keyer.detach();
    self.presser.detach();
    self.ticker.detach();
    self.drawer.detach();

    self.keyer.clear();
    self.presser.clear();
    self.ticker.clear();
    self.drawer.clear();
  };
};

