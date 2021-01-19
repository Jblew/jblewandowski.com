---
title: 'java.lang.IllegalStateException: Cannot find the system Java compiler. Check that your class path includes tools.jar [PL]'
date: 2011-05-09T00:00:00+01:00
aliases:
  - /index.php/2011/05/java-lang-illegalstateexception-cannot-find-the-system-java-compiler-check-that-your-class-path-includes-tools-jar/
  - /2011/05/java-lang-illegalstateexception-cannot-find-the-system-java-compiler-check-that-your-class-path-includes-tools-jar/
category:
  - java
  - programowanie
  - polski
tag:  
---
Czy do dynamicznej kompilacji w Javie jest potrzebne JDK?
<!--more-->
> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Tak się zdarzyło, że do progów używam jednak dynamicznej kompilacji, gdyż skrypty w javax.script.* zbyt wolno chodziły na serwerze. Dynamiczny kompilator wymaga jednak „tools.jar” do poprawnej pracy. Jeśli uruchamia się program z wykorzystaniem jre (zamiast jdk) możemy dostać taki wyjątek, jak w temacie.

Rozwiązanie jest proste. Wystarczy zainstalować jdk: 

```
apt-get install openjdk-6-jdk
```

I gotowe.