---
title: Marines MUD – W pogoni za RAMem
date: 2011-02-06T00:00:00+01:00
aliases:
  - /index.php/2011/02/marines-mud-w-pogoni-za-ramem/
  - /2011/02/marines-mud-w-pogoni-za-ramem/
categories:
tags:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Od dwóch tygodni piszemy z Progtrykiem MUD-a. MUD był jego pomysłem, ale postanowiłem przyłączyć się do projektu. MUD nazywa się Marines. Akcja toczy się w roku 2063, zaraz po III Wojnie Światowej. Ponieważ III Wojna Światowa rozciągała się niemiłosiernie długo, i istniała realna groźba zniszczenia przez ludzi naszej błękitnej planety, ktoś w jakiś sposób zniszczył wszystkie nowoczesne bronie i sprawił, że ludzie zapomnieli dla kogo walczą. W jednej chwili przestały istnieć państwa i hierarchia. Zapanował totalny chaos i anarchia. W grze, każdy walczy sam, przeciwko innym graczom. Na domiar złego, natura wybrała akurat ten moment, aby przemagnesować bieguny, w rezultacie czego, zmieniły się kontynenty i ziemia wygląda zupełnie inaczej. No, to tyle o historii. Potem ją dopracujemy i wrzucimy na stronę muda (marines.jblew.pl). Jeśli ktoś ma ochotę wypróbować muda, to zapraszam:
`telnet 91.210.130.79 9000`

## Kod

No to teraz opowiem troche o kodzie. Gdyby ktoś chciał go obejrzeć, może to uczynić przez Subversion. Bieżąca wersja projektu znajduje się w folderze v2:

```
svn co svn://91.210.130.79/marines-mud marines-mud
```

Na samym początku postanowiliśmy, że podzielimy muda na program serwera i skrypt obsługujący użytkownika (oddzielny dla każdego usera). Po uruchomieniu serwer oczekiwał na nadchodzące połączenia. Gdy już jakieś zaakceptował, przenosił je do oddzielnego wątku i uruchamiłałał skrypt do obsługi użytkownika. Wątek odbierał dane do użytkownika, aby wysyłać je do skryptu i vice versa.

Pierwsza wersja muda była oparta na architekturze **JAVA+PHP+MYSQL**. OMG!? No właśnie… nie najszczęśliwsze połączenie. Problemem tej wersji była właściwie tylko java. Java jest fajna do programowania, bo prawie wszystko robi za programistę i zawiera mnóstwo bibliotek, które znacznie ułatwiają pracę. Zaraz, zaraz! Mnóstwo bibliotek = mnóstwo zużywanej pamięci! Największym problemem „javovej” wersji było horrendalne zużycie ramu. Na początek skrypt zabierał ok 70mb ramu, a potem zabierał kolejne 16mb na każdego użytkownika. Koszmar!

Zaraz potem próbowaliśmy szczęścia z pythonem zamiast javy. Jednak z pythonem był taki problem, że nijak nie mogliśmy zmusić biblioteki socketserver aby umożliwiła nam ponowne używanie portu.

Wreszcie postanowiliśmy w roli serwera użyć programu napisanego w c++. Nadal jednak mieliśmy problemy, tym bardzoej, że żaden z nas nie był doświadczonym programistą tego zacnego języka.

Ostatecznie zdecydowaliśmy się scalić skrypt z serwerem i tak powstała najnowsza wersja muda, w całości napisana w php. Sprawuje się bardzo dobrze, nie zużywa nadmiernie pamięci i ogólnie jestem z niej bardzo zadowolony. Dlatego opiszę ją dokładniej.

## Wielowątkowość w php

Wiele lat myślałem że to niemożliwe. Cały czas zdawało mi się, że w php nie ma wielowątkowości. Kilka dni temu dowiedziałem się, że jednak jest! Ale tylko w systemach﻿ uniksowych. Jako, że jestem już szczęśliwym posiadaczem ubuntu, nie stanowi to żadnego problemu. Znalazłem też w sieci fajną klasę, która umożliwia czytelniejszą obsługę wątków w obiektowym stylu. Dzięki tej klasie obsługa wątków jest dziecinnie prosta. Autor zamieścił przykłady jej zastosowań.

