# React workshop

#### Step 1:
Klona repot:

```
$ git clone git@github.com:tjoskar/react-workshop.git
```

Installera alla beroenden

```
$ npm install
```

Starta appen för att se att allt fungerar som det ska.

```
$ npm start
```

[http://localhost:4444/](http://localhost:4444/)

#### Step 2:

Du borde nu se ett inputfält, en knapp och lite text. Nice! 🙌

Skriv något vackert i inputfältet. Märker du att något är fel? Det händer inget när du skriver? Varför? Om du öppnar dev-tools i din webbläsare så ser du dock att vi loggar det du skrivet. Så vad händer egentligen?

Öppna upp filen `new-task.js` och se om du kan fixa problemet. 

Ledtråd:

Om du tittar på template:en för inputfältet så ser den ut så här: `<input value={this.state.itemName} onChange={this.onChange} />`. Dvs. värdet som ska vara i input fältet kommer från vårt interna state (`this.state.itemName`) och så fort vi skriver något i fältet kommer `onChange` att anropas med ett event och i eventet finns den text som användaren har skrivit in men vi uppdaterar inte vårat state. Utan vi låter det gamla värdet vara kvar i statet. Så uppdatera statet så kommer det nog gå bra 🕺 

#### Step 3:

Tasken listas inte på sidan 😢 Fixa problemet!

Ledtråd: I `task-list.js` skrivs bara en tom lista ut. Så ska det ju inte vara. Se till att komponenten får listan av items som props. Se även till att skriva ut namnet på elementet, istället för hela elementet.  

#### Step 4:

Nice, så vi kan nu se alla todo-items 🎉 Vi kan dock fortfarande inte skapa nya? Det händer som inget när man klickar på "Save". Det finns dock en funktion i `app.js` som heter `onCreate` som skapar en ny todo. Kalla på funktionen i `new-task.js` (utan att ändra implementationen av `onCreate` i `app.js`, dock kommer du behöva ändra lite i `render` i `app.js` och i `onSubmit` i `new-task.js`). 

#### Step 5:

Se även till att töm input fältet när man har skapat ett item.

#### Step 6:

Så där, nu kan man skapa nya todos och vi kan se alla i listan men vi kan inte markera dom som klara 😕

Din uppgift blir nu att lägga till en checkbox i `task-list.js` som gör att man kan markera en todo som klar.

Ledtråd: Du kan skapa upp en checkbox genom följande html kod:

```html
<input type="checkbox" />
```

Du kan sedan säga om den ska vara ifylld eller inte genom att ge den följande attribut: `checked={item.isComplete}`.

Sedan får du ett ett event varje gång användaren klickar i checkboxen genom att tilldela följande attribut: `onChange={event => console.log('Update item: ' + item + '. Complete: event.target.checked')`

Och som av en slup så behöver funktionen `onCompleatChange` ett item och huruvida todo:n är klar eller inte.

#### Step 7:

Nu är det dags att knyta samman allt med ditt api 🚀

I sann tv kocks anda har jag förberett en api klient för dig. 

Eftersom det är backend som bestämmer id:t så behöver vi göra anropet till backen innan vi kan stoppa in den i vårat egna state.

Uppdatera `app.js` så att vi anropar backend.

Ledtråd:

Låt oss börja med `onCreate`. `apiClient.createItem` förväntar sig ett nytt item och funktionen kommer sedan returnera ett Promises object och i svaret till detta Promises har vi det nya objektet som backend ger tillbaka om allt har gått bra. Ex.

```js
const newItem = createItem('My new task');
apiClient.createItem(newItem).then(itemFromBackend => {
  console.log(itemFromBackend);
  // Nu kan vi uppdatera vårat state
});
```

När det kommer till `onCompleatChange` så gör vi nästan exakt samma sak men här man vi testa att använda `async/await`

```js
onCompleatChange = async (itemToChange, isComplete) => {
  await apiClient.updateItem({ ...itemToChange, isComplete });
  // Business as usual (uppdatera statet precis som innan)
};
```

#### Step 8:

Nice! Allt fungerar! 🌈

Jag måste dock berätta en hemlighet. Bara för att något fungerar så betyder det inte att det är bra 😔

I en enkel applikation som denna fungerar det utmärkt att ha alla todos i `app.js` och importera api-klienten direkt till `app.js` men allt som applikationen växer kommer detta designmönster bli ohållbart. Låt oss säga att vi vill lägga till funktionalitet för att registrera användare. Ska vi då spara all användardata i `app.js`? Vad händer om vi behöver dela på data mellan olika komponenter, vi kan då bli tvungna att ha redundant data och vidare kommer vi behöva skicka data i många led allt eftersom att antalet komponenter växer. 

En alternativ lösning är att använda ett bibliotek för att hantera våra state. Två populära bibliotek är redux och mobx så låt oss kolla på dessa två.

Skapa upp två nya git-brancher (vilket alltid är bra när man ska testa nya saker). Skapa en som heter `mobx` och en som heter `redux`.

```
$ git checkout -b mobx
$ git checkout -b redux
```

Låt oss först börja med Redux. Redux har som ide att det alltid ska finnas ett state och att det bara ska finnas ett dataflöde. Det kan se ut så här:

1. Användaren klickar på "Save"
2. En action skapas som heter "CREATE_TASK". Denna action innehåller även namnet på den nya todon
3. Actionen ges till alla så kallade reducers och det är i en reducer som vi har möjlighet att uppdatera vårat state.
4. När vi har uppdaterat vårat state kommer react reagera på att datan han ändrats och där med uppdatera komponenterna. 

Låt oss testa 🛠

Skapa upp följande filer:

##### actions/tasks.js
```js
import { createItem } from '../item';

export const createTask = itemName => ({
  type: 'CREATE_TASK',
  item: createItem(itemName)
});

export const changeCompleatTask = (item, isComplete) => ({
  type: 'CHANGE_COMPLEAT_TASK',
  id: item.id,
  isComplete
});
```

##### actions/index.js

```js
export { changeCompleatTask, createTask } from './tasks';
```

##### reducers/tasks.js

```js
import { createItem } from '../item';

const initState = {
  loading: false,
  items: []
};

export const tasks = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_TASK':
      return {
        ...state,
        items: [...state.items, action.item]
      };
    case 'CHANGE_COMPLEAT_TASK':
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.id) {
            return createItem(item.name, action.id, action.isComplete);
          }
          return item;
        })
      };
    default:
      return state;
  }
};
```

##### reducers/index.js

```js
import { combineReducers } from 'redux';
import { tasks } from './tasks';

export const rootReducer = combineReducers({
  tasks
});
```

Skapa sedan en store i `index.js` genom att använda `createStore` från `redux` (`import { createStore } from 'redux';`).
Wrappa sedan App-komponenten i en `Provider` och tilldela vår `store`. Detta kommer göra det möjligt att få tillgång till vår data vart som helst i applikationen.

```diff
+ const store = createStore(rootReducer);

const RootApp = () => (
+   <Provider store={store}>
     <App />
+   </Provider>
);
```

Just nu innehåller vår applikation enbart todo-items men låt oss säga att den växer större än så. Det kan därför vara bra att enbart plocka ut vad komponenten behöver. Skapa därför en funktion som mappar om vårat state till ett nytt objekt som enbart innehåller våra todos.

```js
const mapStateToProps = state => ({
  tasks: state.tasks
});
```

Sedan vill vi skapa två hjälp funktioner för att skapa och ändra en todo-task:

```js
const mapDispatchToProps = dispatch => ({
  createTask: itemName => dispatch(createTask(itemName)),
  changeCompleatTask: (item, isComplete) => dispatch(changeCompleatTask(item, isComplete))
});
```

Sedan kopplar vi ihop allt med funktionen `connect`:

```js
export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
```

Vi kan nu använda våra hjälpfunktioner istället för den implementation som vi har för `onCreate` och `onCompleatChange`. Vidare behöver vi inget internt state längre i `App` eftersom vi har ett gemensamt state i redux istället så det kan vi också ta bort:

```diff
-  componentDidMount() {
-    apiClient
-      .getAllItems()
-      .then(items => this.setState({ items, loading: false }));
-  }

   onCompleatChange = (itemToChange, isComplete) => {
-    const newItemList = this.state.items.map(item => {
-      if (item.id === itemToChange.id) {
-        const newItem = createItem(item.name, item.id, isComplete);
-        apiClient.updateItem(newItem);
-        return newItem;
-      }
-      return item;
-    });
-    this.setState({ items: newItemList });
+    this.props.changeCompleatTask(itemToChange, isComplete);
   };

   onCreate = itemName => {
-    const newItem = createItem(itemName);
-    this.setState({
-      items: [...this.state.items, newItem]
-    });
+    this.props.createTask(itemName);
   };
```

Detta betyder även att vi ska läsa `loading` och `items` från det gemensamma statet:
```diff
- if (this.state.loading) {
+ if (this.props.tasks.loading) {
```
```diff
- items={this.state.items}
+ items={this.props.tasks.items}
```

Så att i slutändan har vi något i stil med:

```js
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { TaskList } from './task-list';
import { NewItem } from './new-task';
import { createTask, changeCompleatTask } from './actions';

class AppComponent extends React.Component {
  onCompleatChange = (itemToChange, isComplete) => {
    this.props.changeCompleatTask(itemToChange, isComplete);
  };

  onCreate = itemName => {
    this.props.createTask(itemName);
  };

  render() {
    if (this.props.tasks.loading) {
      return <h1>Loading...</h1>;
    }
    return (
      <Fragment>
        <TaskList
          items={this.props.tasks.items}
          onCompleatChange={this.onCompleatChange}
        />
        <NewItem onCreate={this.onCreate} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks
});

const mapDispatchToProps = dispatch => ({
  createTask: itemName => dispatch(createTask(itemName)),
  changeCompleatTask: (item, isComplete) => dispatch(changeCompleatTask(item, isComplete))
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
```

#### Step 9:

Lägg till redux dev tools. Installera https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd i chrome och lägg till följande argument `window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()` till `createStore` i `index.js`

```js
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

Öppna devtools och se hur to kan färdas genom tid och rum med redux dev tools.

#### Step 10:

Men vad händer! Dina ändringar sparas inte längre på backend. Detta kan enkelt fixas genom att lägga till ett så kallat middleware till redux som "tjuvlyssnar" på dina actions och kan utföra sido effekter (dvs. en händelse som behöver läsa eller skriva till omvärlden, ex. en backend server).

I detta fall kommer vi använda av en så kallad `thunk`. Vad detta möjliggör är att vi kan dispatcha en funktion istället för en action. 

Nu kanske du tänker "va?". I så fall vill jag försöka förtydliga det hela. Hittills har vi dispatchat (jag är ledsen för svengelskan) en action. Exempelvis:

```js
export const createTask = itemName => ({
  type: 'CREATE_TASK',
  item: {
    id: Math.random(),
    name: itemName,
    isComplete: false
  }
});

const itemName = 'My new task';

dispatch(createTask(itemName))
```

Vad `thunk` möjliggör att vi kan ge en funktion till dispatch som sedan exekveras. Ex:

```js
export const getAllTasks = () => dispatch => {
  dispatch(setLoadingState(true));
  return api.getAllItems().then(items => {
    dispatch({
      type: 'RESET_ITEMS',
      items
    });
    dispatch(setLoadingState(false));
  });
};

dispatch(getAllTasks())
```

På det här viset har vi möjlighet att utföra flera actions i en action. Som i fallet ovan utförs det totalt tre stycken actions (dispatch anropas tre gånger) i funktionen `getAllTasks`. Detta gör alltså att vi kan utföra asynkrona anrop.

Det första vi måste göra är att lägga till `thunk` som `middleware`. Detta kan du göra genom att ändra i `index.js`:

```js
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import { App } from './app';
import { rootReducer } from './reducers';
import { apiClient } from './api-client';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk.withExtraArgument(apiClient)))
);

