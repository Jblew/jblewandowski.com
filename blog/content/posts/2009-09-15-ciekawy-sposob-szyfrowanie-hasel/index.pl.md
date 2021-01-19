---
title: Ciekawy sposób szyfrowanie haseł [PL]
date: 2009-09-15T00:03:06+01:00
aliases:
  - /index.php/2009/09/ciekawy-sposob-szyfrowanie-hasel/
  - /2009/09/ciekawy-sposob-szyfrowanie-hasel/
category:
  - bezpieczenstwo
  - polski
tag:
summary: |
  Błędy młodości i fałszywe przekonania (komentarz z 2020)
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Ostatni znalazłem ciekawy sposób na szyfrowanie haseł:

```
ço\kÍ9Ń­4×Í;÷GóĆúßŽĽónš –   Jaki to szyfr?
```

To jest ciąg hehe zaszyfrowany najpierw w md5 a potem odszyfrowany za pomocą base64.
`base64_decode(md5("hehe"))` Pozornie to nic, a nawet mogą wystąpić trudności z przesłaniem tego przez protokół http, a poza tym ktoś może wpaść na pomyśł zaszyfrowania tego za pomocą base64 i wtedy dostanie nasze szyfr md5, i może go szybko złamać za pomocą tęczowych tablic lub metodą siłową.

Nasz szyfr staje się użyteczny dopiero po ponownym zakodowaniu tego w md5: md5(base64_decode(md5("hehe"))) Nikt nie będzie widział, jakie dziwne znaki kryje nasz hash, poza tym większość programów do łamania hashów md5 nie uwzględnia takich znaków, bo po prostu każdy dodatkowy znak wydłuża czas łamania szyfru, a tu mamy ich całkiem dużo.

### Komentarze (kopia z dawnej strony)

> Świetny pomysł :d Ciekawe tylko, czy nie byłoby problemów z kodowaniem pomiędzy bazą a stroną.
> — *widmo on Marzec 7th, 2010 at 16:05*