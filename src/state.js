import { State } from '@noflux/state';

const state = new State();

let middlewares = [];

export const applyMiddleware = (...newMiddlewares) => {
  middlewares = [...([...newMiddlewares].reverse()), ...middlewares];
};

let lastStateValue = state.get();

state.listen('change')
  .subscribe({
    next: value => {
      middlewares.forEach(middleware =>
        middleware({
          dispatch: () => {},
          getState: () => lastStateValue,
        })(() => {
          lastStateValue = state.get();
        })(
          { type: 'change', value },
        ),
      );
    }
  });

export default state;
