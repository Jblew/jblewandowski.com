---
title: Śledzenie pakietów w windows [PL]
date: 2009-08-12T00:03:06+01:00
aliases:
  - /index.php/2009/08/sledzenie-pakietow-w-windows/
  - /2009/08/sledzenie-pakietow-w-windows/
category:
  - inne
  - polski
tag:
summary: |
  Śledzenie drogi, jaką pakiety danych przebywają od serwera, do naszego komputera nie jest potrzebne, ale może być ciekawe. Postaram się po krótce pokazać, jak sprawdzić drogę pakietów.
---


> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Śledzenie drogi, jaką pakiety danych przebywają od serwera, do naszego komputera nie jest potrzebne, ale może być ciekawe. Postaram się po krótce pokazać, jak sprawdzić drogę pakietów.

Uruchamiamy Wiersz Polecenia.
Wpisujemy polecenie tracert i nazwę domeny(bez protokołu), np: tracert www.jblew.ovh.org. Po wpisaniu polecenia i po odczekaniu kilku chwil, powinniśmy zobaczyć następujący wydruk:

```
C:\Users\Jędrzej>tracert www.jblew.ovh.org
```

Śledzenie trasy do www.jblew.ovh.org [213.251.131.44]
z maksymalną liczbą 30 przeskoków:

```
1 * * * Upłynął limit czasu żądania.
2 26 ms 27 ms 26 ms ols-ru2.neo.tpnet.pl [213.25.2.153]
3 26 ms 30 ms 25 ms z.ols-ru2.do.ols-r2.tpnet.pl [213.25.12.245]
4 34 ms 35 ms 34 ms 194.204.175.89
5 55 ms 53 ms 55 ms pos0-6-0-0.ffttr1.FrankfurtAmMain.opentransit.net [193.251.250.113]
6 * * 61 ms 10g.fra-1-6k.routers.chtix.eu [91.121.131.57]
7 64 ms * 65 ms 20g.th2-1-6k.routers.chtix.eu [213.251.130.13]
8 * 65 ms 71 ms 80g.p19-2-6k.routers.chtix.eu [213.186.32.150]
9 64 ms 64 ms 62 ms 213.251.131.44
```

Śledzenie zakończone.

Jeśli we wpisach (poza pierwszym) dostaliśmy komunikat, że upłynął limit czasu żądania, możemy spróbować zmienić limit, dodając do polecenia parametr -w liczba milisekund, np.: `tracert -w 8000 www.jblew.ovh.org`. Jeśli przeskoków było więcej niż 30, także można zwiększyć limit dodając parametr `-h liczba przeskoków`, np.: `tracert -h 50 www.jblew.ovh.org`

Następnie, jeśli chcemy zobaczyć drogę na mapie, można skorzystać z któregoś narzędzia, do geolokalizacji IP, których na pewno znajdziemy dużo w google, np. http://mojadresip.pl/geolokalizacja/. Wpisujemy tam adresy IP z listy.