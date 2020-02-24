# Przewodnik do korzystania z Web Workers w React

Web Workers są sposobem uruchamiania skryptów internetowych w wątkach w tle bez blokowania głównego wątku. JavaScript to środowisko jednowątkowe, co oznacza, że nie można uruchomić wielu skryptów jednocześnie. Pojedynczy wątek oznacza, że każda linia kodu JS jest wykonywana pojedynczo.

Na przykład przyjrzyjmy się witrynie, która musi wykonać następujące czynności, obsługiwać interakcje w interfejsie użytkownika, wchodzić w interakcje i przetwarzać odpowiedzi interfejsu API oraz manipulować DOM. Są one dość powszechne w nowoczesnej witrynie internetowej / aplikacji internetowej. Niestety wszystkie powyższe nie mogą być równoczesne z powodu ograniczeń w środowisku wykonawczym JavaScript przeglądarki. Wykonywanie skryptu zawsze odbywa się w ramach jednego wątku.

Dlatego jeśli dowolne z powyższych działań zajmie zbyt dużo czasu, może to spowodować zablokowanie głównego wątku i uniemożliwić korzystanie z całej aplikacji.

Jak więc rozwiązać ten problem blokowania wątków?

Wprowadzając wielowątkowość. Wielowątkowość pozwala przeglądarce na uruchamianie wielu skryptów bez powodowania przerwy w głównym, co skutkuje wydajnym i responsywnym interfejsem użytkownika.

Tam wkracza Web Workers. [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) zezwala na uruchamianie kodu JavaScript w osobnym wątku w tle, całkowicie niezależnym od wątku przeglądarki i jego zwykłych działań.

Ponieważ ci pracownicy pracują w innym wątku niż główny wątek wykonawczy, możesz używać web workers do uruchamiania zadań intensywnie przetwarzających z przeglądarki bez tworzenia instancji blokujących.

Web Workers uruchomiane jest w izolowanym wątku. W rezultacie kod, który wykonuje, musi znajdować się w osobnym pliku. Ponieważ skrypt roboczy działa w innym skrypcie. Aby rozpocząć pracę z Web Workers, musisz utworzyć nowy obiekt `Worker` na swojej stronie głównej.

```

    // main.js file

    var worker = new Worker('workerfile.js');
```

Konstruktor `Worker()` tworzy pracownika i zwraca obiekt `Worker` reprezentujący tego pracownika, który służy do komunikacji z pracownikiem. Jak komunikujemy się z pracownikiem? Łącząc się do metody `postMessage()`.

```

    // main.js file

    worker.postMessage('Hello World');

```

W pliku `workerfile.js` mielibyśmy coś takiego:

```

    // workerfile.js

    self.addEventListener('message', function(e) {
      self.postMessage(e.data);
    }, false);

```

Listener zdarzeń nasłuchuje dowolnego komunikatu zdarzenia, a następnie reaguje na komunikat, uruchamiając w tym przypadku kod wewnątrz funkcji, wysyłając wiadomość z powrotem do głównego wątku za pomocą funkcji postMessage().

*Uwaga: Zawsze wysyłamy wiadomość z powrotem do głównego wątku.*

Końcowo będziemy również potrzebować nasłuchiwania zdarzeń wiadomości w głównym pliku, aby odebrać dane i podjąć na ich podstawie działania. Coś w rodzaju bloku kodu poniżej.

```
    // main.js file

    var worker = new Worker('workerfile.js');

    worker.addEventListener('message', function(e) {
      console.log('Message from Worker: ' + e.data);
    }

    worker.postMessage('Hello World');

```

**Web Workers w React**

Zobaczmy, w jaki sposób można używać Web Workers w aplikacji React. W tym przykładzie zobaczymy, w jaki sposób intensywne działanie procesora może spowodować zablokowanie interfejsu użytkownika, a następnie naprawić problem ze skryptem Web Worker.

Napiszemy pętlę for, która jest nieco intensywna i powoduje blokadę głównego wątku, i zobaczymy, jak się zachowuje, gdy zostanie wywołana bezpośrednio i przez Web Worker.

