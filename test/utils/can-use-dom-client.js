import test from 'ava';
import '../helpers/setup-test-env';
import { canUseDOM } from '../../src/utils';

test('can use DOM from client or jsdom', t => {
  t.is(canUseDOM, true);
});