const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

render(<RootApp />, document.getElementById('root'));
```

Låt oss skriva om `createTask` och `changeCompleatTask` i `actions/tasks.js` till:

```js
export const createTask = itemName => (dispatch, getState, api) => {
  return api.createItem(createItem(itemName)).then(item =>
    dispatch({
      type: 'CREATE_TASK',
      item
    })
  );
};

export const changeCompleatTask = (item, isComplete) => (
  dispatch,
  getState,
  api
) => {
  return api.updateItem({ ...item, isComplete }).then(() =>
    dispatch({
      type: 'CHANGE_COMPLEAT_TASK',
      id: item.id,
      isComplete
    })
  );
};
```

Härligt! Vi kan nu lägga till och ändra ett item men.. vi kan inte ladda in alla items?! Låt oss skapa en ny action som gör just detta åt oss:

```js
export const getAllTasks = () => (dispatch, getState, api) => {
  dispatch(setLoadingState(true));
  return api.getAllItems().then(items => {
    dispatch({
      type: 'RESET_ITEMS',
      items
    });
    dispatch(setLoadingState(false));
  });
};
```

Och lägg till `getAllTasks` i `mapDispatchToProps`:

```diff
const mapDispatchToProps = dispatch => ({
+  getAllTasks: () => dispatch(getAllTasks()),
   createTask: itemName => dispatch(createTask(itemName)),
   changeCompleatTask: (item, isComplete) =>
     dispatch(changeCompleatTask(item, isComplete))
});
```

Och anropa sedan lägga till `componentDidMount` i `AppComponent`:

```js
componentDidMount() {
  this.props.getAllTasks();
}
```

#### Step 11:

Andas ut och tänk efter. Var detta bra? Dåligt?

Commita allt som du har gjort och gå vidare i ditt liv.

#### Step 12:

Låt oss nu kolla på mobx. Checka ut branchen som du skapa tidigare genom `git checkout mobx`.

Mobx fungerar lite annorlunda mot Redux. Mobx bygger på att man sätter upp modeller och att man kan lyssna på förändringar av dessa modeller och sedan uppdatera delar av appen när modellen ändras.

Låts oss hoppa in i koden och sedan kollar vi på hur det fungerar.

Låt oss först skapa upp våra modeller:

##### store/task.js

```js
import { observable } from 'mobx';

