###
  Crucigrama JS
  @version 0.1
  @date 2015
  @author Jonathan Montoya
###

Crucigram = do ->

  Crucigram = (props) ->

    @originWords = null
    @updater = null
    @arrWords = []
    @score = 0
    @mark = props.mark
    @attrMark = props.attrMark or 'data-mark'
    @clsMark = props.clsMark or 'textMark'
    @words = props.words
    @check = props.check
    @press = props.press
    @originBackground  = props.originBackground
    @pressBackground = props.pressBackground
    @point = props.point or 1
    @finishGame = props.finishGame
    @finishTime  = props.finishTime
    @minimum = props.minimum or this.size(this.words)
    @minutes = props.minutes or 20
    @time = props.time || false
    @timerId = props.timerId or 'timer'

    #Obtener indice del elemento
    Crucigram::indexOf = (o, e) ->
      [x, l, i] = [0, o.length, 0]
      while x < l
        if e is o[x] then i = x
        x++
      i

    #Obtener longitud del
    Crucigram::size = (o) ->
      l = 0
      for k,v of o then if o.hasOwnProperty k then ++l
      l

    #Organizar letras del crucigrama
    Crucigram::organize = ->
      @originWords = @words
      for k,v of @words
        if @words.hasOwnProperty (k) then @words[k].word = @words[k].word.split ''

    #Acciones al presionar teclas
    Crucigram::pressKey = ->

      obj = @
      press = document.getElementsByClassName @press
      i = 0
      l = press.length

      while i < l

        #Establecer background por defecto
        press[i].style.backgroundColor = @originBackground
        press[i].onclick = ->

          _press = @;
          @style.backgroundColor = obj.pressBackground
          @tabIndex = obj.indexOf press, @
          @focus()

          #Cambiar color a activo
          @onblur = -> _press.style.backgroundColor = obj.originBackground

          #Insertar letra en crucigrama
          @onkeydown = (e) ->
            e = e or window.event
            key = e.keyCode or e.chartCode or e.which
            if key >= 65 and key <= 90
              _press.innerHTML = String.fromCharCode key
            else e.returnValue = false
        i++

	  #Comprueba el crucigrama
    Crucigram::checkWords = ->
      obj = @
      check = document.getElementsByClassName(@check)[0]
      check.onclick = ->
        obj.confirm()

    #Iniciar crucigrama
    Crucigram::start = ->
      @organize()
      @pressKey()
      @checkWords()
      if @time is true then @timer()

    Crucigram::confirm = ->
      obj = @
      for k,v of obj.words

        if obj.words.hasOwnProperty k
          innerWord = document.getElementsByClassName k
          word = obj.words[k].word
          storeWord = []

        #Guardar palabras que se han completado
        x = 0
        l = innerWord.length
        while x < l
          _x = innerWord[x].innerHTML
          storeWord.push _x
          x++

        #Comprobar palabras
        word = word.join ''
        reverse = (arr) -> arr.slice().reverse()
        reverseWord = reverse(storeWord).join ''
        storeWord = storeWord.join ''

        if (word is storeWord) or (word is reverseWord)

          #Sumar puntaje
          obj.score =  obj.score + obj.point
          obj.arrWords.push word

          #Marcar palabras que se han completado
          if obj.words[k].mark is true
            m = document.getElementsByClassName obj.mark
            j = 0
            l = m.length
            while j < l
              mk = m[j].getAttribute obj.attrMark
              if mk is k
                m[j].className = m[j].className + ' ' + obj.clsMark
                m[j].innerHTML = word
              j++

          #Elimina elementos para que no hayan repetidos
          delete obj.words[k]

          #Elimina eventos a palabras terminadas
          cl = document.getElementsByClassName k
          x = 0
          l = cl.length
          while x < l
            cl[x].onkeydown = null
            cl[x].onclick = null
            x++

        else

          #Resetear estilo a la palabra
          cl = document.getElementsByClassName k
          x = 0
          l = cl.length
          while x < l
            cl[x].style.backgroundColor = obj.originBackground
            x++

        #Terminar juego
        if obj.arrWords.length >= obj.minimum
          if obj.time is true
            document.getElementById(obj.timerId).innerHTML = '00:00'
            clearInterval obj.updater
          obj.finishGame obj.score, obj.arrWords

    Crucigram::timer = ->

      if @minutes <= 59 and @minutes >= 1

        obj = @
        min = (60 * 1000) * @minutes
        last = new Date();
        last = last.getTime() + min

        #Generar tiempo
        generateTime = ->

          now = new Date()
          now = now.getTime()

          #Generar tiempo
          m = Math.floor (last - now) / 1000 / 60
          s = Math.round ((last - now) / 1000) - (60 * m)
          s = if s is 60 then 59 else s

          #Tiempo a texto
          seconds = if s is 0 then '00' else (if s < 10 then '0' + s.toString() else s.toString())
          minutes = if m is 0 then '00' else (if m < 10 then '0' + m.toString() else m.toString())
          timerText = minutes + ":" + seconds

          return {
            minutes: minutes
            seconds: seconds
            timerText: timerText
            realSecond: s
            realMinute: m
          }

        #Actualiza el contador
        updateTime = ->

          time = generateTime()
          document.getElementById(obj.timerId).innerHTML = time.timerText

          #Finalizar tiempo
          if time.realMinute is 0 and time.realSecond is 1

            #Finalizar juego
            document.getElementById(obj.timerId).innerHTML = '00:00'
            obj.confirm()
            obj.finishTime obj.score, obj.arrWords
            clearInterval obj.updater

        obj.updater = setInterval updateTime, 1000
    yes

  Crucigram
window.Crucigram = Crucigram