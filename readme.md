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

Du borde nu se ett inputfällt, en knapp och lite text. Nice! 🙌

Skriv något vackert i inputfältet. Märkar du att något är fel? Det händer inget när du skriver? Varför? Om du öppnar dev-tools i den webbläsare så ser du dock att vi loggar det du skrivet. Så vad händer egentligen?

Öppna upp filen `new-task.js` och se om du kan fixa problemet. 

Ledtråd:

Om du tittar på templaten för inputfältet så ser den ut så här: `<input value={this.state.itemName} onChange={this.onChange} />`. Dvs. värdet som ska vara i input fältet kommer från vårt interna state (`this.state.itemName`) och så fort vi skriver något i fältet kommer `onChange` att anropas med ett event och i eventet finns den text som användaren har skrivit in men vi uppdaterar inte vårat state. Utan vi låter det gamla värdet vata kvar i statet. Så uppdatera statet så kommer det nog gå bra 🕺 (`this.setState({ itemName: denNyaSträngen });`)

#### Step 3:

Tasken listas inte på sidan 😢 Fixa problemet!

Ledtråd: I `task-list.js` skrivs bara en tom lista ut. Så ska det ju inte vara. Se till att komponenten får listan av items som props. Se även till att skriva ut namnet på elementet, istället för hela elementet.  

Om du får ett felmeddelande i devtools som säger något om att varje element behöver ett unikt id så kan du enkelt fixa det genom att lägga till `key={item.id}` på det yttre html-element som skapas för varje item. 

#### Step 4:

Nice, så vi kan nu se alla alla todo-items 🎉 Vi kan dock fortfarande inte skapa nya? Det händer som inget när man klickar på "Save". Det finns dock en funktion i `app.js` som heter `onCreate` som skapar en ny todo. Kalla på funktionen i `new-task.js` (utan att ändra implementationen av `onCreate` i `app.js`). 

#### Step 5:

Se även till att töm input fältet när man har skapat ett item.

#### Step 6:

Så där, nu kan man skapa nya todos och vi kan se alla i listan men vi kan inte markera dom som klara 😕

Din uppgift blir nu att lägga till en checkbox i `task-list.js` som gör att man kan markera en doto som klar.

Ledtråd: Du kan skapa upp en checkbox genom följande html kod:

```html
<input type="checkbox" />
```

Du kan sedan säga om den ska vara ifylld eller inte genom att ge den följande attrebut: `checked={item.completed}`.

Sedan får du ett ett event varje gång användaren klickar i checkboxen genom att tilldela följande attrebut:

`onChange={event => console.log('Update item: ' + item.id + '. Complete: event.target.checked')`

Och som av en slup så behöver funktionen `onCompleatChange` ett id och hurvida todon är klar eller inte.

#### Step 6:

Nu är det dags att knyta samman allt med ditt api 🚀

I sann tv-koks anda har jag förberett en api klient för dig. Så allt du behöver göra är att lägga till att `createItem` och `updateItem` kallas på i `onCompleatChange` och `onCreate` i `app.js`

#### Step 7:

Nice! Allt fungerar! 🌈

Jag måste dock berätta en hemlighet. Bara för att något fungerar så betyder det inte att det är bra 😔

I en enkel applikation som denna så fungerar det utmärkt att ha alla todos i `app.js` och importera api-klienten direkt till `app.js` men allt som applikationen växer kommer detta designmönster bli helt ohållbart. Låt oss säga att vi vill lägga till funktionalitet för att registrera användare. Ska vi då spara all användardata i `app.js`? Vad händer om vi behöver dela på data mellan olika komponenter, vi kan då bli tvugna att ha rendudant data och vidare kommer vi behöva skicka data i många led allt eftersom att antalet komponenter växer. 

En alternativ lösning är att använda ett bibliotek för att hantera våra state. Två populära bibliotek är redux och mobx så låt oss kolla på dessa. 

Låt oss först börja med Redux. Redux har som ide att det alltid ska finnas ett state och att det bara ska finnas ett data flöde. Det kan se ut så här:

1. Användaren klickar på "Spara"
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

export const changeCompleatTask = (id, completed) => ({
  type: 'CHANGE_COMPLEAT_TASK',
  id,
  completed
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
            return createItem(item.name, action.id, action.completed);
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
Wrappa sedan App-komponenten i en `Provider` och tilldela våran `store`. Detta kommer göra det möjligt att få tillgång till vår data vart som helst i applikationen.

```diff
+ const store = createStore(rootReducer);

const RootApp = () => (
+   <Provider store={store}>
     <App />
+   </Provider>
);
```

Just nu innehåller våran applikation enbart todo-items men låt oss säga att den växer större än så. Det kan därför vara bra att enbart plocka ut vad komponenten behöver. Skapa därför en funktion som mappar om vårat state till ett nytt objekt som enbart innehåller våra todos.

```js
const mapStateToProps = state => ({
  tasks: state.tasks
});
```

Sedan vill vi skapa två hjälp funktioner för att skapa och ändra en todo-task:

```js
const mapDispatchToProps = dispatch => ({
  createTask: itemName => dispatch(createTask(itemName)),
  changeCompleatTask: (id, completed) => dispatch(changeCompleatTask(id, completed))
});
```

Sedan kopplar vi ihop allt med functionen `connect`:

```js
export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
```

Vi kan nu använda våra hjälp funktioner istället för den inplementation som vi har för `onCreate` och `onCompleatChange`. Vidare behöver vi inget internt state längre i `App` eftersom vi har ett gemensamt state i redux istället så det kan vi också ta bort:

```diff
-  componentDidMount() {
-    apiClient
-      .getAllItems()
-      .then(items => this.setState({ items, loading: false }));
-  }

   onCompleatChange = (id, completed) => {
-    const newItemList = this.state.items.map(item => {
-      if (item.id === id) {
-        const newItem = createItem(item.name, id, completed);
-        apiClient.updateItem(newItem);
-        return newItem;
-      }
-      return item;
-    });
-    this.setState({ items: newItemList });
+    this.props.changeCompleatTask(id, completed);
   };

   onCreate = itemName => {
-    const newItem = createItem(itemName);
-    this.setState({
-      items: [...this.state.items, newItem]
-    });
+    this.props.createTask(itemName);
   };
```

Detta betydär även att vi ska läsa `loading` och `items` från det gemensa statet:
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
  onCompleatChange = (id, completed) => {
    this.props.changeCompleatTask(id, completed);
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
  changeCompleatTask: (id, completed) =>
    dispatch(changeCompleatTask(id, completed))
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
```

#### Step 8:

Lägg till redux dev tools. Installera https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd i chrome och lägg till följande argument `window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()` till `createStore` i `index.js`

```js
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

Öppna devtools och se hur to kan färdas genom tid och rum med redux dev tools.

#### Step 9:

Men vad händer! Dina ändringar spars inte längre på backend. Detta kan enkelt fixas genom att lägga till ett så kallat middleware till redux som "tjuvlyssnar" på dina actions och kan utföra sido effekter (dvs. en händelse som behöver läsa eller skriva till omvärden, ex. en backend server).



#### Step 9:

Hjälp en vän
