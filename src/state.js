import { State } from '@noflux/state';

const state = new State();

state.load = function load(initState) {
  this.set('', initState);
};

export default state;
