import _connect from './connect';
import state from './state';
import pure from './pure2';
import Dataton from 'dataton';
function connect(data) {
  // 如果传入的是Component Class，则直接connect它
  if (data && data.prototype && data.prototype.render) return _connect(data, state);
  return function(clazz) {
    return _connect(clazz, data);
  }
}
export {
  connect as Connect,
  connect,
  pure,
  state,
  Dataton as State
};