export class Task {
  @observable id;
  @observable name;
  @observable isComplete;
  api

  constructor(api, id, name, isComplete) {
    this.api = api
    this.id = id
    this.name = name
    this.isComplete = isComplete
  }

  async changeCompleatTask(isComplete) {
    await this.api.updateItem({ id: this.id, name: this.name, isComplete })
    this.isComplete = isComplete
  }
}
```

##### store/tasks.js

```js
import { observable } from 'mobx';
import { Task } from './task';
import { createItem } from '../item';

export class Tasks {
  @observable items = [];
  @observable loading = false;
  api

  constructor(api) {
    this.api = api
  }

  async getAllTasks() {
    this.loading = true;
    const items = await this.api.getAllItems()
    this.items = items.map(task => new Task(this.api, task.id, task.name, task.isComplete))
    this.loading = false;
  }

  async createTask(itemName) {
    const task = await this.api.createItem(createItem(itemName))
    const newTask = new Task(this.api, task.id, task.name, task.isComplete)
    this.items.push(newTask)
  }
}
```

##### store/root-store.js

```js
import { Tasks } from './tasks';

export class RootStore {
  constructor(api) {
    this.tasks = new Tasks(api);
  }
}
```

Låt oss nu skapa upp vår store i `index.js`:

```js
const store = new RootStore(apiClient);
```

och sedan använda `Provider` för att tillgodo se vår `store` till alla komponenter. Precis som vi gjorde i redux fallet. Koden kommer således bli något i stil med:

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { App } from './app';
import { apiClient } from './api-client';
import { RootStore } from './store/root-store';

const store = new RootStore(apiClient);

const RootApp = () => (
  <Provider tasks={store.tasks}>
    <App />
  </Provider>
);

render(<RootApp />, document.getElementById('root'));
```

