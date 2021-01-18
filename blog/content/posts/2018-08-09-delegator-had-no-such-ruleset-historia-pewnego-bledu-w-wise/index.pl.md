---
title: '"Delegator had no such ruleset" — historia pewnego błędu w WISE [Kopia ze Steem/Hive] [PL]'
date: 2018-08-09T00:00:00+01:00
category:
  - steem
  - hive
  - blockchain
  - wise
  - polski
tag:
cover:
    image: "bugarticle.jpg"
    alt: "Wise, blockchain a przyroda"
    caption: "Wise, blockchain a przyroda"
---


> W latach 2018-2019 pracowałem w startupie blockchainowym jako Architekt aplikacji wspomagającej delegowanie voting power na platformie Steem.
> 
> Od tego czasu wiele się zmieniło:
> 1. Ze względu na spadek ceny tej kryptowaluty zrezygnowaliśmy z prowadzenia startupu Wise
> 2. Doszło do próby przejęcia Steema przez firmę, która zakupiła Steemit (twórców blockchainu Steem)
> 3. Dzięki szybkiej i zorganiowanej akcji Witnessów Steem został przeniesiony na Hive
> 
> Ze względu na niestabilną sytuację i niepewną przyszłość Steem oraz Hive — zdecydowałem sie na przeniesienie treści z blockchainu na własną stronę internetową.

> Oryginalny post tu: https://hive.blog/polish/@jblew/delegator-had-no-such-ruleset-historia-pewnego-bledu-w-wise

![Wise, blockchain a przyroda](bugarticle.jpg)

## "Delegator had no such ruleset" — historia pewnego błędu w WISE

> TLDR: Delegatorzy powinni zaaktualizować wise do wersji 0.19.5.

Nic tak nie denerwuje jak błąd, który uniemożliwia korzystanie z ulubionego programu. Szczególnie, jeżeli nic z nim nie możemy zrobić. Zwykle błędy są trywialne i udaje się je rozwiązać w ciągu kilku godzin. W przypadku tego błędu było jednak inaczej.

"Delegator had no such ruleset", opisany w https://github.com/noisy-witness/steem-wise-cli/issues/9 od początku stwarzał nam kłopoty. Problem występował niestale. Można by rzec — z rzadka. Pojawiał się raz na kilkadziesiąd voteorderów. Został zgłoszony przez @noisy 29 czerwca. Nie wydawał się wtedy dużym kłopotem, jako że nie występował często.

Niestety — w pierwszych dniach sierpnia sprawy nabrały rozpędu. Po dosyć dużej zmianie w kodzie przetwarzającym transakcje z blockchainu, która była konieczna do zaimplementowania reguły weight_for_period, błąd zaczął się pojawiać w praktycznie każdym przypadku. Zaczęliśmy intensywną diagnostykę. Napisałem specjalne automatyczne testy, które miały weryfikować błąd, próbowaliśmy odtworzyć sytuacje, które występowały na koncie @noisy. Cała sytuacja była o tyle ciekawa, że ani razu nie udało mi się odwtorzyć tych błędów na moim komputerze. Natomiast błąd na koncie @noisy szalał. Zaczęło dochodzić do sytuacji, w której użytkownicy byli walidowani według cudzych reguł.

Muszę przyznać, że kolejne dni przepełnione były frustracją. Postanowiliśmy stworzyć specjalny system raportowania wydarzeń (zdalne udostępnianie logów). Uruchomienie tego systemu diagnostycznego przyniosło zupełnie niespodziewany rezultat. Na serwerze Krzysztofa błędy przestały się pojawiać, synchronizacja przebiegała gładko. Jak to mówią programiści: **działa! — dziwne**.

W tym momencie skończyły nam się pomysły. Z braku lepszego zajęcia zacząłem przeglądać historię zmian w kodzie biblioteki. Wtedy natrafiłem na tę poprawkę:

```
https://github.com/noisy-witness/steem-wise-core/commit/0f32bb72c53de75053cdb004c4074b5b587fcf7f#diff-f0e55e336caf39ba655940f5ace4148eR149
```

którą sam napisałem parę dni wcześniej. Po zastanowieniu, doszedłem do wniosku, że kod, który w niej został poprawiony, wygląda na taki, który mógł spowodować wybór błędnego zestawu reguł do walidacji.

W tym momencie uruchomiłem tzw. test regresyjny. Tzn. usunąłem tę poprawkę i skompilowałem program na serwerze. Po uruchomieniu okazało się, że błąd znowu występuje. To potwierdziło nam, że problem od początku leżał w tym miejscu. Zatem został rozwiązany już kilka dni wcześniej, a my nie zdawaliśmy sobie z tego sprawy! Przez "cichą naprawę" u mnie — w zaaktualizowanej wersji daemona błędu nie było, natomiast u Krzysztofa — w starszej wersji, błąd hulał w najlepsze.

Morał z tej historii jest taki: nigdy nie naprawiać błędów bez uprzedniego napisania testów. Gdybym nie naprawił tego błędu "po cichu" — dużo szybciej zorientowalibyśmy się gdzie leży problem.

W związku z tym na przyszłość planujemy wprowadzić dokładniejsze testy jednostkowe, a przede wszystkim stworzyć środowisko testów scenariuszowych, tj. stworzyć takiego naszego "udawanego" użytkownika, który będzie korzystał z wise wg ustalonego scenariusza — i raportował nam wszelkie błędy i problemy :)

Jak widzicie, rozwiązanie tego problemu nie było łatwe. Wszystkich, którzy nie mogli z jego powodu korzystać z Wise serdecznie przepraszam.

Zapraszam do zaaktualizowania WISE do wersji 0.19.5 :)

```bash
$ npm install -g steem-wise-cli
```




***
***

> Tekst był opublikowany w kanale #pl-wise

## Komentarze — kopia komentarzy z blockchainu steem

> **jacekw**
> Warto jakbyś jeszcze zrobił jakieś ELI5 na czym polegał błąd, bo dla dużej części osób to ciągle może być czarna magia :)

> **jblew**
> Cóż. Sam błąd był prosty. Trudne było jego znalezienie. Niełatwo wyjaśnić działanie błędu bez wyjaśniania wewnętrznego mechanizmu działania wise ;) W skrócie: w momencie zmiany przetwarzania z operacji na transakcje — wyrażenie warunkowe if w miejscu odpowiedzialnym za wybór rulesetu do walidacji voteorderu powinno zostać zmienione, aby przystawało, ale nie zostało zmienione do końca, co spowodowało powstanie błędnego zlepka kodu, który zawsze zwracał prawdę. Ale nie to jest tutaj nauczką dla nas. Kod WISE jest pisany razem z ogromną ilością testów jednostkowych (ok 400). Staram się, aby cały kod był nimi pokryty. W tym miejscu jednak była luka. Nauczki są dwie: 1) dokładniejesze testy jednostkowe, 2) testy scenariuszowe. Im więcej testów, tym mniej potencjalnych błędów. Działają jak sito. Teraz trzeba tylko zmniejszyć oczka ;)

> **nicniezgrublem**
> Wyciągnięty wniosek powinien być inny raczej: na nic zdają się testy jednostkowe bez testów integracyjnych :P

> **saunter**
> Czyli już można kurować? :P

> **jblew**
> Można! :)

> **perduta**
> Po raz kolejny STEEM został uratowany.
> Dziękuję Jędrzeju.

> **jblew**
> Zapomniałem jeszcze podziękować @nicniezgrublem i @noisy za ich dużą pomoc przy rozwiązywaniu tego problemu! :)