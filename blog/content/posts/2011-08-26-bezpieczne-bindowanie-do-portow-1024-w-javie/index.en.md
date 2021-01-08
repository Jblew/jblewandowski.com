---
title: 'Bezpieczne bindowanie do portów < 1024 w javie [PL]'
date: 2011-08-26T00:00:00+01:00
aliases:
  - /index.php/2011/08/bezpieczne-bindowanie-do-portow-1024-w-javie/
  - /2011/08/bezpieczne-bindowanie-do-portow-1024-w-javie/
category:
 - java
 - programowanie
 - polski
tag:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 


W linuksach, żeby otworzyć gniazdo nasłuchujące na porcie od 0 do 1024, trzeba mieć prawa roota. Teoretycznie można uruchomić serwer z prawami roota, ale czy to bezpiecznie? Są aż dwa sposoby rozwiązania tego problemu, umożliwiające nasłuchiwanie na porcie 80, bez praw roota i bez rekompilacji jądra.

Pierwszy sposób to ustawienie przekierowania pakietów. Można do tego użyć programu **socat**. Najpierw musimy ustawić w aplikacji nasłuchiwanie na jakimś z „wyższych” portów, a następnie uruchomić program socat na koncie roota:

```bash
socat TCP-LISTEN:80,fork,su=nobody,reuseaddr TCP:127.0.0.1:8080 # przy takiej konfiguracji program socat przekieruje pakiety z portu 80, na port 8080.
```

Wadą sposobu z przekierowaniem jest to, że zużywamy w ten sposób więcej systemowych zasobów, a po drugie, nasza aplikacja nie może odczytać adresu ip osoby, która się połączyła z serwerem.

## Lepszy sposób

O wiele lepszym sposobem byłoby uruchomienie aplikacji z prawami roota, wykonanie wszystkich akcji wymagających uprawnień (np. otwarcie gniazda serwera na porcie 80) i utracenie przywilejów – przejście do trybu zwykłego użytkownika. Tylko jak to zrobić w javie? Z pomocą przychodzi nam biblioteka Apache Commons Daemon. Uruchamia ona naszą aplikację jako systemowy Daemon. Z prawami roota wywołuje funkcję init() naszego programu, a następnie traci prawa roota i wywołuje funkcję start(). Można ją pobrać tu. Biblioteka składa się z dwóch częsci. Jedna – to bilbioteka napisana w javie – musimy ją dołączyć do aplikacji, a druga, to narzędzie jsvc, które możemy pobrać z powyższej strony, a w niektórych systemach zainstalować z repozytorium: apt-get install jsvc.

Na początek musimy zmodyfikować naszą aplikację. Tworzymy nową klasę, która będzie implementowała interfejs Daemon:

```java
package myapp;
import org.apache.commons.daemon.Daemon;
import org.apache.commons.daemon.DaemonContext;
import org.apache.commons.daemon.DaemonInitException;
/**
 *
 * @author jblew
 */

public class Main implements Daemon {

    public void init(DaemonContext dc) throws DaemonInitException, Exception {
        /**
         * Ta funkcja jest uruchamiana pierwsza, z prawami roota. Tutaj należy otworzyć sockety na portach mniejszych niż 1024, np. 80.
         */
    }

    public void start() throws Exception {
        /**
         * Ta metoda jest uruchamiana druga, po init(), ale już bez praw roota. Tutaj uruchamiamy aplikację.
         */
    }
   
    public void stop() throws Exception {
        /**
         * Tutaj zakańczamy aplikację.
         */
    }

    public void destroy() {
        /**
         * A tu powinniśmy zniszczyć obiekty utworzone przez funkcję init().
         */
    }
}
```

Ta klasa będzie odpowiedzialna za uruchamianie naszego programu. Teraz pozostała jeszcze tylko kwestia, jak to zrobić.
Do uruchamiania tak spreparowanej aplikacji służy polecenie jsvc. Postaram się to wytłumaczyć na przykładzie:

```bash
sudo jsvc -user [nazwa użytkownika] -debug -cp MyApp.jar myapp.Main

# To polecenie uruchomi opisane wyżej funkcje klasy myapp.Main, z pliku MyApp.jar. Dzięki parametrowi -debug zobaczymy wyjście apikacji i wszystkie błędy, jakie wystąpią. Koniecznie musimy dołączyć parametr -user, bo inaczej cała aplikacja będzie działała z prawami roota, a po dołączeniu tego parametru, dalsza część aplikacji przejdzie na konto użytkownika, którego podamy.
```

I to w zasadzie wszystko. Chciałbym jeszcze tylko pokazać, jak można restartować i wyłączać daemona, bo nie da się tego zrobić w standardowy sposób. Najłatwiej to zrobić z wewnątrz naszego programu. Zauważ, że funkcja init(DaemonContext dc) przyjmue jako parametr obiekt DaemonContext, który umożliwia pobranie kontrolera daemona (metodagetController()). Właśnie Kontroler Daemona (DaemonController) umożliwia wyłączenie aplikacji metodą shutdown() i restart – metodą reload(). Wystarczy więc zachować kontroler po uruchomieniu funkcji init() i w odpowiednim czasie wykonać funkcje wyłączające.