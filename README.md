#Crucigrama - Javascript
Crucigrama con contador hecho en javascript.

<hr>
 ```
crucigram = new Crucigram(options);
crucigram.start();
 ```

Opciones de configuración
<hr>
 ```
mark : string - 'Clase que trae los elementos a marcar si se completo la palabra.'
attrMark : string | default = 'data-mark' - 'Atributo que enlaza la clase de la palabra a marcar.'
clsMark : string | default = "textMark" - 'Clase cuando se marca una palabra.'
words : literal - 'Palabras.'
check : 'string - Clase de comprobación.'
press : 'string - Clase que presiona las teclas.'
originBackground : string color - 'Fondo de color original.'
pressBackground :: string color - 'Fondo de color cuando se presiona una tecla.'
score : number - 'Puntaje inicial.'
point : number - 'Punto por palabra.'
finishGame : function - 'Funcion cuando se termina el juego.'
finishTime : function - 'Funcion cuando se termina el tiempo de juego.'
minimum : number | default = "La longitud de las palabras" - 'Palabras minimas de juego.'
minutes : number | default = 20 - 'Minutos en el contador.'
time : boolean | default = false - 'Activar contador.'
timerId : string | default = "timer" - 'Id del contador "00:00"'
 ```

Iniciando<br>
- Crear el crucigrama en html
- A cada elemento que contiene la palabra asignarle una clase de palabra ejm: ('1H') y asignarle la clase "press" ejm:(KEY)

```
  <td class="1H KEY">D</td>
  <td class="1H KEY">E</td>
  <td class="1H KEY">S</td>
  <td class="1H KEY">S</td>
  <td class="1H KEY">S</td>
  <td class="1H KEY">A</td>
  <td class="1H KEY">R</td>
  <td class="1H KEY">R</td>
  <td class="1H KEY">O</td>
  <td class="1H KEY">L</td>
  <td class="1H KEY"></td>
```

- Luego en la parte donde se listan las palabras creamos un elemento y asiganamos la clase "mark" ejm:(mark) le asignamos el atributo que queramos con el valor de la clase que va ligada ejm: (data-mark="1H") 1H seria la clase que va ligada a la palabra.

```
  <span class="mark" data-mark="1H">_______</td>
```



Vista previa
<hr>
![""](https://raw.githubusercontent.com/jonathanxx/mango-crucigram/master/preview.png "Mango crucigram")
