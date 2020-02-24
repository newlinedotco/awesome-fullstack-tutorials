# Testowanie aplikacji React z Jest oraz Enzyme

Testowanie jest ważną częścią tworzenia oprogramowania, ponieważ pozwala wychwycić irytujące błędy i sprawia, że kod jest łatwiejszy w utrzymaniu i łatwiejszy do zrozumienia. Może to być także droga do automatycznego zapewniania jakości i dokumentacji dla programistów.

W tym artykule zajmiemy się testowaniem aplikacji React przy użyciu [Jest](https://jestjs.io/) oraz [Enzyme](https://airbnb.io/enzyme/). Rzućmy okiem na to, co robi poszczególne narzędzie i jak można je połączyć w celu przetestowania aplikacji React.

## Wprowadzenie do Jest i Enzyme

**Jest**

'Jest' jest to framework JavaScript do testowania używany właśnie do testowania aplikacji JavaScript. Został stworzony przez Facebooka w celu przetestowania aplikacji React lub w zasadzie dowolnej aplikacji JavaScript.

Jest zapewnia również **Snapshot testing**, możliwość utworzenia renderowanej 'migawki' komponentu i porównania jej z poprzednio zapisaną 'migawką'. Test zakończy się niepowodzeniem, jeśli dwa nie będą pasować. 

**Enzyme**

Enzyme to narzędzie do testowania JavaScript dla React, które ułatwia stwierdzanie, manipulowanie i przeglądanie wyników komponentów React.

Enzyme eksportuje trzy różne “tryby” w których można renderować i testować komponenty, [**shallow**](http://airbnb.io/enzyme/docs/api/shallow.html), [**mount**](http://airbnb.io/enzyme/docs/api/mount.html), oraz [**render**](http://airbnb.io/enzyme/docs/api/render.html). 

## Testowanie komponentów React'a

Zanim zaczniemy pisać test, musimy utworzyć aplikację React, na której możemy testować. W tym celu wykorzystamy [create-react-app](https://github.com/facebook/create-react-app) CLI. Możesz utworzyć nową aplikację React za pomocą poniższego polecenia:

```bash
   npx create-react-app react-testing
```

Po utworzeniu i zainstalowaniu aplikacji, `cd` do katalogu `react-testing` i uruchom `npm start`, aby uruchomić aplikację React.

Pierwszym krokiem byłoby napisanie podstawowych testów przy użyciu Jest, aby zorientować się, jak wyglądają testy w React. Ponieważ Jest już dostarczany wraz z pakietem `create-react-app`, nie musisz niczego instalować. Po prostu przejdziemy do pisania testów.

Jeśli sprawdzisz folder `src` nowo utworzonej aplikacji do testowania reakcji powinieneś zobaczyć plik `App.test.js`, a jego zawartość powinna być taka jak poniżej.

```javascript
// src/App.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

Powyższy kod to wstępny pakiet testowy, który sprawdza, czy aplikacja renderuje się bez awarii. Zobaczmy wynik testu powyżej, uruchamiając poniższe polecenie.

![](https://i.imgur.com/QVC5B6i.png)

Jak widać na zrzucie ekranu, wszystkie pakiety testowe przeszły pomyślnie. Możemy również dodać dodatkowy test do pliku `App.test.js`. Dodaj poniższy kod do pliku `App.test.js`.

```javascript
// App.test.js
// add the assert method
var assert = require('assert');

it('should return -1 when the value is not present', function() {
  assert.equal([1,2,3].indexOf(4), -1);
});

```

Do powyższego testu używany jest moduł assert. Zapewnia sposób testowania wyrażeń, a jeśli wyrażenie ma wartość 0 lub fałsz, zwracane jest niepowodzenie asercji. W powyższym teście sprawdzamy, czy tablica zawiera wartość, zwracając '-1', gdy wartość nie jest obecna. Metoda [.equal()](https://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message) służy do sprawdzania równości. Uruchom komendę `npm run test` ponownie, aby zobaczyć wyniki testów.

![](https://i.imgur.com/JXtaESK.png)

Teraz, kiedy już przeszliśmy przez proces pisania testów w Jest, zobaczmy, jak możemy łączyć się z Enzyme'm w celu testowania składników.

Aby rozpocząć korzystanie z Enzyme, możesz zainstalować go za pomocą npm. Będziesz także musiał zainstalować Enzyme wraz z adapterem odpowiadającym wersji React. Na przykład, jeśli używasz Enzym'u z React 16, będziesz musiał zainstalować adapter `enzyme-adapter-reaguj-16`, a jeśli używasz React 15, musisz zainstalować` enzym-adapter-reagować-15 `. Uruchom poniższe polecenie, aby zainstalować wymagane zależności.

```bash
npm i --save-dev enzyme enzyme-adapter-react-16
```

Ostatnią rzeczą dla konfiguracji Enzyme jest utworzenie pliku `setupTests.js` w folderze `src`. Ponieważ stworzyliśmy aplikację React za pomocą pakietu `create-React-app`, plik `setupTests.js` automatycznie przekazuje Jest i Enzyme informacje o tym, który adapter zostanie użyty.

```javascript
// src/setupTests.js

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

### Shallow Rendering

Shallow rendering jest przydatny, aby zmusić się do przetestowania komponentu jako jednostki i upewnić się, że testy nie są pośrednio utwierdzające zachowania komponentów potomnych. Płytkie renderowanie jest symulowanym renderowaniem drzewa komponentów, które nie wymaga DOM. Głęboko renderuje tylko jeden poziom komponentów.

Aby przeprowadzić płytki test renderowania (Shallow Rendering), zbudujemy prosty przełącznik, który wyświetla '1' po kliknięciu przycisku włączenia i '0' po kliknięciu przycisku wyłączenia. Otwórz plik `App.js` w folderze` src` i edytuj kodem poniżej.

```javascript
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      status: 0,
    }
  }

  setOn = event => {
    this.setState({status: 1})
  }; 

  setOff = event => {
    this.setState({status: 0})
  }; 

  render() {
    return (
      <div className="App">
        <p>
          {this.state.status}
        </p>

        <button onClick={this.setOff}>Off</button>
        <button onClick={this.setOn}>On</button>
      </div>
    );
  }
}

export default App;

```

Następnie napiszmy test, aby upewnić się, że aplikacja działa zgodnie z oczekiwaniami. Otwórz plik `App.test.js` i dodaj poniższy kod.

```javascript
// App.test.js
//import the shallow method.
import { shallow } from 'enzyme';

describe('Enzyme Tests', () => {
  it('App loads with initial state of 0', () => {
    const wrapper = shallow(<App />);
    const text = wrapper.find('p').text();
    expect(text).toEqual('0');
  });
});
```

W powyższym teście używamy metody 'płytkiej' importowanej z enzymu, aby zwrócić instancję renderowanego komponentu. Następnie używamy metody `.find`, aby znaleźć znacznik `p`, i sprawdzamy za pomocą metody `.toEqual`, aby sprawdzić, czy wartość wynosi 0. Jeśli tak, test jest pozytywny, a jeśli nie, test kończy się niepowodzeniem.

Uruchom komendę `npm run test` aby zobaczyć wynik testu.

![](https://i.imgur.com/LRblw32.png)

Do następnego testu sprawdzimy, czy przyciski do włączania i wyłączania przełącznika działają zgodnie z oczekiwaniami. Potrzebujemy sposobu na identyfikację przycisków, dlatego dodamy identyfikatory do przycisków. Edytuj elementy przycisków w pliku `App.js` za pomocą poniższych.

```javascript
<button id="offbutton" onClick={this.setOff}>Off</button>
<button id="onbutton" onClick={this.setOn}>On</button>
```

W teście dodaj poniższy kod do pliku `App.test.js`.

```javascript
// App.test.js

it('on button works as expected', () => {
    const wrapper = shallow(<App />);
    const onButton = wrapper.find('button#onButton');
    onButton.simulate('click');
    const text = wrapper.find('p').text();
    expect(text).toEqual('1');
  });

  it('off button works as expected', () => {
    const wrapper = shallow(<App />);
    const offButton = wrapper.find('button#offButton');
    offButton.simulate('click');
    const text = wrapper.find('p').text();
    expect(text).toEqual('0');
  });
```

W powyższym bloku kodu identyfikujemy przyciski na podstawie ich identyfikatorów, a następnie dołączamy do przycisków metodę 'simulate'. Test wykorzystuje metodę `simulate` do symulacji zdarzenia kliknięcia na przyciskach, a następnie sprawdza się, czy wartość po kliknięciu przycisku jest zgodna z oczekiwaniami.

![](https://i.imgur.com/xiCwVWM.png)



### Snapshot Testing

Snapshot Testing to bardzo przydatne narzędzie, gdy chcesz się upewnić, że interfejs użytkownika nie zmieni się niespodziewanie. 'Test migawki' weryfikuje, czy element funkcjonalności działa tak samo, jak podczas tworzenia migawki.

Snapshot tests zasadniczo działają, najpierw generując snapshot interfejsu użytkownika komponentu React. Snapshot tests są przeprowadzane obok komponentu i za każdym razem, gdy są uruchamiane.

Test zakończy się niepowodzeniem, jeśli dwie 'migawki' nie będą się zgadzać, co oznacza, że zmiana jest nieoczekiwana lub migawka referencyjna musi zostać zaktualizowana do nowej wersji składnika interfejsu użytkownika.

Przeprowadźmy test migawki na istniejącym pliku `App.js`. Zanim zaczniemy, będziemy musieli zainstalować dodatkowy pakiet, [react-test-renderer](https://www.npmjs.com/package/react-test-renderer). react-test-renderer to biblioteka, która umożliwia renderowanie komponentów React jako obiektów JavaScript bez potrzeby posiadania DOM.

```bash
npm i --save-dev react-test-renderer 
```

Po instalacji pakietu, zaimportuj go do pliku `App.test.js`.

```javascript
// App.test.js
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import App from './App';
var assert = require('assert');
```

Następny krok, dodajmy nasz pierwszy test snapshot test. Dodaj poniższy kod na dole pliku `App.test.js`.

```javascript
// App.test.js
describe('Jest Tests', () => {
  it('snapshot matches', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```

Uruchom komendę `npm run test` i obserwuj co się dzieje. Zauważysz, że folder `__snapshots_` jest stworzony z plikiem `App.test.js.snap` w sobie.

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Jest Tests snapshot matches 1`] = `
<div
  className="App"
>
  <p>
    0
  </p>
  <button
    id="offButton"
    onClick={[Function]}
  >
    Off
  </button>
  <button
    id="onButton"
    onClick={[Function]}
  >
    On
  </button>
</div>
`;

```

Jeśli przyjrzysz się uważnie, zobaczysz, że powyższy wynik jest bardzo podobny do zawartości pliku `App.js`. W tym momencie napisany snapshot test przechodzi pomyślnie, jak widać na poniższym obrazku, więc skąd wiemy, kiedy test migawki nie powiedzie się.

![Snapshot test passed](https://i.imgur.com/LtBU2hx.png)

Aby snapshot test nie powiódł się i spowodował, że Jest generuje błąd, będziemy musieli edytować plik `App.js`, aby zmienić renderowany wynik, a następnie ponownie uruchomić komendę` test`. Dlatego dokonamy niewielkiej edycji pliku `App.js`,

```javascript
// App.js
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      status: 0,
    }
  }

  setOn = event => {
    this.setState({status: 1})
  }; 

  setOff = event => {
    this.setState({status: 0})
  }; 

  render() {
    return (
      <div className="App">
        <p className="value">
          {this.state.status}
        </p>

        <button id="offButton" onClick={this.setOff}>Off</button>
        <button id="onButton" onClick={this.setOn}>On</button>
      </div>
    );
  }
}

export default App;

```

Niewielka zmiana polegała na dodaniu `className ="value"` do jedynego znacznika `p` w komponencie. Po zaktualizowaniu pliku obserwator Jest powinien zaktualizować i powiadomić o nieudanym teście.

![Failed snapshot test](https://i.imgur.com/5C5z1k4.png)

Jak widać na powyższym obrazku Jest określa, gdzie nie powiodło się porównanie migawki. Aby to naprawić, możemy wykonać jedną z tych dwóch rzeczy.

1. Cofnij zmianę i powinieneś zobaczyć testy zakończone pomyślnie.
2. Naciśnij klawisz `u` w oknie terminala, aby zaktualizować sam plik migawek i wszystkie testy powinny zakończyć się pomyślnie.

## Wnioski

W tym artykule zapoznaliśmy się z Jest i Enzymem. Oba są narzędziami testowymi, które pomagają testować aplikacje React. 'Jest' to platforma do testowania JavaScript używana do testowania aplikacji JavaScript, podczas gdy 'Enzyme' to narzędzie do testowania JavaScript dla React, które ułatwia stwierdzanie, manipulowanie i przeglądanie wyników komponentów React.

Następnie wprowadzono nas do testowania składników React przy użyciu kombinacji Jest i Enzymu. Widzieliśmy także różne metody testowania aplikacji React za pomocą Enzymu.

Bazę kodów dla tego samouczka można zobaczyć na GitHub [tutaj](https://github.com/yomete/react-testing).
