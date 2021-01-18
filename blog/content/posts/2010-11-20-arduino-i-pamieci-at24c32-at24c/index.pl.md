---
title: Arduino i pamięci AT24C32 (AT24C*, AT24CP) [PL]
date: 2010-11-20T00:03:06+01:00
aliases:
  - /index.php/2010/11/arduino-i-pamieci-at24c32-at24c/
  - /2010/11/arduino-i-pamieci-at24c32-at24c/
category:
  - elektronika
  - polski
tag:
cover:
  image: "at24cp.jpg"
  alt: "Pamięć AT24CP — podłączenie"
  caption: "Pamięć AT24CP — podłączenie"
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Ostatnimi dni wygrzebałem z elektronicznych rupieci stary tuner tv satelitarnej. Po bliższych oględzinach w oko wpadła mi pamięć AT24C32. Komunikujemy z nią odbywa się za pośrednictwem szyny I2C. Jest to dość wy﻿godny sposób, ponieważ do szyny możemy podłączyć wiele urządzeń jednocześnie, a poza tym standard ten jest bardzo popularny i wykorzystuje go większość dzisiejszych mikrokontrolerów.

Postanowiłem opisać podłączenie tego układu do płytki arduino. Poniżej zamieszczam schemat:

![Podłączenie pamięci AT24C32 do Arduino](at24cp.jpg)



No to po kolei, jak na schemacie:

- Pin 1,2,3 pamięci podłączamy do masy. (Jeśli chcemy używać kilku takich pamięci , możemy podłączyć je w innej konfiguracji. Ale nie polecam podłączania kilku pamięci do układu. Znacznie lepszym pomysłem jest kupienie większej pojemności.
- Pin 4 to masa układu, trzeba połączyć z GND w Arduino.
- Pin 5 to linia danych i2c (SDA), podłączamy do analogowego wejścia numer 4 w Arduino i podciągnąć do +5v przez rezystor 10k.
- Pin 6 to linia zegarowa i2c (SCL), należy dołączyć do analogowego wejścia 5 a Arduino i podciągnąć, jak poprzedni pin do +5V.
- Pin 7 to blokada przed zapisem. Aby móc zapisywać do pamięci podłączmy go do GND. (A jeśli jednak ktoś ma potrzebę zablokowania zapisu, powinien podpiąć ten pin do +5V.
- No i pin 8, Vcc, podłączamy do +5V.

Niestety, jeśli chcemy używać I2C w Arduino, musimy zrezygnować z aż dwóch analogowych wejść! Na szczęście wejścia analogowe możemy multipleksować, więc na dłuższą metę nie jest to wielki problem.

### Program

Nie jest to mój program, można go znaleźć w sieci. Natomiast postanowiłem przetłumaczyć na polski komentarze do kodu, tak, aby każdy mógł go zrozumieć. Oto i on:

```c
/* 
 *  Używanie szyny I2C z pamiecia EEPROM 24LC64/24LC32
 *  Sketch:    eeprom.pde
 *  
 *  Author: hkhijhe
 *  Date: 01/10/2010
 * 
 *   
 */

#include <Wire.h> //biblioteka I2C

void i2c_eeprom_write_byte( int deviceaddress, unsigned int eeaddress, byte data ) {
  int rdata = data;
  Wire.beginTransmission(deviceaddress);
  Wire.send((int)(eeaddress >> 8)); // MSB
  Wire.send((int)(eeaddress & 0xFF)); // LSB
  Wire.send(rdata);
  Wire.endTransmission();
}

// UWAGA: adres, to adres strony
// maksymalnie mozna zapisać 30 bajtow, poniewaz bufor biblioteki Wire.h uzywa 32-bajtowego buforu.
void i2c_eeprom_write_page( int deviceaddress, unsigned int eeaddresspage, byte* data, byte length ) {
  Wire.beginTransmission(deviceaddress);
  Wire.send((int)(eeaddresspage >> 8)); // MSB
  Wire.send((int)(eeaddresspage & 0xFF)); // LSB
  byte c;
  for ( c = 0; c < length; c++)
    Wire.send(data[c]);
  Wire.endTransmission();
}

byte i2c_eeprom_read_byte( int deviceaddress, unsigned int eeaddress ) {
  byte rdata = 0xFF;
  Wire.beginTransmission(deviceaddress);
  Wire.send((int)(eeaddress >> 8)); // MSB
  Wire.send((int)(eeaddress & 0xFF)); // LSB
  Wire.endTransmission();
  Wire.requestFrom(deviceaddress,1);
  if (Wire.available()) rdata = Wire.receive();
  return rdata;
}

// Tutaj tez odczytac mozna maksymalnie 30 bajtow za jednym razem.
void i2c_eeprom_read_buffer( int deviceaddress, unsigned int eeaddress, byte *buffer, int length ) {
  Wire.beginTransmission(deviceaddress);
  Wire.send((int)(eeaddress >> 8)); // MSB
  Wire.send((int)(eeaddress & 0xFF)); // LSB
  Wire.endTransmission();
  Wire.requestFrom(deviceaddress,length);
  int c = 0;
  for ( c = 0; c < length; c++ )
    if (Wire.available()) buffer[c] = Wire.receive();
}

void setup()
{
  char somedata[] = "to sa dane z pamieci EEPROM"; // dane do zapisania w pamieci
  Wire.begin(); // inicjalizacja polaczenia
  Serial.begin(9600);
  i2c_eeprom_write_page(0x50, 0, (byte *)somedata, sizeof(somedata)); // zapis do pamieci. 0x50 to domyslny adres ukladu 24c32/24c64. Zapisujemy pierwsza(0) komorke pamieci.

  delay(10); //dodanie malego opoznienia

  Serial.println("Zapisano pamiec!");
}

void loop()
{
  int addr=0; //pierwszy adres
  byte b = i2c_eeprom_read_byte(0x50, 0); //pierwsza komorka pamieci

  while (b!=0)
  {
    Serial.print((char)b); //Wypisujemy dane odebrane z pamieci do portu szeregowego.
    addr++; //zwiekszamy adres o jeden
    b = i2c_eeprom_read_byte(0x50, addr); //odczytujemy nastepny bajt danych
  }
  Serial.println(" ");
  delay(2000);

}
```

Teraz możemy kod skompilować i wysłać do arduino.
(Swoją drogą Arduino IDE ma bardzo przydatną funkcję, która konwertuje kod razem z podświetloną składnią do HTML lub BBCODE.

## Komentarze (archiwum ze starej strony)

> so this was the problem, pin 4 & 5 are that of analog inputs!
for a whole week i got my head f*cked with testing this code and writing my own codes! thanks to you , having read this article i just tested my eeprom 24c256, it works fine man!!! thanks ,thanks alot.
> 
> — [headtuner](http://hotresistor.blogspot.com/) on Styczeń 30th, 2011 at 21:14