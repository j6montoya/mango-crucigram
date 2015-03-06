/**
 * 
 * Crucigrama sencillo en javascript
 * 
 * @version 0.1
 * @date 2015
 * @author Jonathan Montoya
 * 
 */

var Crucigram = (function(){

	function Crucigram(props){

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

	}

	// Obtener indice del elemento
	Crucigram.prototype.indexOf = function(o, e){
		var i, x;
		i = 0;
		for(x = 0, l = o.length; x < l; ++x){
			if(e == o[x]) i = x;
		}
		return i;
	}

	// Obtener longitud del objecto
	Crucigram.prototype.size = function(o){
		var i, l;
		l = 0;
		for(i in o){
			if(o.hasOwnProperty(i)) ++l;
		}
		return l;
	}

	// Organizar letras
	Crucigram.prototype.organize = function(){
		var i;
		this.originWords = this.words;
		for(i in this.words){
			if(this.words.hasOwnProperty(i))
				this.words[i].word = this.words[i].word.split('');
		}
	};

	// Acciones al presionar las teclas
	Crucigram.prototype.pressKey = function(){
		var obj, press, l, i, _press, key;
		obj = this;
		press = document.getElementsByClassName(this.press);

		for(i = 0, l = press.length; i < l; ++i){

			// Establecer background por defecto
			press[i].style.backgroundColor = this.originBackground;
			press[i].onclick = function(){

				_press = this;
				this.style.backgroundColor = obj.pressBackground;
				this.tabIndex = obj.indexOf(press, this);
				this.focus();

				// Cambiar color a activo
				this.onblur = function(){
					_press.style.backgroundColor = obj.originBackground;
				};

				// Insertar letra en crucigrama
				this.onkeydown = function(e){
					e = e || window.event;
					key = e.keyCode || e.chartCode || e.which;
					if(key >= 65 && key <= 90){
						_press.innerHTML = String.fromCharCode(key);
					}else{
						e.returnValue = false;
					}
				}
			}
		}
	}

	// Comprueba el crucigrama
	Crucigram.prototype.checkWords = function(){
		var obj, check;
		obj = this;
		check = document.getElementsByClassName(this.check)[0];
		check.onclick = function(){
			return obj.confirm();
		};

	};

	// Calificar crucigrama
	Crucigram.prototype.confirm = function(){
		var obj, cls, innerWord, word, storeWord, m, j, k, mk, cl, x, l;
		obj = this;
		for(cls in obj.words){

			if(obj.words.hasOwnProperty(cls)){

				innerWord = document.getElementsByClassName(cls);
				word = obj.words[cls].word;
				storeWord = [];

				// Guardar palabras que se han completado
				for(var x = 0, l = innerWord.length; x < l; ++x){
					_x = innerWord[x].innerHTML;
					storeWord.push(_x);
				}

				// Comprobar palabras
				word = word.join('');
				storeWord = storeWord.join('');

				// Si las palabras son validas
				if(word == storeWord){

					// Sumar puntaje
					obj.score = (obj.score + obj.point);
					obj.arrWords.push(word);

					// Marcar palabras que se han completado
					if(obj.words[cls].mark === true){
						m = document.getElementsByClassName(obj.mark);
						for(j = 0, k = m.length; j < k; ++j){
							mk = m[j].getAttribute(obj.attrMark);
							if(mk === cls){
								m[j].className = m[j].className + ' ' + obj.clsMark;
								m[j].innerHTML = word;
							}
						}
					}

					// Elimina elementos para que no hayan repetidos
					delete obj.words[cls];

					// Elimina eventos a palabras terminadas
					cl = document.getElementsByClassName(cls);
					x = 0;
					l = cl.length;
					while(x < l){
						cl[x].onkeydown = null;
						cl[x].onclick = null;
						++x;
					}

				}else{

					// Resetear estilo a la palabra
					cl = document.getElementsByClassName(cls);
					x = 0;
					l = cl.length;
					while(x < l){
						cl[x].style.backgroundColor = obj.originBackground;
						++x;
					}

				}
			}
		}

		// Terminar juego
		if(obj.arrWords.length >= obj.minimum) {
			if(obj.time === true){
				document.getElementById(obj.timerId).innerHTML = "00:00";
				clearInterval(obj.updater);
			}
			obj.finishGame(obj.score, obj.arrWords);
		}

	}

	// Iniciar crucigrama
	Crucigram.prototype.start = function(){

		// Iniciar valores
		this.organize();
		this.pressKey();
		this.checkWords();

		// Iniciar contador
		if(this.time === true) this.timer();

	};

	// Contador
	Crucigram.prototype.timer = function(){
		var obj, min, last, generateTime, updateTime, seconds, minutes, timerText, now, s, m, time;

		// Solo para una hora
		if(this.minutes <= 59 && this.minutes >= 1){

			obj = this;
			min = ((60 * 1000) * this.minutes);
			last = new Date();
			last = (last.getTime() + min);

			// Generar tiempo
			generateTime = function(){
				now = new Date();
				now = now.getTime();

				// Generar tiempo
				m = Math.floor((last - now) / 1000 / 60);
				s = Math.round(((last - now) / 1000) - (60 * m));
				s = s == 60 ? 59 : s;

				// Tiempo a texto
				seconds = s === 0 ? '00' : s < 10 ? '0' + s.toString() : s.toString();
				minutes = m === 0 ? '00' : m < 10 ? '0' + m.toString() : m.toString();
				timerText = minutes + ":" + seconds;

				return {
					'minutes' : minutes,
					'seconds' : seconds,
					'timerText' : timerText,
					'realSecond' : s,
					'realMinute' : m
				};

			};

			// Actualiza el contador
			updateTime = function(){
				time = generateTime();
				document.getElementById(obj.timerId).innerHTML = time.timerText;

				// Finalizar tiempo
				if(time.realMinute === 0 && time.realSecond === 1){

					// Finalizar juego
					document.getElementById(obj.timerId).innerHTML = "00:00";
					obj.confirm();
					obj.finishTime(obj.score, obj.arrWords);
					clearInterval(obj.updater);

				}
			};
			obj.updater = setInterval(updateTime, 1000);
		}
	};
	return Crucigram;
})();

// Agregar variable global
window.Crucigram = Crucigram;