Vi måste nu även uppdatera `app.js` så vi börjar lyssna på förändringarna. Detta gör vi genom att lägga på attributet `observer`. Sedan använder vi `inject` för att kunna ta in våra tasks som props. `app.js` kommer sedan se ut något i stil med:

```js
import React, { Fragment } from 'react';
import { TaskList } from './task-list';
import { NewItem } from './new-task';
import { inject, observer } from 'mobx-react';

@inject('tasks')
@observer
export class App extends React.Component {

  componentDidMount() {
    this.props.tasks.getAllTasks();
  }

  onCreate = itemName => {
    this.props.tasks.createTask(itemName);
  };

  render() {
    if (this.props.tasks.loading || !this.props.tasks.items) {
      return <h1>Loading...</h1>;
    }
    return (
      <Fragment>
        <TaskList items={this.props.tasks.items} />
        <NewItem onCreate={this.onCreate} />
      </Fragment>
    );
  }
}
```

Nu kanske du tänker "va fan händer?".
– Lugn, låt os..
- JAG ÄR LUGN!
- Okej, låt oss ta det här steg för steg.

Låt oss första kolla på vår modell `Task` och låt oss skapa bort lite saker för att förenkla den en aning:

```js
export class Task {
  @observable id;
  @observable name;
  @observable isComplete;
}
```

