import { State } from '@noflux/state';

const state = new State();

let noticed = false;
state.load = function load(initState) {
  if (!noticed) {
    noticed = true;
    // eslint-disable-next-line no-console
    console.warn('Warning: state.load(data) is deprecated, use state.set(data) or state.set(\'\', data).');
  }
  this.set('', initState);
};

export default state;