Aby zacząć, skorzystamy z pakietu [create-react-app](https://github.com/facebook/create-react-app) dla nowej aplikacji bootstrap React lub możesz śledzić za pomocą [CodeSandbox](http://codesandbox.io/).

Możesz utworzyć nową aplikację React za pomocą poniższego polecenia:

```
   npx create-react-app react-worker
```

Po utworzeniu i zainstalowaniu aplikacji utwórz plik o nazwie `Home.js` w folderze `src`.

Zanim przejdziemy do konfigurowania projektu, musimy zainstalować pakiet React o nazwie [react-countdown-clock](https://github.com/pughpugh/react-countdown-clock). Zasadniczo renderuje odliczanie czasu i nie ma wpływu na to, co budujemy,
będzie jednak służyć jako przykład tego, co dzieje się, gdy główny wątek jest blokowany. Możesz zainstalować za pomocą poniższego polecenia.

```
   npm i react-countdown-clock
```

W nowo utworzonym pliku `Home.js` edytuj go za pomocą następującego bloku kodu:

W powyższym bloku kodu zaczynamy od importowania `React`, `Component` oraz pakietu `ReactCountdownClock`, który zainstalowaliśmy wcześniej.

W funkcji `render`, wtedy tworzymy niezbędny interfejs użytkownika aplikacji. Korzystamy również z pakietu `ReactCountdownClock` renderując to.

Ważnym kawałkiem w powyższym kodzie jest funkcja `fetchUsers`. Funkcja zawiera pętlę for, która działa 10 000 000 razy. Jest to bardzo niepraktyczne i mało prawdopodobne (nigdy nie zobaczysz czegoś takiego w aplikacji produkcyjnej), ale jest potrzebna do zademonstrowania blokady głównego wątku.

Funkcja `fetchUsers` jest następnie podłączona do przycisku `Fetch Users Directly` tak:

```
    <button className="btn-direct" onClick={
    .fetchUsers}>Fetch Users Directly</button>
```

Po wykonaniu tej czynności zobaczmy, co faktycznie robi kliknięcie przycisku.

Następnie należy zaimportować plik `Home.js` do głównego pliku` App.js`, aby można było do niego odwoływać, a następnie renderować go w interfejsie użytkownika. Aby to zrobić, otwórz plik `App.js` i edytuj go za pomocą bloku kodu poniżej.

[https://gist.github.com/yomete/b13df5db43bbaff0f6bda06d43e03fbb](https://gist.github.com/yomete/b13df5db43bbaff0f6bda06d43e03fbb)

W powyższym bloku kodu `Home.js` jest importowany i używany w funkcji renderowania w ten sposób; `<Home />`.

Jak dotąd Twoja aplikacja powinna wyglądać podobnie do poniższej.

![](https://cdn-images-1.medium.com/max/1600/1*moTOQ_r7WTjbnGJyZoXmrA.png)

Teraz, jeśli klikniesz przycisk Pobierz użytkowników bezpośrednio, zauważysz, że przez prawie dwie sekundy akcja powoduje zablokowanie głównego wątku. W jaki sposób? Cała aplikacja przestaje odpowiadać, a minutnik przestaje działać. To jest przykład procesu / funkcji powodującej blokadę głównego wątku aplikacji.

Zobaczmy, jak możemy to rozwiązać z Web Workers.

Zaczniemy od utworzenia pliku Web Worker o nazwie `worker.js` w folderze` src` i edycji za pomocą poniższego kodu:

Jak widać w powyższym bloku kodu, plik Web Worker zawiera również tę samą pętlę `for`, która została zapisana w funkcji `fetchUsers`. Pętla 'for' znajduje się w detektorze zdarzeń 'message', co oznacza, że przetwarzanie zostanie wykonane, gdy tylko odbierze zdarzenie, a na koniec wyśle wiadomość (tablicę 'users') za pomocą funkcji 'postMessage'.

Po utworzeniu pliku Web Worker zaimportuj go do pliku `Home.js`, ale zanim to zrobimy, potrzebna jest pewna konfiguracja, zanim plik` worker.js` będzie można znaleźć w aplikacji React.

Ten blok kodu jest konieczny, ponieważ będziemy importować plik `worker.js`, dlatego musimy upewnić się, że jest on zgodny z pakietem Webpack, a powyższy blok kodu robi to, zmieniając plik Web Worker w ścieżkę / łańcuch, który można następnie wywołać jako adres internetowy.

Następnie w pliku `Home.js` dodaj następujący import na początku kodu:

```
    worker 
    './worker.js';
    WebWorker 
    './workerSetup';
```    

Będziemy także musieli zainicjować instancję Web Worker po zakończeniu montażu komponentów, w cyklu życia `componentDidMount`:

```

    componentDidMount = () => {
       
    .worker = 
    WebWorker(worker);
    }

```

Pamiętaj, że dla Web Workers chodzi o wysyłanie i odbieranie wiadomości asynchronicznie, dlatego napiszmy funkcję, która publikuje wiadomość w pliku Web Workers, a następnie z kolei odbiera zwróconą wiadomość. Możesz napisać poniższą funkcję tuż przed cyklem życia `componentDidMount`.

PostMessage jest prosty, ponieważ nasłuchujemy tylko jednego rodzaju zdarzenia w pliku `worker.js`. `EventListener` następnie nasłuchuje odpowiedzi od pracownika sieci, a następnie aktualizuje stan. Ostatnim fragmentem kodu, który należy napisać, jest podpięcie funkcji `fetchWebWorker` do przycisku` Fetch Users With WebWorker`.

```

    <button className="btn-worker" onClick={
    .fetchWebWorker}>Fetch Users with Web Worker</button>

```

Teraz, gdy odwiedzisz aplikację i spróbujesz kliknąć przycisk ``Pobierz użytkowników za pomocą narzędzia Web Worker``, zauważysz, że aplikacja działa płynnie, gdy żądany proces odbywa się w tle, a stan jest aktualizowany odpowiednią wartością .

Możesz to przetestować w aplikacji na żywo pod adresem
[https://build-jrrpxladjd.now.sh/](https://build-jrrpxladjd.now.sh/).

**Wniosek**

Web Workers może być bardzo przydatne do obsługi skomplikowanych procesów i funkcji, jak pokazano tutaj, należy rozważyć przeniesienie długo działających zadań do pliku Web Worker, a następnie powiadomić główną aplikację, kiedy to zrobione, a następnie można zaktualizować wszystko, co wymaga aktualizacji.

Pełną bazę kodu dla powyższej aplikacji React można obejrzeć na [GitHub](https://github.com/yomete/react-worker) a także na [CodeSandbox](https://codesandbox.io/s/w2v7zzn63w).
