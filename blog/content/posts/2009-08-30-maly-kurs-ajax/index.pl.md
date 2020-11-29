---
title: Mały kurs AJAX
date: 2009-08-30T00:03:06+01:00
aliases:
  - /index.php/2009/08/maly-kurs-ajax/
  - /2009/08/maly-kurs-ajax/
category:
  - programowanie
tag:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

AJAX to technologia umożliwiająca nam dynamiczne ładowaie danych z serwera na naszą stronę bez odświeżania całej strony. Jest to kożystne pod względem wydajności gdyż przesyłane jest tylko to co ma się zmienić, natomiast statyczne elementy naszej strony, tak jak logo, czy tło nie muszą być ponownie pobierane z serwera, następną korzyścią jest to, że poczas przesyłania danych w technologii AJAX strona jest cały czas dostępna dla użytkownika i reaguje na polecenia. Nazwa AJAX to skrót od Asynchronous-Javascript-And-XML, czeli asynchroniczny Javascript i XML.

Aby zacząć przygodę z AJAX-em potrzebujemy edytora tekstowego i przeglądarki z włączoną obsługą Javascript i serwera może być na lokalnym komputerze, lub na jakimś hostingu. Aby nie było żadnych wątpliwości pokażę także stronę w HTML-u a której będziemy implementowali technologię AJAX.

Oto jej kod:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<title>Kurs AJAX</title>
<script type="text/javascript">
<!--Tu umieścimy skrypt javascript-->
</script>
</head>
<body>
<h1>Kurs AJAX</h1>
<!--Tu umieścimy przykłady-->
</body>
</html>
```

## Zaczynamy!

Zanim jednak zaczniemy, należy utworzyć na serwerze w tym samym katalogu, w którym umieścimy stronę z ajaxem plik tekst.html i wpisać w nim jakiś tekst. Właśnie ten plik będzie ładowany przez AJAX w naszym przykładzie.

### Tworzenie obiektu XMLHttpRequest

Najpierw powinniśmy utworzyć obiekt zapytania, czyli XMLHttpRequest . Posiada on funkcje, które potrzebne nam będą do wysyłania i pobierania danych. Nie we wszystkich przeglądarkach tworzy się go jednakowo. W większości przeglądarek wystarczy kod: `var obiekt_XMLHttpRequest = new XMLHttpRequest();`, jednak nie we wszystkich. W Internet Explorerze obiekt ten tworzy się w następujący sposób: `var obiekt_XMLHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");`. Oto kod tworzący obiekt XMLHttpRequest zależnie od przeglądarki:

```
var obiekt_XMLHttpRequest = false;
if(window.XMLHttpRequest) {
 obiekt_XMLHttpRequest = new XMLHttpRequest();
} else if(window.ActiveXObject) {
 obiekt_XMLHttpRequest = new ActiveXObject("Microsoft.XMLHttp");
}
```

Kod należy umieścić między znacznikami `<script>` i `</script>` w sekcji `<head>`.

Gdy już mamy obiekt XHR (żeby za każdym razem nie pisać takiej długiej nazwy, obiekt XMLHttpRequest będę nazywał XHR) możemy poeksperymentować.

## Pobieranie tekstu z serwera metodą protokołu http GET

Najprostszą czynnością jaką możemy wykonać jest pobieranie danych tekstowych z serwera. Pokażę teraz jak to zrobić.

```html
<input type="button" value="Pobierz tekst" onclick="pobierz_dane()" />
<div id="nasz_element"> </div>
```

(Umieszczamy ten kod przed znacznikiem `</body>`) Umieściliśmy na stronie przycisk z akcją onclick="pobierz_dane()", co spowoduje że po naciśnięciu przycisku zostanie wywołana metoda pobierz_dane(), którą omówimy za chwilę. Dodaliśmy także element div, w którym będą umieszczone dane pobrane z serwera i nadaliśmy mu identyfikator "nasz_element".

Teraz pora na funkcję `pobierz_dane()`. tworzymy nową funkcję i nazywamy ją `pobierz_dane()`:

```js
function pobierz_dane() {
}
```

