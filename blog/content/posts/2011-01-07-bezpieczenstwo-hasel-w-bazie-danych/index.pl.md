---
title: Bezpieczeństwo haseł w bazie danych
date: 2011-01-07T00:00:00+01:00
aliases:
  - /index.php/2011/01/bezpieczenstwo-hasel-w-bazie-danych/
  - /2011/01/bezpieczenstwo-hasel-w-bazie-danych/
categories:
tags:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

> Disclaimer: oczywiście z perspektywy czasu zdaję sobie sprawę, że byłem w błędzie.

Życzę wszystkim radosnych Świąt i szczęśliwego nowego roku!

Zauważyłem, że bardzo powszechne jest stwierdzenie, iż o bezpieczeństwie haseł decyduje ich długość, natomiast całkowicie zapomina się w tym momencie o algorytmie, który tworzy skrót. Na bardzo wielu stronach tworzenie skrótu wygląda tak: md5($hash). Funkcja jest bardzo prosta, wykonuje się szybko…
No właśnie, wykonuje się szybko… Działa to bardzo na korzyść hakera, który najczęściej, aby poznać hasło, szyfruje (takim samym algorytmem) po kolei miliony ciągów znaków i porównuje z hashem wykradzionym z naszej bazy danych. W jego interesie jest to, aby wszystko odbyło się jak najszybciej.
Natomiast właściciel strony internetowej, zwykle, nie musi porównywać milionów ciągów na sekundę, więc może sobie pozwolić na nieco dłuższe wykonywanie kodu.
Postanowiłem wykonać kilka pomiarów na swoim komputerze. Tworzenie skrótu `md5("test");` trwa ok. 16us. Natomiast poniższy kod:

```php
$str = md5("test");
for($i = 1;$i < 5000;$i++) {
  $str = md5(base64_encode($str));
}
```

wykonuje się w 8000us, czyli 8ms, czyli 0.008 sekundy. Cóż to jest dla systemu… Użytkownik nawet nie mrugnie, gdy skróty jego haseł zostaną porównane. Jednak haker będzie przez to łamał hasło 500 razy dłużej!

Oczywiście to „zabezpieczenie” będzie użyteczne dopiero gdy hakerowi uda się włamać na stronę, jednak nie możemy wykluczać takiego przypadku, a każda forma obrony naszej witryny jest warta zastosowania!


## Komentarze (archiwum ze starej strony)

> Tworzenie hasha z hasha nie jest dobrym pomysłem. Istnieje jakaś zależność, że kilkukrotne uzyskiwanie skrótu md5 (bądź innego) z jakiegoś ciągu znaków powoduje, że ciąg md5 jest łatwiejszy do odgadnięcia. Należy przy tym pamiętać, że hashowanie jest operacją jednostronną, tj. w skrajnych przypadkach można uzyskać takie same hashe z kilku haseł. Dużo efektywniejsze jest po prostu zastosowanie innego algorytmu, chociażby sha256.
>
> — Piotr Ostrowski on Marzec 23rd, 2011 at 20:30

> Tak naprawdę, to ani md5, ani sha nie są już bezpieczne. Trzeba kombinować, jak kto potrafi. Niemniej jednak sztuczki w tym stylu, mogą utrudnić życie hakerom.
> 
> — JBLew on Marzec 24th, 2011 at 13:10

> No właśnie nie za bardzo widzę te korzyści z przytoczonego fragmentu kodu. Sama operacja hashowania oczywiście wykonuje się dłużej, ale hashowanie hashy skutkuje tym, że hashe wynikowe są prostsze do odgadnięcia, co powoduje, że i tak szybciej znajdziemy pasujące hasło. Przynajmniej tyle zapamiętałem z wykładów kryptologii :)
> A co do bezpieczeństwa sha, tu bym się kłócił. Proponuję spróbować znaleźć hasło do skrótu sha-512. Zresztą na domowe warunki sha-256 byłoby już o wiele za dużo. Wszystko tak naprawdę zależy od tego, co zabezpieczamy, ale mimo wszystko md5 nie powinno być już używane.
> 
> — Piotr Ostrowski on Marzec 25th, 2011 at 0:43

> Hmm, myślę, że masz rację. Heh… Będę musiał pozmieniać moje „kwiatki” w paru miejscach. Można jeszcze oprócz sha zastosować dodatkowo jakiś rzadko używany algorytm.
> 
> — JBLew on Marzec 25th, 2011 at 11:07

> SHA daje wystarczające zabezpieczenie, jeśli chodzi o hashowanie hasła. Pamiętaj też, że włamywacz nie koniecznie będzie dostawał się do zabezpieczonych danych przez panel logowania, może np. wykorzystać jakąś lukę i próbować się dostać bezpośrednio do bazy danych. Dlatego lepszym dodatkiem od sztucznego wydłużania czasu hashowania byłoby wprowadzenie czasowego limitu ilości niepoprawnych logowań do systemu, np. po 3 błędnych próbach logowania blokować dostęp na kilka minut.
> 
> — Piotr Ostrowski on Marzec 26th, 2011 at 17:29