Vad betyder detta? Och vad är `@observable` för något? - `@` betyder att det är en decorator (Du har säker redan kommit i kontakt med detta i Java/C#/Python etc. om inte så är det också lugnt). Detta betyder att vi kommer lägga på meta data under runtime. I detta fall kan man lite slarvigt översätta klassen `Task` till (utan `@observable`-decorator):

```js
export class Task {
  _id;
  get id() {
    // Informera mobx om att vi vill komma åt 'id'
    informMobx('get id')
    return this._id;
  };
  set id(id) {
    // Informera mobx om 'id' har uppdaterats
    this._id = id;
  }

  _name;
  get name() {
    // Informera mobx om att vi vill komma åt 'name'
    informMobx('get name')
    return this._name;
  };
  set name(name) {
    // Informera mobx om 'name' har uppdaterats
    this._name = name;
  }

  _isComplete;
  get isComplete() {
    // Informera mobx om att vi vill komma åt 'isComplete'
    informMobx('get isComplete')
    return this._isComplete;
  };
  set isComplete(isComplete) {
    // Informera mobx om 'isComplete' har uppdaterats
    this._isComplete = name;
  }
}
```

Detta innebär att så fort vi använder ex. `name` så kommer mobx vara medveten om detta och så fort vi uppdaterar `name` så vet mobx att någon använder `name` och att vi kanske kommer behöva meddela om att `name` har ändrats.

```js
const task = new Task()

task.id = 1;
task.name = 'Kjell';

autorun(() => {
  // Kjell skrivs ut och mobx blir medveten om att vi är beroende av `name`
  console.log(task.name) 
})

// mobx blir medveten om att `name` har ändrats och kan därför meddela
// alla som är beroende av name och console.log kommer därför uppdateras igen
task.name = 'Oskar';
// mobx blir informerad om att `id` ändras men samtidigt vet mobx om att
// ingen är beroende av id så inget händer
task.id = 2;
```

Så hur kan mobx veta vad vi är beroende av? – Om du kollar i `app.js` så ser du att vi har lagt till `@observer` ovan klassen. Detta kommer göra att mobx skriver över `render`-metoden och analysera vilka modell propertys som denna render metod är beroende av. På så vis vet mobx vilka komponenter som mobx behöver exekvera om modellen ändras. Smart va?

Det är dock viktigt att se upp här för att i `render` i `App` så accessar vi enbart `tasks.loading` och `tasks.items`. Detta betyder att `App` enbart kommer reagera ifall `loading` eller `items` ändras. Så vad händer om `isComplete` på en specifik task ändras? - Inget! Eftersom vi läser `isComplete` i `task-list.js` och den komponenten har vi inte sagt att mobx ska observera. Detta kan vi enkelt fixa genom att lägga till: `observer`

```diff
import React from 'react';
+ import { observer } from 'mobx-react';

- export const TaskList = ({ items, onCompleatChange }) => (
+ export const TaskList = observer(({ items, onCompleatChange }) => (
```

Vidare så kan vi nu mer anropa `changeCompleatTask` direkt från ett `item`:

```js
export const TaskList = observer(({ items }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        <input
          type="checkbox"
          checked={item.isComplete}
          onChange={event => item.changeCompleatTask(event.target.checked)}
        />
        {item.name}
      </li>
    ))}
  </ul>
));
```

#### Step 13:

Uppdatera `new-task.js` så att den använder mobx istället för `setState`.

#### Step 14:

Seriöst? Har du hunnit hit på labbtiden? I så fall tycker jag att du kan hjälpa någon som inte har kommit lika långt 😊