Umieszczamy ją w znaczniku `<script></script>` po kodzie tworzącym obiekt XHR.

Teraz umieszczamy kod funkcji:

1. Następnie za pomocą funkcji DOM `getElementById();` pobieramy referencję do naszego DIV-a, w którym umieścimy tekst pobrany z serwera:
  ```js
  var elem = document.getElementById("nasz_element");
  ```

2. Teraz ustawiamy parametry naszego żądania do serwera robimy to za pomocą funkcji `open(sMetoda, sAdresURL);`. Użyjemy najprostszej metody protokołu Http – GET, a adres URL, w zależności gdzie umieściliśmy nasz plik. Ważne jest aby odwoływać się do pliku nie bezpośrednio, a przez protokuł Http. Kod może wyglądać następująco:
`obiekt_XMLHttpRequest.open("GET", "http://localhost/kurs_ajax/tekst.html");`

3. Teraz dodamy funkcję, która będzie wywoływana przy zmianie stanu gotowości naszego żądania. Jest pięc stanów: 0 – nieustawione, 1 – otwarte, 2 – odebrano nagłówki, 3 – ładowanie, 4 – gotowe. Nas interesuje tylko 4.
  ```js
  obiekt_XMLHttpRequest.onreadystatechange = function() {
    if(obiekt_XMLHttpRequest.readyState == 4 && obiekt_XMLHttpRequest.status == 200) {
      elem.innerHTML = obiekt_XMLHttpRequest.responseText;
    }
  }
  ```
  Funkcja sprawdza, czy dane są już gotowe(czy mają stan gotowości 4) i czy nie wystąpiły błędy (kod Http 200, znaczy, że wszystko poszło dobrze). Następnie kodem elem.innerHTML = obiekt_XMLHttpRequest.responseText; przypisujemy naszemu DIV-owi tekst pobrany z serwera.


## Kod wynikowy
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"Http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="Http://www.w3.org/1999/xhtml">
<head>
<meta Http-equiv="content-type" content="text/html; charset=utf-8" />
<title>Kurs AJAX</title>
<script type="text/javascript">
var obiekt_XMLHttpRequest = false;
if(window.XMLHttpRequest) {
obiekt_XMLHttpRequest = new XMLHttpRequest();
} else if(window.ActiveXObject) {
obiekt_XMLHttpRequest = new ActiveXObject("Microsoft.XMLHttp");
}


function pobierz_dane() {
var elem = document.getElementById("nasz_element");
obiekt_XMLHttpRequest.open("GET", "http://localhost/kurs_ajax/tekst.html"); /*ustawiamy parametry obiektu obiekt_XMLHttpRequest*/
obiekt_XMLHttpRequest.onreadystatechange = function() { /*dodajemy funkcje, ktora bedzie wywolywana przy zmianie statusu gotowosci danych. Status gotowosci 4 oznacza, że zakonczono*/
if(obiekt_XMLHttpRequest.readyState == 4 && obiekt_XMLHttpRequest.status == 200) { /*sprawdzamy czy zakonczono pobieranie danych i czy nie wystąpily bledy po stronie serwera (status 200, znaczy ze wszystko jest ok)*/
elem.innerHTML = obiekt_XMLHttpRequest.responseText; /*przypisujemy naszemu elementowi pobrany tekst*/
}
}
obiekt_XMLHttpRequest.send(null); /*wysyłamy zapytanie*/
}
</script>
</head>
<body>
<h1>Kurs AJAX</h1>
<!--Tu umieścimy przykłady-->
<input type="button" value="Pobierz tekst" onclick="pobierz_dane()" />
<div id="nasz_element"> </div>
</body>
</html>
```

Przykład jest prosty, jednak daje przedstawiona tutaj metoda daje duże możliwości. Zamiast tego prostego pliku tekst.html możemy pobierać wynik działania skryptu, np. php, co daje nam bardzo duże możliwości. Możemy np. stworzyć wyszukiwarkę, która będzie wyświetlała wyniki bez przeładowywania strony, albo tabelę kursów walut, które będą się automatycznie odświeżały, itp.

Ciąg dalszy nastąpi…

