---
title: "Code Igniter: Scaffolding wielu tabel w jednym kontrolerze!"
date: 2009-10-25T00:03:06+01:00
aliases:
  - /index.php/2009/10/code-igniter-scaffolding-wielu-tabel-w-jednym-kontrolerze/
  - /2009/10/code-igniter-scaffolding-wielu-tabel-w-jednym-kontrolerze/
categories:
tags:
---

> **Archiwum (bardzo) młodego programisty.** Ten wpis pochodzi z mojego bloga, którego prowadziłem będąc uczniem Gimnazjum (obecnie są to klasy 6-8 szkoły podstawowej). Z sentymentu i rozczulenia postanowiłem przenieść te treści na moją nową stronę internetową. Na samym dole załączone są komentarze (jeśli jakieś były). [Tutaj przeczytasz o tym jak wyglądała moja pierwsza strona i przygoda z programowaniem]({{< ref "/posts/2020-11-27-wielki-programista-gimnazjalista" >}})
> 

Scaffolding to bardzo dobra metoda oszczędzająca wiele czasu podczas tworzenia aplikacji internetowych. W CodeIgniter ma to jedną wadę, otóż w jednym kontrolerze można uruchomic scaffolding tylko jednej tabeli naraz. W artykule pokażę, jak możesz to zmienić.

Rozwiązanie jest proste!

1. Pobierz zmodyfikowany folder scaffolding z tego bloga,
2. podmień folder `system/scaffolding` na ten pobrany,
3. Następnie umieść następujący kod w kontrolerze:
    ```php
    class admin extends Controller {
        function admin() {
            parent::Controller();
            if($this->uri->total_segments() >= 3) {
                $this->load->scaffolding(
                    $this->uri->segment(
                        $this->uri->total_segments()
                    )
                );
            }
            else if($this->uri->total_segments() >= 2){
                $this->load->scaffolding("scaffoldinglisttables");
            }
        }
        function index() {

        }
    }
    ?>
    ```

Teraz możesz już korzystać z scaffoldingu wielu tabel!