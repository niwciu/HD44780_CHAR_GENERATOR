# ToDo

## Nienaruszalne Założenia

- Utrzymać desktopowy, sztywny layout oparty o jedno główne okno robocze.
- Nie wprowadzać zmian, które psują kontrolowane proporcje i stały podział interfejsu.
- Nie zmieniać generatora wyjściowego w sposób wpływający na wynik.
- Wygenerowany kod z `CodeGenerator.js` ma pozostać bitowo zgodny z obecnym formatem wyjścia.
- Nie zmieniać nawet pojedynczego znaku, przecinka, spacji, komentarza ani kolejności w generowanym kodzie bez wyraźnej zgody.

## Priorytet Wysoki

- Dodać walidację nazw znaków i banków pod kątem kolizji po sanitizacji identyfikatorów C.
- Rozwiązać to wyłącznie po stronie walidacji wejścia, bez zmian w `src/components/CodeGenerator.js`.
- Usunąć side effecty z updaterów stanu w `src/App.jsx`.
- Zachować obecny flow autozaznaczania nowo utworzonego znaku i banku.
- Ujednolicić komunikaty w modalach i usunąć pozostałe `alert()`.

## Priorytet Średni

- Dodać testy dla walidacji nazw kolidujących po sanitizacji.
- Dodać testy dla flow tworzenia nowych znaków i banków.
- Dodać testy dla importu konfiguracji z błędnymi nazwami lub indeksami.
- Uporządkować drobne niespójności w stanie UI bez ruszania layoutu.
- Sprawdzić możliwość dodania bardziej czytelnych komunikatów inline w modalach.

## Priorytet Niski

- Poprawić dostępność list i siatki pikseli przy zachowaniu obecnego układu wizualnego.
- Rozważyć obsługę klawiatury dla części interakcji bez zmiany geometrii UI.
- Ograniczyć techniczny dług wynikający z bardzo sztywnego systemu `vw`/`vh`, ale tylko jeśli da się zachować obecne proporcje i brak przewijania.
- Rozszerzyć testy o najważniejsze scenariusze UI, jeśli będzie to możliwe bez ciężkiej przebudowy.

## Rzeczy Do Odrzucenia Bez Dalszej Zgody

- Responsywna przebudowa layoutu.
- Zmiana podziału kolumn lub geometrii głównego okna.
- Zmiany w `src/components/CodeGenerator.js`, które wpływają na output.
- Zmiana treści generowanego pliku C, nawet kosmetyczna.
