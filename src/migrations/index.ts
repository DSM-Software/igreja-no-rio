import * as migration_20260530_220505 from './20260530_220505';
import * as migration_20260531_235900 from './20260531_235900';
import * as migration_20260614_145600 from './20260614_145600';

export const migrations = [
  {
    up: migration_20260530_220505.up,
    down: migration_20260530_220505.down,
    name: '20260530_220505'
  },
  {
    up: migration_20260531_235900.up,
    down: migration_20260531_235900.down,
    name: '20260531_235900'
  },
  {
    up: migration_20260614_145600.up,
    down: migration_20260614_145600.down,
    name: '20260614_145600'
  },
];
