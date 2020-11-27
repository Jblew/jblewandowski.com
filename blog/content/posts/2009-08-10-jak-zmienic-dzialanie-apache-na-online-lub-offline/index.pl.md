---
title: Jak zmienić działanie apache na online lub offline.
date: 2009-08-10T00:03:06+01:00
aliases:
  - /index.php/2009/08/jak-zmienic-dzialanie-apache-na-online-lub-offline/
  - /2009/08/jak-zmienic-dzialanie-apache-na-online-lub-offline/
categories:
  - programowanie
tags:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Aby strona była dostępna tylko na lokalnym komputerze należy dodać taki wpis w konfiguracji apache :

```
Order Deny,Allow
Deny from all
Allow from 127.0.0.1
```

Aby strona była dostępna w sieci należy dodać taki wpis:

```
Order Allow,Deny
Allow from all
```

Albo po prostu zainstalować jakiś pakiet serwerów, np. WAMPServer, którego mocno rekomenduję, gdyż:

- można przełączać między offline a online jednym kliknięciem,
- można włączać i wyłączać moduły i ustawienia php i apache jednym kliknięciem.

WAMPServer można pobrać ze strony http://www.wampserver.com/en/download.php.