import * as migration_20260530_220505 from './20260530_220505';

export const migrations = [
  {
    up: migration_20260530_220505.up,
    down: migration_20260530_220505.down,
    name: '20260530_220505'
  },
];
