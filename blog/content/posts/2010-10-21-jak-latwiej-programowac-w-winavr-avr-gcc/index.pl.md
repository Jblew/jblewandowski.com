---
title: Jak łatwiej programować w WinAVR (AVR-GCC) [PL]
date: 2010-10-21T00:03:06+01:00
aliases:
  - /index.php/2010/10/jak-latwiej-programowac-w-winavr-avr-gcc/
  - /2010/10/jak-latwiej-programowac-w-winavr-avr-gcc/
category:
  - elektronika
  - polski
tag:
summary: |
  Sam dopiero zaczynam przygodę z programowaniem mikrokontrolerów i wiem, co się z tym wiąże. Nie jest łatwo zacząć. Najtrudniej jest, gdy ktoś w ogóle nie programował wcześniej, albo programował w języku wysokiego poziomu (Java, basic, etc.). Prawdę mówiąc kod programów pisanych w C dla avr wcale nie jest czytelny. Jeśli ktoś nie siedzi w tym dostatecznie długo, to nie jest w stanie spamiętać wszystkich rejestrów, a operacje bitowe tylko pogarszają sprawę. Nieczytelność kodu doskonale obrazuje poniższy przykład. (Jest to prosty program, który zmienia stan diody po przerwaniu INT0.
  Napisałem biblioteczkę ułatwiającą pracę z avr-C. Niestety po latach kod zaginął.
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 
Sam dopiero zaczynam przygodę z programowaniem mikrokontrolerów i wiem, co się z tym wiąże. Nie jest łatwo zacząć. Najtrudniej jest, gdy ktoś w ogóle nie programował wcześniej, albo programował w języku wysokiego poziomu (Java, basic, etc.). Prawdę mówiąc kod programów pisanych w C dla avr wcale nie jest czytelny. Jeśli ktoś nie siedzi w tym dostatecznie długo, to nie jest w stanie spamiętać wszystkich rejestrów, a operacje bitowe tylko pogarszają sprawę. Nieczytelność kodu doskonale obrazuje poniższy przykład. (Jest to prosty program, który zmienia stan diody po przerwaniu INT0.

```c
#define F_CPU 8000000L
#include <avr/io.h>
#include <util/delay.h>
#include <avr/interrupt.h>

ISR(INT0_vect) {
  PORTB ^= (1 << 0);
  _delay_ms(80);
}

void initIo(void) {
  eeprom_write(0, MCUSR);
  MCUSR = 0x00;
  DDRB |= (1 << 0);
  DDRD &= ~(1 << 2);
  PORTD |= (1 << 2);
  sei();
  EIMSK |= (1<<INT0);
  EICRA |= (1<<ISC01);
  EICRA |= (1<<ISC00);
}


int main(void) {
  initIo();
  PORTB |= (1 << 0);
  while(1) {
    _delay_ms(1);
  }
}
```

Z tego powodu postanowiłem już przerzucić się na Bascom AVR. **Ale wielkim minusem była cena i ograniczenia wersji demo.** Chcąc-nie chcąc wróciłem do avr-gcc i zacząłem kombinować jak uprościć kodzenie pod tym potworkiem. I w ten oto sposób stworzyłem małą „biblioteczkę”, która ma na celu zwiększyć czytelność kodu. Zobaczcie sami jak wygląda ten sam program napisany z wykorzystaniem „biblioteczki”:

```c
#define F_CPU 8000000L
#include <avr/io.h>
#include <util/delay.h>
#include <avr/interrupt.h>
#include "jutils.h"

ISR(INT0_vect) {
  portb_toggle(0);
  _delay_ms(80);
}

void initIo(void) {
  jutils_init();
  portb_output(0);
  portd_input(2);
  portd_pullup_on(2);
  enable_interrupts();
  int0_enable();
  int0_config_on_falling();
}


int main(void) {
  initIo();
  portb_set(0);
  while(1) {
    _delay_ms(1);
  }
}
```

Jak widać, kod jest czytelniejszy i łatwiejszy do zrozumienia. Plik z definicjami i kodem można pobrać stąd.  [UPDATE 2020: ten plik narazie nie jest dostępny]. Należy go rozpakować, a następnie dołączyć do programu pliki „jutils.c” i „jutils.h”. Zaznaczam, że biblioteka jest dopiero w fazie testowej. Zaimplementowałem trochę podstawowych funkcji, a w przyszłości, w miarę użytkowania, dodam więcej.

Na chwilę obecną zawarte są m.in. następujące funkcje:

| **Funkcja**                                                  | **Opis**                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| set_bit(add,  bit)                                           | Ustawia  bit *bit* rejestru *add* (Nadaje mu wartość 1).     |
| reset_bit(add,  bit)                                         | Resetje  bit *bit* rejestru *add* (Nadaje mu wartość 0).     |
| toggle_bit(add,  bit)                                        | Zmienia  wartość bitu *bit* rejestru *add* na przeciwną  (z 0 na 1, z 1 na 0). |
| was_watchdog_reset()  was_brownout_reset()  was_external_reset()  was_poweroff_reset() | Zwraca,  w jaki sposob zostal wylaczony/zresetowany mikrokontroler. Aby funkcje  dzialaly poprawnie na poczatku funkcji main należy wywolac *jutils_init()* |
| enable_interrupts()                                          | Włącza  na przerwania.                                       |
| disable_interrupts()                                         | Wyłącza  przerwania.                                         |
| enable_int0()  enable_int1()                                 | Zezwala  na zewnętrzne przerwanie INTx.                      |
| disable_int0()  disable_int1()                               | Wyłącza  zewnętrzne przerwania INTx.                         |
| int0_config_on_falling()  int1_config_on_falling()           | Ustawia  przerwanie INTx, aby reagowalo na zbocza opadajace. |
| int0_config_on_rising()  int1_config_on_rising()             | Ustawia  przerwanie INTx, aby reagowalo na zbocza podnoszące się. |
| int0_config_on_both()  int1_config_on_both()                 | Ustawia  przerwanie INTx, aby reagowalo na zbocza podnoszące się i opadające. |
| int0_config_low_level()  int1_config_low_level()             | Ustawia  przerwanie INTx, aby było zgłaszane nieprzerwanie, dopoki na adekwatnym pinie  panuje stan niski. |
| porta_output(n)  portb_output(n)  portc_output(n)  portd_output(n) | Ustawia  pin *n* odpowiedniego portu jako wyjście.           |
| porta_input(n)  portb_input(n)  portc_input(n)  portd_input(n) | Ustawia  pin *n* odpowiedniego portu jako wejście.           |
| porta_set(n)  portb_set(n)  portc_set(n)  portd_set(n)       | Podaje  stan wysoki na pin *n* odpowiedniego portu.          |
| porta_reset(n)  portb_reset(n)  portc_reset(n)  portd_reset(n) | Podaje  stan niski na pin *n* odpowiedniego portu.           |
| porta_toggle(n)  portb_toggle(n)  portc_toggle(n)  portd_toggle(n) | Zmiania  stan panujacy na pinie *n* odpowiedniego portu na przeciwny. |
| porta_pullup_on(n)  portb_pullup_on(n)  portc_pullup_on(n)  portd_pullup_on(n) | Wewnętrznie  podpina do dodatniej szyny zasilania pin *n* odpowiedniego  portu. |
| porta_pullup_off(n)  portb_pullup_off(n)  portc_pullup_off(n)  portd_pullup_off(n) | Usuwa  wewnętrzne podpięcie do dodatniej szyny zasilania pinu *n* odpowiedniego  portu. |
| porta_pullup_on(n)  portb_pullup_on(n)  portc_pullup_on(n)  portd_pullup_on(n) | Wewnętrznie  podpina do dodatniej szyny zasilania pin *n* odpowiedniego  portu. |
| porta_get(n)  portb_get(n)  portc_get(n)  portd_get(n)       | Zwraca  wartość pinu *n* odpowiedniego portu.                |
| porta_wait_while_set(n)  portb_wait_while_set(n)  portc_wait_while_set(n)  portd_wait_while_set(n) | Oczekuje  dopoki na pinie *n* odpowiedniego portu panuje stan wysoki. |
| porta_wait_while_reset(n)  portb_wait_while_reset(n)  portc_wait_while_reset(n)  portd_wait_while_reset(n)   ) | Oczekuje  dopoki na pinie *n* odpowiedniego portu panuje stan niski. |
| porta_wait_for_button(n)  portb_wait_for_button(n)  portc_wait_for_button(n)  portd_wait_for_button(n) | Oczekuje  na nacisniecie i zwolnienie przycisku podlaczonego do pinu *n* odpowiedniego  portu. |

**Uwaga! Narazie funkcje zostały przetestowane pod atmega88 i częściowo pod attiny2313. Zachęcam do testowania ich, zgłaszania pomysłów i uwag!**

UPDATE 2020: ten plik narazie nie jest dostępny