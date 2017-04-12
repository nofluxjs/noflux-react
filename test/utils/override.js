import test from 'ava';
import { override } from '../../src/utils';

test('override', t => {
  t.plan(4);
  let count = 0;
  class A {
    run() {
      t.is(count++, 2);
    }
    anotherRun() {
      t.is(count++, 0);
    }
  }
  class B extends A {
    run() {
      super.run();
      t.is(count++, 3);
    }
  }
  override(B, 'run', originRun => function run() {
    this.anotherRun();
    t.is(count++, 1);
    if (originRun) {
      originRun.call(this);
    }
  });
  const obj = new B();
  obj.run();
});
