'use strict';

const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRZTUVWXYZ1234567890 ,.;'[]<>?:"{}|~!@#$^&*()+`;
const Cypher = {
  generate: () => {
    var a = chars.split('');
    var i = a.length
    // cycle through all char positions from back to front
    while(i--) {
      // pick random char position
      var j = Math.floor(Math.random() * a.length);
      // swap char i with random other char
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join('');
  },
  encrypt: (text, cypher) => {
    var textArray = text.split('');
    for(var i = 0; i < textArray.length; i++) {
      if(chars.indexOf(textArray[i]) === -1) continue;
      textArray[i] = cypher.charAt(chars.indexOf(textArray[i]));
    }
    return textArray.join('');
  },
  decrypt: (text, cypher) => {
    var textArray = text.split('');
    console.log(chars, cypher, text);
    for(var i = 0; i < textArray.length; i++) {
      console.log(textArray[i], chars.indexOf(textArray[i]));
      if(chars.indexOf(textArray[i]) === -1) continue;
      textArray[i] = chars.charAt(cypher.indexOf(textArray[i]));
    }
    return textArray.join('');
  }
};


module.exports = Cypher
