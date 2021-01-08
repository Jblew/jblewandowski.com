---
title: 'Jak zwiększyć zużycie ramu w Javie [PL]'
date: 2011-03-12T00:00:00+01:00
aliases:
  - /index.php/2011/03/jak-zwiekszyc-zuzycie-ramu-w-javie/
  - /2011/03/jak-zwiekszyc-zuzycie-ramu-w-javie/
category:
  - programowanie
  - java
  - polski
tag:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

We wszystkich podręcznikach o programowaniu przytacza się zasadę, że kodu nie wolno optymalizować. I nawet nie próbuj programisto, bo popsujesz! Nie jestem zwolennikiem takiego myślenia, bowiem czasem zdarza się, że napiszemy bardzo nieoptymalny kod i warto go zoptymalizować (oczywiście, cudzego kodu optymalizować nie wypada ;P).

Dlaczego to piszę? Jak we wszystkich poprzednich postach, znowu muszę wspomnieć o mudzie… Podczas pisania zauważyłem, że gdy użytkownik wyda jakąkolwiek komendę, zużycie ramu zwiększa się nawet o 50kb! Na szczęście szybko znalazłem przyczynę. Okazało się, że, jak zwykle winny jest programista, a nie kto inny. Otóż gdy użytkownik wpisywał komendę tworzona była nowa klasa Command, która tą komendę przetwarzała. I tu był błąd! Przy każdym tworzeniu tej klasy kompilator musiał zarezerwować pamięć. Szybko zorientowałem się, o co chodzi i poprawiłem kod tak, że klasa Command jest tworzona, gdy użytkownik wejdzie do gry, a potem jest wywoływana tylko jej metoda. Wspaniały profiler netbeansa pokazał wyraźnie różnicę w zużyciu pamięci.