---
title: '[PHP] Prosty sposób na odczytywanie danych XML'
date: 2011-01-12T00:00:00+01:00
aliases:
  - /index.php/2011/01/php-prosty-sposob-na-odczytywanie-danych-xml/
  - /2011/01/php-prosty-sposob-na-odczytywanie-danych-xml/
category:
tag:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Jak zapewne zauważyliście dodałem na bloga skrypt wyświetlający wpisy z twittera między wpisami z bloga. Zanim jednak można będzie wyświetlić dane, trzeba je najpierw pobrać z serwera. Najłatwiejszym sposobem na pobranie wpisów twittera jest odczytanie kanału rss danego użytkownika.

Z każdego znacznika `<item>` (w kanale rss) potrzebujemy 3 znaczników: `<title>, <pubDate> i <link>`.

Niektórzy pewnie chcieliby pewnie wyciągnąć te dane używając wyrażeń regularnych. Do dzisiaj należałem do tych ludzi. Używanie bibliotek parsujących xml wydawało mi się skomplikowane i nieprzyjemne. Jednak w istocie tak nie jest. PHP posiada łatwą w użyciu bibliotekę DOMDocument. W naszym wypadku kod jest naprawdę krótki:

```php
$objDOM = new DOMDocument();
    //pobieramy kanal rss i tworzymy liste zawierajaca elementy ITEM
$objDOM->load("http://adres.kanalu.rss/z/twittera"); 
$items = $objDOM->getElementsByTagName("item");

foreach( $items as $item ) {        
    //w petli wyciagamy wartosci z poszczegolnych znacznikow
    $title  = $item->getElementsByTagName("title")->item(0)->nodeValue;
    $pubDate = $item->getElementsByTagName("pubDate")->item(0)->nodeValue;
    $link = $item->getElementsByTagName("link")->item(0)->nodeValue;
}
```

Jak widzicie korzystanie z tej biblioteki to czysta przyjemność. ;) Wszystko można zrobić szybko i sprawnie. Kod łatwo jest zmodyfikować do swoich potrzeb.