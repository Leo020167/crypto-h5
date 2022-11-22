import { withDefault, NumberParam } from 'use-query-params';

export const TypeParam = withDefault(NumberParam, 0);

export const ModeParam = withDefault(NumberParam, 0);
