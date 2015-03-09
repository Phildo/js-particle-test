var Q = function()
{
  var self = this;

  self.data = [];

  self.push = function(d)
  {
    self.data.push(d);
  }

  self.pop = function()
  {
    if(self.data.length < 1) return undefined;
    var d = self.data[0];
    self.data.splice(0,1);
    return d;
  }

  self.test = function()
  {
    var a;
    self.push('a');
    self.push('b');
    self.push('c');
    self.push('d');
    self.push('e');
    self.push('f');
    self.push('g');
    if((a = self.pop()) != 'a') console.log("ERROR!"+a);
    if((a = self.pop()) != 'b') console.log("ERROR!"+a);
    if((a = self.pop()) != 'c') console.log("ERROR!"+a);
    self.push('h');
    if((a = self.pop()) != 'd') console.log("ERROR!"+a);
    if((a = self.pop()) != 'e') console.log("ERROR!"+a);
    if((a = self.pop()) != 'f') console.log("ERROR!"+a);
    if((a = self.pop()) != 'g') console.log("ERROR!"+a);
    if((a = self.pop()) != 'h') console.log("ERROR!"+a);
    if((a = self.pop()) != undefined) console.log("ERROR!");
    console.log("success?");
  }
}

