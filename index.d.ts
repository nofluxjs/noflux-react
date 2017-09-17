import { State } from '@noflux/state';
import { ComponentClass, ClassicComponentClass } from 'react';

export const state:State;

export function connect<P>(component: ComponentClass<P>): ComponentClass<P>;
export function connect<P>(component: ClassicComponentClass<P>): ClassicComponentClass<P>;
export function connect<P, TFunction extends ComponentClass<P | void>>(target: TFunction): TFunction;
