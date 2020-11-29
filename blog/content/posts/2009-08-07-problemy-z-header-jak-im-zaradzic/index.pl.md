---
title: Problemy z header(). Jak im zaradzić?
date: 2009-08-07T00:03:06+01:00
aliases:
  - /index.php/2009/08/problemy-z-header-jak-im-zaradzic/
  - /2009/08/problemy-z-header-jak-im-zaradzic/
category:
  - programowanie
  - webmastering
tag:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Dostaniemy następujący komunikat:
```php
<?php
echo(„text1″); header(„Location: http://www.spskolsztynek.pl/”);
?>

Warning: Cannot modify header information – headers already sent 
by (output started at C:\wamp\www\test\index.php:1) 
in C:\wamp\www\test\index.php on line 2
```

Podczas wykonania kodu:

```php
<?php
echo(„text”);
header(„Content-type: text/html”);
?>
```

Dlaczego? Powodem jest wysłanie do przeglądarki jakiegoś tekstu, przed wysłaniem nagłówków. Zwykle wystarczy po prostu umieścić funkcję header przed wysyłaniem jakielkolwie treści, może jednak zdarzyć się, że nie możemy tego zrobić. W takim wypadku można użyć funkcji buforowania wyjścia:

- ob_start(); - rozpoczyna buforowanie
- ob_end_flush(); - kończy buforowanie wyjścia i wysyła zawartość bufora do przeglądarki
- ob_get_flush(); – to samo, co ob_end_flush(), tyle, że zwraca zawartość bufora;
- Więcej funkcji i informacje na ich temat można znaleźć w manualu php.

Poniżej jest przykład użycia funkcji buforowania wyjścia.

```php
<?php
ob_start();
echo(„text”);
header(„Content-type: text/html”);
ob_end_flush();
?>
```