---
title: Prosty sposób na zaokrąglone rogi w JavaScript
date: 2010-09-06T00:03:06+01:00
aliases:
  - /index.php/2010/09/prosty-sposob-na-zaokraglone-rogi-w-javascript/
  - /2010/09/prosty-sposob-na-zaokraglone-rogi-w-javascript/
categories:
tags:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Ostatnio przeglądałem internet w poszukiwaniu prostego sposobu na zaokrąglone rogi w javascript bez żadnych obrazków, i znalazłem [jQuery corner](http://jquery.malsup.com/corner/). Jest to prosty plugin do jQuery który pozwala nam tworzyć dowolne rogi dowolnych elementów! Obsługa jest naprawdę prosta i sprowadza się do takiego kodu:

```html
<script type="text/javascript">
$('#corner-div').corner('20px');
</script>
```

Jak widzicie obsługa tej biblioteki jest naprawdę prosta, a na [stronie domowej projektu](http://jquery.malsup.com/corner/) można poczytać o wielu zastosowaniach i różnych opcjach tej wtyczki. Jej minusem jest to, że wymaga ona do działania jQuery, co wymaga dodatkowych 24kb do przesłania. Ale przy obecnych prędkościach łącz jest to coraz mniejszym problemem.


## Komentarze (archiwum ze starej strony)

> Dzięki przydatne :)
>
> — tomek on Kwiecień 21st, 2011 at 10:17
