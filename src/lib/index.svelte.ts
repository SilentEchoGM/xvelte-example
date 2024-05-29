import {
  Actor,
  assign,
  createActor,
  setup,
  type AnyStateMachine,
  type StateFrom,
} from "xstate";

export class Xvelte<T extends AnyStateMachine> {
  send;
  state = $state<StateFrom<T>>();

  constructor(actor: Actor<T>) {
    this.send = actor.send;

    actor.subscribe((s) => {
      this.state = s;
    });

    actor.start();
  }
}

const logic = setup({
  actions: {
    addTodo: assign(
      (_, { todo, todos }: { todo: string; todos: string[] }) => ({
        todos: [...todos, todo],
      })
    ),
  },
  types: {} as {
    events: {
      type: "add";
      params: { todo: string };
    };
    context: {
      todos: string[];
    };
  },
}).createMachine({
  initial: "idle",
  context: {
    todos: [],
  },
  states: {
    idle: {
      on: {
        add: {
          actions: {
            type: "addTodo",
            params: ({ event, context }) => ({
              todo: event.params.todo,
              todos: context.todos,
            }),
          },
        },
      },
    },
  },
});

const actor = createActor(logic);

export const todoManager = new Xvelte(actor);
