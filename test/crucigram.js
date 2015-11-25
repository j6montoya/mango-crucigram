
/*
  Crucigrama JS
  @version 0.1
  @date 2015
  @author Jonathan Montoya
 */
var Crucigram;

Crucigram = (function() {
  Crucigram = function(props) {
    this.originWords = null;
    this.updater = null;
    this.arrWords = [];
    this.score = 0;
    this.mark = props.mark;
    this.attrMark = props.attrMark || 'data-mark';
    this.clsMark = props.clsMark || 'textMark';
    this.words = props.words;
    this.check = props.check;
    this.press = props.press;
    this.originBackground = props.originBackground;
    this.pressBackground = props.pressBackground;
    this.point = props.point || 1;
    this.finishGame = props.finishGame;
    this.finishTime = props.finishTime;
    this.minimum = props.minimum || this.size(this.words);
    this.minutes = props.minutes || 20;
    this.time = props.time || false;
    this.timerId = props.timerId || 'timer';
    Crucigram.prototype.indexOf = function(o, e) {
      var i, l, ref, x;
      ref = [0, o.length, 0], x = ref[0], l = ref[1], i = ref[2];
      while (x < l) {
        if (e === o[x]) {
          i = x;
        }
        x++;
      }
      return i;
    };
    Crucigram.prototype.size = function(o) {
      var k, l, v;
      l = 0;
      for (k in o) {
        v = o[k];
        if (o.hasOwnProperty(k)) {
          ++l;
        }
      }
      return l;
    };
    Crucigram.prototype.organize = function() {
      var k, ref, results, v;
      this.originWords = this.words;
      ref = this.words;
      results = [];
      for (k in ref) {
        v = ref[k];
        if (this.words.hasOwnProperty(k)) {
          results.push(this.words[k].word = this.words[k].word.split(''));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    Crucigram.prototype.pressKey = function() {
      var i, l, obj, press, results;
      obj = this;
      press = document.getElementsByClassName(this.press);
      i = 0;
      l = press.length;
      results = [];
      while (i < l) {
        press[i].style.backgroundColor = this.originBackground;
        press[i].onclick = function() {
          var _press;
          _press = this;
          this.style.backgroundColor = obj.pressBackground;
          this.tabIndex = obj.indexOf(press, this);
          this.focus();
          this.onblur = function() {
            return _press.style.backgroundColor = obj.originBackground;
          };
          return this.onkeydown = function(e) {
            var key;
            e = e || window.event;
            key = e.keyCode || e.chartCode || e.which;
            if (key >= 65 && key <= 90) {
              return _press.innerHTML = String.fromCharCode(key);
            } else {
              return e.returnValue = false;
            }
          };
        };
        results.push(i++);
      }
      return results;
    };
    Crucigram.prototype.checkWords = function() {
      var check, obj;
      obj = this;
      check = document.getElementsByClassName(this.check)[0];
      return check.onclick = function() {
        return obj.confirm();
      };
    };
    Crucigram.prototype.start = function() {
      this.organize();
      this.pressKey();
      this.checkWords();
      if (this.time === true) {
        return this.timer();
      }
    };
    Crucigram.prototype.confirm = function() {
      var _x, cl, innerWord, j, k, l, m, mk, obj, ref, results, reverse, reverseWord, storeWord, v, word, x;
      obj = this;
      ref = obj.words;
      results = [];
      for (k in ref) {
        v = ref[k];
        if (obj.words.hasOwnProperty(k)) {
          innerWord = document.getElementsByClassName(k);
          word = obj.words[k].word;
          storeWord = [];
        }
        x = 0;
        l = innerWord.length;
        while (x < l) {
          _x = innerWord[x].innerHTML;
          storeWord.push(_x);
          x++;
        }
        word = word.join('');
        reverse = function(arr) {
          return arr.slice().reverse();
        };
        reverseWord = reverse(storeWord).join('');
        storeWord = storeWord.join('');
        if ((word === storeWord) || (word === reverseWord)) {
          obj.score = obj.score + obj.point;
          obj.arrWords.push(word);
          if (obj.words[k].mark === true) {
            m = document.getElementsByClassName(obj.mark);
            j = 0;
            l = m.length;
            while (j < l) {
              mk = m[j].getAttribute(obj.attrMark);
              if (mk === k) {
                m[j].className = m[j].className + ' ' + obj.clsMark;
                m[j].innerHTML = word;
              }
              j++;
            }
          }
          delete obj.words[k];
          cl = document.getElementsByClassName(k);
          x = 0;
          l = cl.length;
          while (x < l) {
            cl[x].onkeydown = null;
            cl[x].onclick = null;
            x++;
          }
        } else {
          cl = document.getElementsByClassName(k);
          x = 0;
          l = cl.length;
          while (x < l) {
            cl[x].style.backgroundColor = obj.originBackground;
            x++;
          }
        }
        if (obj.arrWords.length >= obj.minimum) {
          if (obj.time === true) {
            document.getElementById(obj.timerId).innerHTML = '00:00';
            clearInterval(obj.updater);
          }
          results.push(obj.finishGame(obj.score, obj.arrWords));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    Crucigram.prototype.timer = function() {
      var generateTime, last, min, obj, updateTime;
      if (this.minutes <= 59 && this.minutes >= 1) {
        obj = this;
        min = (60 * 1000) * this.minutes;
        last = new Date();
        last = last.getTime() + min;
        generateTime = function() {
          var m, minutes, now, s, seconds, timerText;
          now = new Date();
          now = now.getTime();
          m = Math.floor((last - now) / 1000 / 60);
          s = Math.round(((last - now) / 1000) - (60 * m));
          s = s === 60 ? 59 : s;
          seconds = s === 0 ? '00' : (s < 10 ? '0' + s.toString() : s.toString());
          minutes = m === 0 ? '00' : (m < 10 ? '0' + m.toString() : m.toString());
          timerText = minutes + ":" + seconds;
          return {
            minutes: minutes,
            seconds: seconds,
            timerText: timerText,
            realSecond: s,
            realMinute: m
          };
        };
        updateTime = function() {
          var time;
          time = generateTime();
          document.getElementById(obj.timerId).innerHTML = time.timerText;
          if (time.realMinute === 0 && time.realSecond === 1) {
            document.getElementById(obj.timerId).innerHTML = '00:00';
            obj.confirm();
            obj.finishTime(obj.score, obj.arrWords);
            return clearInterval(obj.updater);
          }
        };
        return obj.updater = setInterval(updateTime, 1000);
      }
    };
    return true;
  };
  return Crucigram;
})();

window.Crucigram = Crucigram;
