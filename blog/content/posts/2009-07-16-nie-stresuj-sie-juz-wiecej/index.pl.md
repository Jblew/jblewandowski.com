---
title: nIE stresuj się już więcej
date: 2009-07-16T00:03:06+01:00
aliases:
  - /index.php/2009/07/nie-stresuj-sie-juz-wiecej/
  - /2009/07/nie-stresuj-sie-juz-wiecej/
category:
  - webmastering
  - programowanie
tags:
 - Internet Explorer
 - Java
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Pisałem, już że powoli kończy się przydługi żywot IE 6, narazie jednak jeszcze trochę musimy poczekać, a poza tym błędy są i w nowszych przeglądarkach giganta z Redmont, tak więc należy się nimi zająć:

## Jak sprawdzić wygląd i działanie strony w starszych wersjach IE?

Często spotykamy się z sytyuacją gdy użytkownicy naszej strony używają starszej wersji przeglądarki niż my, jest to spory problem szczególnie z Internet Explorerem, który w starszych wersjach jest naprawdę nieprzewidywalny. Aby sprawdzić stronę w starszych wersjach IE na pewno nie polecam instalowania ich. Najlepiej zainstalować specjalny program, jak np. [IETester](http://www.my-debugbar.com/wiki/IETester/HomePage), którego gorąco polecam do takich zastosowań.

![Ietester](http://www.jblew.ovh.org/wp-content/uploads/2009/07/ietester-1024x616.jpg)

Poprawianie wyglądu strony dla IE.

Gdy już wiemy, jak wygląda nasza strona w różnych wersjach IE czas zapobiec błędom. Microsoft w IE wprowadził specjalny znacznik, który inne przeglądarki interpretują jako komentarz, a Internet Explorer jako normalny kod HTML. Możliwe jest nawet uzależnienie go od wersji IE.

```html
<!--[if IE]>
kod HTML dla wszystkich wersji IE
<![endif]-->

<!--[if IE 8]>
kod HTML dla IE 8
<![endif]-->

<!--[if IE 7]>
kod HTML dla IE 7
<![endif]-->

<!--[if IE 6]>
kod HTML dla IE 6
<![endif]-->


<!--[if lt IE 8]>
kod HTML dla IE starszych niż IE 8
<![endif]-->

<!--[if lt IE 7]>
kod HTML dla IE starszych niż IE 7
<![endif]-->


<!--[if lt IE 6]>
kod HTML dla IE starszych niż IE 6
<![endif]-->

<!--[if gt IE 8]>
kod HTML dla IE nowszych niż IE 8
<![endif]-->

<!--[if gt IE 7]>
kod HTML dla IE nowszych niż IE 7
<![endif]-->

<!--[if gt IE 6]>
kod HTML dla IE nowszych niż IE 6
<![endif]-->


<!--[if gt IE 5.5]>
kod HTML dla IE nowszych niż IE 5.5
<![endif]-->
```

Takie konstrukcje mogą występować w każdym miejscu w kodzie i można w nich umieścić każdy kod. Okazuje się to przydatne na przy określaniu innych stylów dla określonych wersji IE, warto stosować to w połączeniu z konstrukcją CSS: „!important” co zagwarantuje, że pożądany przez nas atrubut będzie miał bezwzględne pierszeństwo, np:

```html
<!--[if lt IE 8]>
<style type="text/css">
#m #header #top {
margin-top: 18px !important;
}
</style>
<![endif]-->
```