## Pierwsze uruchomienie

Jeśli ktoś chce uruchomić u siebie serwer, albo stworzyć innego muda na podstawie kodu, nie ma problemu. Proszę tylko o pozostawienie informacji o autorach (można dopisać swoje autorstwo).

Aby uruchomić muda należy najpierw utworzyć bazę danych phpmud, a następnie zaimportować tabele z pliku ./v2/other/sql/phpmud.sql. Kolejną sprawą jest ustawienie loginu i hasła do bazy danych, w plikach: ./v2/includes/mysql.php, ./v2/includes/globalMysql.php i ./v2/lib/class.mudUser.php. We wszystkich powinny znajdować się te same dane. Potem otwieramy trzy konsole, lub trzy okna screena, jak kto woli i w jednym uruchamiamy polecenie `php tickers.php`, w drugim `php mobs.php`, a w trzecim `php phpMudServer.php`. Jeśli wszystko będzie działało, w ostatnim oknie powinniśmy zobaczyć taki ekran:

```
   +----------------------------------+
   |   MudServer For PHP Muds v0.51   |
   +----------------------------------+
   |   Written by:                    |
   |        +JBLEW (www.jblew.pl)     |
   |        +PROGTRYK                 |
   +----------------------------------+

Setting server online...
Starting console reader...
Wpisz quit aby zakończyć program.
Starting SVNUpdater...
Listening on port 9000...
[0s od uruchomienia] Mysqli działa prawidłowo!
W wersji 418.
```

## Jak to wszystko działa?

Skoro już uruchomiłeś muda, to opiszę teraz, jak on działa.
Pierwszy uruchomiony program – tickers.php jest mudowym odpowiednikiem crona. Tam wykonują się wszystkie periodyczne operacje, jak np. informowanie użytkowników o dniu/nocy, czy resetowanie obiektów w roomach.

Drugi program – mobs.php docelowo będzie obsługiwał moby, narazie jednak nie robi nic. Możesz go wyłączyć.

Najważniejszy jest trzeci skrypt – phpMudServer.php – to on obsługuje całego muda i co 30 sekund aktualizuje SVN.  Otwórz teraz w jakimś edytorze ten plik i zjedź aż do miejsca, gdzie znajduje się polecenie set_time_limit(0); Z pewnością wiesz, po co je tam umieściłem. Prawdziwa zabawa zaczyna się dopiero od linijki set_server_online(„1″);. Funkcja ta wpisuje „1″ do pliku data/online.dat, co jest dla skryptów znakiem, że serwer pracuje. Dalej uruchamiamy wątek consoleReader, który odczytuje kolejne linie z stdin i oczekuje aż wpiszemy quit. Wtedy wykona polecenie set_server_online(„0″);, dzięki czemu reszta wątków będzie wiedziała, że czas się wyłączyć. Dalej tworzymy nasłuchujące gniazdo, a potem w pętli oczekujemy połączenia, przy okazji co sekundę wysyłając bezsensowne polecenie do mysql-a, aby utrzymać połączenie. Gdy nowy użytkownik się połączy, serwer uruchamia wątek userThread. Przenieśmy się zatem do tej funkcji. Tworzy ona klasę MudUser i przekazuje jej gniazdo, oraz wątek. Następnie wywołuje metodę run, i od teraz użytkonik jest przenoszony do skryptu ./v2/lib/class.mudUser.php.

No. Na dzisiaj to wystarczy, jutro, albo pojutrze opiszę, co się dalej dzieje w tej klasie. Dziękuję za uwagę!


## Komentarze (archiwum ze starej strony)

> Dobree. :D
> 
> — progtryk on Luty 6th, 2011 at 14:29
