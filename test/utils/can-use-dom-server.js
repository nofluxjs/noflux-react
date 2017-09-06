import test from 'ava';
import { canUseDOM } from '../../src/utils';

test('can not use DOM from server', t => {
  t.is(canUseDOM, false);
});
