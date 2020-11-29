---
title: 'Skrypty w javie…'
date: 2011-03-11T00:00:00+01:00
aliases:
  - /index.php/2011/03/skrypty-w-javie-nie-nie-chodzi-mi-o-javascript/
  - /2011/03/skrypty-w-javie-nie-nie-chodzi-mi-o-javascript/
categories:
tags:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Jak już wcześniej pisałem już od pewnego czasu piszemy muda w czystej javie. Mamy już sporo funkcji i obsługę wieli mudowych problemów, w związku z czym nadszedł czas na rozpoczęcie tworzenia obsługi MOB-ów, czyli postaci sterowanych przez komputer. Każdy mob ma swój program, nazywany mobprogiem. Cały problem polega na tym, żeby móc edytować program moba bez ponownej kompilacji całego programu. Dość długo szukałem optymalnego rozwiązania. Zastanawiałem się m.in. nad dynamicznym kompilowaniem kodu, nad językiem lua…

### Ale najlepsze okazało się dedykowane API dla skryptów – javax.script.

Jest bardzo proste w obsłudze. Poniżej przedstawiamprzykład i opis:

```java
package scriptingtest;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class Main {
  public static void main(String[] args) throws ScriptException {
    ScriptEngineManager factory = new ScriptEngineManager();
    ScriptEngine engine = factory.getEngineByName("JavaScript");

    Proba p = new Proba(); //zawiera tylko pole int i

    engine.put("p", p);
    p.i = 7;
    System.out.println(p.i);

    engine.eval(""
      + "importPackage(java.lang);"
      + "importClass(Packages.scriptingtest.Proba);"
      + ""
      + "p.i = 2;"
    );


    System.out.println(p.i);
  }
}
```
Klasa Próba zawiera tylko pole `public int i = 0;` . Uruchamiając program zobaczymy, że skrypt zmieni wartość i z 7 na 2. To wszystko. Jak widać jest to bardzo proste i może być przydatne w dużych aplikacjach, szczególnie w grach.

Należy tylko pamiętać, że **jeśli chcemy zaimportować jakąś klasę z wewnątrz jara**, w którym uruchamiamy program, musimy dodać na początku Packages.nazwapakietu.