# React workshop

#### Step 1:
Klona repot:

```
$ git clone ssh://git@bitbucket.valtech.de:7999/talang/react-todo.git
```

Installera alla beroenden

```
$ npm install
```

Starta appen för att se att allt fungerar som det ska.

```
$ npm start
```

[http://localhost:1234/](http://localhost:1234/)

#### Step 2:

Du borde nu se ett inputfält och en knapp. Nice! 🙌

Skriv något vackert i inputfältet. Märker du att något är fel? Det händer inget när du skriver? Varför? Om du öppnar dev-tools i din webbläsare så ser du dock att vi loggar det du skrivet. Så vad händer egentligen?

Öppna upp filen `tasks/new-task.js` och se om du kan fixa problemet.

Ledtråd:

Om du tittar på template:en för inputfältet så ser den ut så här: `<input value={task.name} onChange={onChange} />`. Dvs. värdet som ska vara i input fältet kommer från vår interna hook (`task.name`) och så fort vi skriver något i fältet kommer `onChange` att anropas med ett event och i eventet finns den text som användaren har skrivit in men vi uppdaterar inte vår hook. Utan vi låter det gamla värdet vara kvar. Så uppdatera värdet så kommer det nog gå bra 🕺

#### Step 3:

Det visas inga tasks på sidan 😢 Fixa problemet!

Ledtråd: I `tasks/task-list.js` skrivs bara en tom lista ut. Så ska det ju inte vara. Se till att komponenten använder listan tasks som den får som props istället. Se även till att bara skriva ut namnet på elementet, istället för hela elementet.

#### Step 4:

Nice, så vi kan nu se alla todo-tasks 🎉 Vi kan dock fortfarande inte skapa nya? Det händer som inget när man klickar på "Save". Det finns dock en funktion i `app.js` som heter `onCreate` som skapar en ny todo. Kalla på funktionen i `tasks/new-task.js` (utan att ändra implementationen av `onCreate` i `app.js`, dock kommer du behöva ändra lite i `render`, `app.js`, `onSubmit`, och `tasks/new-task.js`).

#### Step 5:

Se även till att töm input fältet när man har skapat en todo.

#### Step 6:

Så där, nu kan man skapa nya todos och vi kan se alla i listan men vi kan inte markera dom som klara 😕

Din uppgift blir nu att lägga till en checkbox i `tasks/task-list.js` som gör att man kan markera en todo som klar.

Ledtråd: Du kan skapa upp en checkbox genom följande html kod:

```html
<input type="checkbox" />
```

Du kan sedan säga om den ska vara ifylld eller inte genom att ge den följande attribut: `checked={task.isComplete}`.

Sedan får du ett event varje gång användaren klickar i checkboxen genom att tilldela följande attribut: `onChange={event => console.log('Update task: ' + task + '. Complete: ' + event.target.checked)}`

Och som av en slump så behöver funktionen `onCompleteChange` en todo och huruvida todo:n är klar eller inte.

#### Step 7:

Nu är det dags att knyta samman allt med ditt underbara todo-api 🚀

I sann tv kocks anda har en api klient förberetts för dig.

Börja med att uppdatera `api/api-client.js` så att vi hämtar alla todos från api:t:

```diff
 getAllTasks() {
  console.log('Fetching all todos todos');
-   return Promise.resolve([
-     {
-      id: 1,
-      name: 'Feed cat',
-      isComplete: true
-    },
-    {
-      id: 2,
-      name: 'Save world',
-      isComplete: false
-    }
-  ]);
-  // return fetch(BASE_URL).then(result => result.json());
+  return fetch(BASE_URL).then(result => result.json());
},
```

Starta igång ditt [TalangApi](https://git.valtech.se/talangprogrammet/talang-api) och kontrollera att din sida skriver ut todo-tasks från api:t.

Eftersom det är backend som bestämmer id:t för objekten så behöver vi göra anropet till backen innan vi kan stoppa in den i vårat egna state.

Uppdatera `app.js` så att vi anropar backend när vi skapar tasks.

Ledtråd:

Låt oss börja med `onCreate`. `apiClient.createTask` förväntar sig en ny task och funktionen kommer sedan returnera ett Promises object och i svaret till detta Promises har vi det nya objektet som backend ger tillbaka om allt har gått bra. Ex.

```js
const newTask = constructTask('My new task');
apiClient.createTask(newTask).then(taskFromBackend => {
  console.log(taskFromBackend);
  // Nu kan vi uppdatera vårat state
});
```

När det kommer till `onCompleteChange` så gör vi nästan exakt samma sak men här man vi testa att använda `async/await`

```js
onCompleteChange = async (taskToChange, isComplete) => {
  await apiClient.updateTask({ ...taskToChange, isComplete });
  // Business as usual (uppdatera statet precis som innan)
};
```

Kontrollera att dina tasks får korrekta id:n och dubbelkolla gärna med Postman eller Insomnia mot ditt api att det uppdateras korrekt.

#### Step 8:

Nice, nu har du ju en fungerande applikation! 🌈

Men, i den här applikationen har vi inte konsekvent använt den senaste coolaste och absolut nödvändigaste tekniken som React har introducerat; [hooks](https://reactjs.org/docs/hooks-intro.html). Hooks låter dig använda state funktionalitet utan att skriva klasser, dvs mer funktionell programmering. So let's upgrade! 🚀

(Pssst: `useState` är en hook, så delar av applikationen använder hooks. Men inte `AppComponent`!)

Börja med att göra om AppComponent (`app.js`) till att bli functionell, och använda `useState` och `useEffect`.

```diff
-import React, { Fragment } from 'react';
+import React, { Fragment, useState, useEffect } from 'react';
 import { TaskList } from './tasks/task-list';
 import { NewTask } from './tasks/new-task';
 import { apiClient } from './api/api-client';
 import { constructTask } from './tasks/task';

-class AppComponent extends React.Component {
-  state = {
-    tasks: [],
-    loading: true
-  };
+const AppComponent = () => {
+  const [tasks, setTasks] = useState([]);
+  const [loading, setLoading] = useState(true);

-  componentDidMount() {
+  useEffect(() => {
     apiClient
       .getAllTasks()
-      .then(tasks => this.setState({ tasks, loading: false }));
-  }
+      .then(tasks => {
+        setTasks(tasks);
+        setLoading(false);
+      });
+  }, []);
```

Notera att `AppComponent` nu är en funktionel komponent, och inte en klass. Vi använder inte längre ett `state` objekt, utan två stycken state hooks istället. `tasks` motsvarar listan med tasks, och `setTasks` är en funktion som ändrar i tasks (gör det inte manuellt, använd alltid funktionen).

Istället för `componentDidMount` använder vi `useEffect`, vilket är en funktion som kommer köras varje gång något ändras på hemsidan, om inte annat specificerats. `useEffect` kan väljas att bara ta en funktion som input, och då körs det varje gång något ändras. Om man lägger till en lista med variabler, så kommer funktionen bara att köras när någon av dom variablerna ändras. Lämnar man listan tom, körs bara funktionen när componenten laddas.

So many possibilites 😍. Däremot var det där inte allt som behöver ändras i `AppComponent` för att programmet ska fungera, fixa till så det funkar igen.

Tips: `this` behövs inte längre, `state` är inte längre en variabel utan vi använder andra saker istället, och `render()` finns inte på en funktionel komponent.

#### Step 9:
`useEffect` är ganska coolt. Vi borde hitta på något mer att göra med det. I `counter/counter.js` finns det en komponent för att visa hur många tasks man har klarat av. Den tar in en input, en lista av tasks (inte bästa design-beslutet, meeeeen). Lägg till `Counter` i din `Application` komponent:
```diff
<NewTask onCreate={onCreate}/>
+<Counter tasks={tasks} />
<TaskList
```

Great! Vi har nu en liten text, som säger att vi har klarat av lika många tasks som vi har, och den uppdateras inte när vi ändrar på något. Hm. Det var väl inte helt korrekt. Fixa den!

#### Step 10:
Seriöst? Har du hunnit hit på labbtiden?

Ta tillfället i akt och andas ut och tänk efter. Var labben bra? Dåligt? Det kan vara värt att reflektera lite över vad du gjort i alla labbar, vad du tyckt varit snyggt, kul eller ganska dumt. Kolla gärna med dina kamrater hur dom löst de olika problemen, och diskutera era olika lösningsförslag. Passa även på att hjälpa någon som inte har kommit lika långt 😊 Eller ta en kaffe, vad vet jag. 🍦
