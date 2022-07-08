import { Leagues } from '../hooks/interfaces';
import { createContext } from 'react';

export default {
  leagueDetails: createContext<Leagues[]>([]),
};
