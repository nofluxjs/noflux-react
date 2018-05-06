import { State } from '@noflux/state';
import { ComponentClass, ClassicComponentClass, StatelessComponent } from 'react';

export const state: State;

export function connect<T extends ComponentClass<any>>(target: T): T;
export function connect<T extends ClassicComponentClass<any>>(target: T): T;
export function connect<P>(target: StatelessComponent<P>): ComponentClass<P>;
