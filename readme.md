# React workshop

Go to instructions in [English](#instructions-in-english)

#### Step 1:

Klona repot:

```
$ git clone ssh://git@bitbucket.valtech.de:7999/talang/react-todo.git
```

Ställ dig i mappen:

```
cd react-todo
```

Installera alla beroenden:

```
$ npm install
```

Starta appen för att se att allt fungerar som det ska:

```
$ npm start
```

Surfa in på [http://localhost:1234/](http://localhost:1234/)

#### Step 2:

Du borde nu se ett inputfält och en knapp. Nice! 🙌

Skriv något vackert i inputfältet. Märker du att något är fel? Det händer inget med inputfältet när du skriver? Varför? Om du öppnar dev-tools i din webbläsare så ser du dock att vi loggar det du skriver. Så vad händer egentligen?

Öppna upp filen `tasks/new-task.tsx` och se om du kan fixa problemet.

Ledtråd:

Om du tittar på template:en för inputfältet så ser den ut så här: `<input value={taskName} onChange={onChange} />`. Dvs. värdet som ska vara i input fältet kommer från vår interna hook (`taskName`) och så fort vi skriver något i fältet kommer `onChange` att anropas med ett event och i eventet finns den text som användaren har skrivit in men vi uppdaterar inte vår hook. Utan vi låter det gamla värdet vara kvar. Så uppdatera värdet så kommer det nog gå bra 🕺

#### Step 3:

Det visas inga tasks på sidan 😢 Fixa problemet!

Ledtråd: I `tasks/task-list.tsx` skrivs bara en tom lista ut. Så ska det ju inte vara. Se till att komponenten använder listan tasks som den får som props istället. Se även till att bara skriva ut namnet på elementet, istället för hela elementet.

#### Step 4:

Nice, så vi kan nu se alla todo-tasks 🎉 Vi kan dock fortfarande inte skapa nya? Det händer inget när du klickar på "Save". Det finns dock en funktion i `app.tsx` som heter `onCreate` som skapar en ny todo. Kalla på funktionen i `tasks/new-task.tsx` (utan att ändra implementationen av `onCreate` i `app.tsx`, dock kommer du behöva ändra lite i `app.tsx`'s `render()`-metod samt `tasks/new-task.tsx`'s `onSubmit()`-metod).

#### Step 5:

Se även till att tömma input fältet när du har skapat en todo.

#### Step 6:

Så där, nu kan du skapa nya todos och vi kan se alla i listan men vi kan inte markera dom som klara 😕

Din uppgift blir nu att lägga till en checkbox i `tasks/task-list.tsx` som gör att du kan markera en todo som klar.

Ledtråd: Du kan skapa upp en checkbox genom följande html kod:

```html
<input type="checkbox" />
```

Du kan sedan säga om den ska vara ifylld eller inte genom att ge den följande attribut: `checked={task.isComplete}`.

Sedan får du ett event varje gång användaren klickar i checkboxen genom att tilldela följande attribut: `onChange={event => console.log('Update task: ' + task + '. Complete: ' + event.target.checked)}`

Och som av en slump så behöver funktionen `onCompleteChange` en todo och huruvida todo:n är klar eller inte. Med andra ord, se till att trigga `onCompleteChange` i `onChange`, och att du skickar med rätt argument.

#### Step 7:

Nu är det dags att knyta samman allt med ditt underbara todo-api 🚀

I sann tv kocks anda har en API klient förberetts för dig.

Börja med att uppdatera `api/api-client.tsx` så att vi hämtar alla todos från API:t:

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

Starta igång ditt [TalangApi](https://bitbucket.valtech.de/bb/projects/TALANG/repos/talang-api/browse) och kontrollera att din sida skriver ut todo-tasks från API:t.

Det finns stor risk att du får problem med CORS ([Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)). Problemet är att react-appen kör på en url och API:et på en annan. För att lösa det, gå till din node-applikation.

##### Koa:

```
npm install @koa/cors --save
```

Lägg sedan till detta i `index.tsx` :

```
const cors = require('@koa/cors');
...
app.use(cors());

```

##### Express:

```
$ npm install cors
```

Lägg sedan till detta i `index.tsx` :

```
const cors = require('cors');
app.use(cors());
```

##### Fortsättning (Koa och Express)

Det går att lägga till flera app.use(...) så bara att lägga de under varandra.

Om du inte lyckas få till det, kan du lösa det genom att installera följande tillägg i webbläsaren: CORS Unblock. Denna approach funkar bra i lokal utveckling, men inte så bra i produktion. Dock kan vi skippa den konfigurationen och köra med tillägget för nu.

Eftersom det är backend som bestämmer id:t för objekten så behöver vi göra anropet till backend innan vi kan stoppa in den i vårat egna state.

Uppdatera `app.tsx` så att vi anropar backend när vi skapar tasks.

Ledtråd:

Låt oss börja med `onCreate`. `apiClient.createTask` förväntar sig en ny task och funktionen kommer sedan returnera ett Promises object och i svaret till detta Promises har vi det nya objektet som backend ger tillbaka om allt har gått bra. Ex.

```ts
const newTask = constructTask("My new task");
apiClient.createTask(newTask).then((taskFromBackend) => {
  console.log(taskFromBackend);
  // Nu kan vi uppdatera vårat state
});
```

När det kommer till `onCompleteChange` så gör vi nästan exakt samma sak men här kan vi testa att använda `async/await`

```ts
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

Börja med att göra om AppComponent (`app.tsx`) till att bli funktionell, och använda `useState` och `useEffect`.

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

Notera att `AppComponent` nu är en funktionell komponent, och inte en klass. Vi använder inte längre ett `state` objekt, utan två stycken state hooks istället. `tasks` motsvarar listan med tasks, och `setTasks` är en funktion som ändrar i tasks (gör det _aldrig_ manuellt, använd alltid funktionen).

Istället för `componentDidMount` använder vi `useEffect`, vilket är en funktion som kommer köras varje gång något ändras på hemsidan, om inte annat specificerats. `useEffect` kan väljas att bara ta en funktion som input, och då körs det varje gång något ändras. Om du lägger till en lista med variabler, så kommer funktionen bara att köras när någon av dom variablerna ändras. Lämnar du listan tom, körs bara funktionen när componenten laddas (en enda gång m.a.o.).

So many possibilites 😍. Däremot var det där inte allt som behöver ändras i `AppComponent` för att programmet ska fungera, fixa till så det funkar igen.

Tips: `this` behövs inte längre, `state` är inte längre en variabel utan vi använder andra saker istället, och `render()` finns inte på en funktionell komponent.

#### Step 9:

`useEffect` är ganska coolt. Vi borde hitta på något mer att göra med det. I `counter/counter.tsx` finns det en komponent för att visa hur många tasks du har klarat av. Den tar in en input, en lista av tasks (inte bästa design-beslutet, meeeeen). Lägg till `Counter` i din `AppComponent` (i `app.tsx`):

```diff
<NewTask onCreate={onCreate}/>
+<Counter tasks={tasks} />
<TaskList
```

Great! Vi har nu en liten text, som säger att vi har klarat av lika många tasks som vi har, och den uppdateras inte när vi ändrar på något. Hm. Det var väl inte helt korrekt. Fixa den!

#### Step 10:

Seriöst? Har du hunnit hit på labbtiden?

Ta tillfället i akt och andas ut och tänk efter. Var labben bra? Dåligt? Det kan vara värt att reflektera lite över vad du gjort i alla labbar, vad du tyckt varit snyggt, kul eller ganska dumt. Kolla gärna med dina kamrater hur dom löst de olika problemen, och diskutera era olika lösningsförslag. Passa även på att hjälpa någon som inte har kommit lika långt 😊 Eller ta en kaffe, vad vet jag. 🍦

Alternativt, läs igenom den [officiella kom-igång guiden för React](https://reactjs.org/docs/hello-world.html) där många centrala koncept förklaras.

---

#Instructions in English

#### Step 1:

Clone repo:

```
$ git clone ssh://git@bitbucket.valtech.de:7999/talang/react-todo.git
```

Go to the folder:

```
cd react-todo
```

Install all dependencies:

```
$ npm install
```

Launch the app to see that everything works as it should:

```
$ npm start
```

Browse to [http://localhost:1234/](http://localhost:1234/)

#### Step 2:

You should now see an input field and a button. Nice! 🙌

Write something beautiful in the input field. Do you notice that something is wrong? Nothing happens to the input field when you type? Why? However, if you open dev-tools in your browser, you will see that we log what you type. So what's really going on?

Open the `tasks/new-task.tsx` file and see if you can fix the problem.

Clue:

If you look at the template for the input field, it looks like this: `<input value={taskName} onChange={onChange} />`. Ie. the value that should be in the input field comes from our internal hook (`taskName`) and as soon as we type something in the field, `onChange` will be called with an event and in the event is the text that the user has entered but we do not update our hook. But we leave the old value. So update the value and it will probably go well 🕺

#### Step 3:

No tasks are displayed on the page 😢 Fix the problem!

Hint: In `tasks/task-list.tsx`, only a blank list is printed. That should not be the case. Make sure the component uses the list of tasks it receives as props instead. Also, make sure to print only the name of the element, instead of the entire element.

#### Step 4:

Nice, so we can now see all the todo tasks 🎉 We still can not create new ones? Nothing happens when you click "Save". However, there is a function in `app.tsx` called `onCreate` that creates a new todo. Call the function in `tasks/new-task.tsx` (without changing the implementation of` onCreate` in `app.tsx`, however you will need to change a bit in` app.tsx`s `render()` method and `tasks/new-task.tsx`s `onSubmit()`method).

#### Step 5:

Also, be sure to clear the input field after creating a todo.

#### Step 6:

So there, now you can create new todos and we can see them all in the list but we can not mark them as ready 😕

Your task now will be to add a checkbox to the `tasks/task-list.tsx` which allows you to mark a todo as done.

Hint: You can create a checkbox through the following html code:

```html
<input type="checkbox" />
```

You can then say whether it should be filled in or not by giving it the following attribute: `checked={task.isComplete}`.

Then you get an event every time the user clicks in the checkbox by assigning the following attributes: `onChange={event => console.log('Update task:' + task + '. Complete:' + event.target.checked)}`

And as if by chance, the function `onCompleteChange` needs a todo and whether the todo is complete or not. In other words, make sure to trigger `onCompleteChange` in `onChange`, and that you are sending the correct argument.

#### Step 7:

Now it's time to connect everything with your wonderful todo api 🚀

In the spirit of true TV chef, an API client has been prepared for you.

Start by updating `api/api-client.tsx` so that we retrieve all todos from the API:

```diff
 getAllTasks() {
  console.log('Fetching all todos todos');
- return Promise.resolve ([
- {
- id: 1,
- name: 'Feed cat',
- isComplete: true
-},
- {
- id: 2,
- name: 'Save world',
- isComplete: false
-}
-]);
- // return fetch (BASE_URL).then(result => result.json ());
+ return fetch (BASE_URL).then(result => result.json ());
},
```

Start your [TalangApi](https://bitbucket.valtech.de/bb/projects/TALANG/repos/talang-api/browse) and check that your page prints todo-tasks from the API.

There is a high risk that you will encounter problems with CORS ([Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)). The problem is that the react app runs on one url and the API on another. To resolve this, go to your node application.

##### Koa:

```
npm install @koa/cors --save
```

Then add this to `index.tsx`:

```
const cors = require ('@koa/cors');
...
app.use(cors());

```

##### Express:

```
$ npm install cors
```

Then add this to `index.tsx`:

```
const cors = require('cors');
app.use(cors());
```

##### Continued (Koa and Express)

It is possible to add several app.use(...) so just add them below each other.

If you are unable to do so, you can resolve it by installing the following browser add-ons: CORS Unblock. This approach works well in local development, but not so well in production. However, we can skip that configuration and run with the extension for now.

Since it is the backend that determines the ID for the objects, we need to make the call to the backend before we can put it in our own state.

Update `app.tsx` so that we call backend when we create tasks.

Clue:

Let's start with `onCreate`. `apiClient.createTask` expects a new task and the function will then return a Promises object and in response to this Promises, we have the new object that the backend returns if everything has gone well. E.g.

```ts
const newTask = constructTask("My new task");
apiClient.createTask(newTask).then((taskFromBackend) => {
  console.log(taskFromBackend);
  // Now we can update our state
});
```

When it comes to `onCompleteChange` we do almost exactly the same thing but here we can try to use `async/await`

```ts
onCompleteChange = async (taskToChange, isComplete) => {
  await apiClient.updateTask({ ...taskToChange, isComplete });
  // Business as usual (update the state like before)
};
```

Check that your tasks get the correct ID and feel free to double check with Postman or Insomnia against your api that it is updated correctly.

#### Step 8:

Nice, now you have a working application! 🌈

However, in this application, we have not consistently used the latest coolest and most essential technology that React has introduced; [hooks](https://reactjs.org/docs/hooks-intro.html). Hooks allow you to use state functionality without writing classes, ie more functional programming. So let's upgrade! 🚀

(Pssst: `useState` is a hook, so parts of the application use hooks. But not `AppComponent`!)

Start by redoing the AppComponent (`app.tsx`) to become functional, and use `useState` and `useEffect`.

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

Note that `AppComponent` is now a functional component, not a class. We no longer use a `state` object, but two state hooks instead. `tasks` corresponds to the list of tasks, and `setTasks` is a function that changes tasks (never do it manually, always use the function).

Instead of `componentDidMount` we use `useEffect`, which is a function that will run every time something is changed on the website, unless otherwise specified. `useEffect` can be selected to only take one function as input, and then it runs every time something changes. If you add a list of variables, the function will only run when one of the variables changes. If you leave the list blank, the function only runs when the component is loaded (only once i.e.).

So many possibilities 😍. However, that was not all that needs to be changed in the `AppComponent` for the program to work, fix it so it works again.

Tip: `this` is no longer needed,`state` is no longer a variable but we use other things instead, and `render()` does not exist on a functional component.

#### Step 9:

`useEffect` is pretty cool. We should come up with something more to do with it. In `counter/counter.tsx` there is a component to show how many tasks you have completed. It takes in an input, a list of tasks (not the best design decision, buuuuut). Add `Counter` to your `AppComponent` (in `app.tsx`):

```diff
<NewTask onCreate = {onCreate} />

- <Counter tasks = {tasks} />
  <TaskList
```

Great! We now have a small text, which says that we have managed as many tasks as we have, and it is not updated when we change something. Hm. That was not entirely correct. Fix it!

#### Step 10:

Seriously? Have you reached here during the lab session time?

Take the opportunity and exhale and think. Was the lab good? Bad? It may be worth reflecting a bit on what you did in all the labs, what you thought was nice, fun or quite stupid. Feel free to check with your peers how they solved the different problems, and discuss your different solution proposals. Also take the opportunity to help someone who has not come as far 😊 Or have a coffee, what do I know. 🍦

Alternatively, read the [official React Getting Started Guide](https://reactjs.org/docs/hello-world.html) where many key concepts are explained.
