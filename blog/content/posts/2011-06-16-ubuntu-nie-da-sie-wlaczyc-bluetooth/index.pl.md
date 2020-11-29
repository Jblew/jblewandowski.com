---
title: '[Ubuntu] Nie da się włączyć bluetooth'
date: 2011-06-16T00:00:00+01:00
aliases:
  - /index.php/2011/06/ubuntu-nie-da-sie-waczyc-bluetooth/
  - /2011/06/ubuntu-nie-da-sie-waczyc-bluetooth/
categories:
tags:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Miałem dzisiaj taki problem, że nie mogłem ponownie włączyć bluetooth na moim laptopie. Cały czas pokazywał mi się przycisk włącz bluetooth. Najwyraźniej jest to jakiś błąd w nowej wersji (11.04), bo wcześniej nie miałem takiego problemu. Na szczęście, żeby to naprawić wystarczy wpisać w terminalu:

```
sudo /etc/init.d/bluetooth restart
```

i po sprawie. :)