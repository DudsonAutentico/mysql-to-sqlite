# 🚀 Translator MySQL na SQLite (Desktop Web Tool)

Nowoczesne, ultra lekkie i szybkie narzędzie webowe zaprojektowane z myślą o programistach oraz administratorach baz danych, ułatwiające migrację struktur oraz zapytań SQL między systemami **MySQL** a **SQLite**.

▶️ **Uruchom aplikację bezpośrednio w przeglądarce:** [https://github.io](https://github.io)

---

## 📊 Kluczowe Fakty o Projekcie

* **Zorientowany na Desktop:** Interfejs zaprojektowany w układzie dwukolumnowym, zoptymalizowany pod kątem wygody i ergonomii pracy na monitorze komputera. Aplikacja posiada wbudowaną blokadę i komunikat dla urządzeń mobilnych.
* **100% Prywatności i Lokalności:** Konwersja kodu odbywa się w ułamku sekundy bezpośrednio w Twojej przeglądarce za pomocą zaawansowanych wyrażeń regularnych (Regex). Wklejany kod SQL nie jest wysyłany na żaden zewnętrzny serwer.
* **Vanilla Stack (Ultra lekki):** Cały projekt waży zaledwie kilkanaście KB. Został napisany czysto w językach HTML, CSS i JS — bez użycia jakichkolwiek ciężkich frameworków czy zewnętrznych bibliotek.
* **Efektowny UI (Glasmorfizm):** Nowoczesny interfejs z efektem szronionego szkła, wyposażony w płynny przełącznik motywów (Jasny / Ciemny) i automatyczne zapamiętywanie wyboru użytkownika za pomocą `localStorage`.
* **Udogodnienia UX:** Dedykowany mechanizm schowka z przyciskiem "Kopiuj" oraz jaskrawozielonym powiadomieniem Toast, a także obsługa skrótu klawiszowego **`Ctrl + Enter`** do natychmiastowej konwersji kodu.

---

## 🛠️ Możliwości Silnika Tłumaczącego

Aplikacja automatycznie mapuje i czyści specyficzną dla MySQL składnię, dostosowując ją do restrykcyjnych standardów SQLite:

* **Struktury Tabel (`CREATE TABLE`):** Automatycznie konwertuje sekwencje `AUTO_INCREMENT` na prawidłowe `INTEGER PRIMARY KEY AUTOINCREMENT`. Usuwa precyzję z typów `DATETIME(6)` i `TIMESTAMP`, modyfikatory wyświetlania wielkości typu `INT(11)` oraz niekompatybilne deklaracje silników (np. `ENGINE=InnoDB`).
* **Instrukcje i Zapytania:** Przetwarza operacje manipulacji danymi i instrukcje ignorowania błędów (np. `INSERT IGNORE INTO` -> `INSERT OR IGNORE INTO`). Bezpiecznie usuwa komentarze systemowe (`/*!40101 ... */`) oraz backticki ( ` ).
* **Funkcje Logiczne i Tekstowe:** Mapuje wywołania `CONCAT()` na standardowy dla SQLite operator złączenia tekstów (`||`), zamienia `IFNULL()` na uniwersalne `COALESCE()` oraz podstawia natywne funkcje czasu w miejsce `NOW()` czy `SYSDATE()`.
* **Zgoda ze znakami ucieczki:** Bezpiecznie konwertuje ukośniki ucieczki apostrofów (`\'`) na wymagany w SQLite standard podwójnego apostrofu (`''`).

---

## 📜 Prawa Autorskie i Licencje

* **Kod źródłowy:** Wszelkie prawa zastrzeżone (All Rights Reserved). Własność intelektualna: **Adam Dudek**.
* **Zasoby stron trzecich:** Wykorzystane komponenty graficzne SVG (ikony słońca, księżyca, strzałki oraz zatwierdzenia) pochodzą z serwisu SVGRepo i są objęte licencjami MIT oraz Creative Commons (CC-BY). Pełne zestawienie autorów (Konstantin Filatov, Mariusz Ostrowski) oraz warunków licencyjnych znajduje się w załączonym pliku `LICENSE.txt`.
