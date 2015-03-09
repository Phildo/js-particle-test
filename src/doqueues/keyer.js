var Keyer = function(init)
{
  var default_init =
  {
    source:document.createElement('div')
  }

  var self = this;
  doMapInitDefaults(self,init,default_init);

  var keyables = [];
  var callbackQueue = [];
  var evtQueue = []; //1 = down, 0 = up
  var codeQueue = [];
  self.register = function(keyable) { keyables.push(keyable); }
  self.unregister = function(keyable) { var i = keyables.indexOf(keyable); if(i != -1) keyables.splice(i,1); }
  self.clear = function() { keyables = []; }
  self.attach = function() //will get auto-called at creation
  {
    document.addEventListener('keydown', keyd, false);
    document.addEventListener('keyup', keyu, false);
  }
  self.detach = function()
  {
    document.removeEventListener('keydown', keyd);
    document.removeEventListener('keyup', keyu);
  }

  function keyu(evt) { return key(evt, 0); }
  function keyd(evt) { return key(evt, 1); }
  function key(evt,type)
  {
    var code = evt.keyCode;;
    if(code != 8)
    {
      for(var i = 0; i < keyables.length; i++)
      {
        callbackQueue.push(keyables[i].key);
        evtQueue.push(type);
        codeQueue.push(code);
      }
    }
    evt.preventDefault();
    return false;
  }
  self.flush = function()
  {
    for(var i = 0; i < callbackQueue.length; i++)
      callbackQueue[i](evtQueue[i],codeQueue[i]);
    callbackQueue = [];
    evtQueue = [];
    codeQueue = [];
  }

  self.attach();
}

//example keyable- just needs key callback
var Keyable = function(args)
{
  var self = this;

  self.key = args.key ? args.key : function(type, code){};
}

