import { useQueryState, queryTypes } from 'next-usequerystate';
import { SERVER_FILTERS } from '../types/Types';

export default function useServerFilters() {
  // Filters
  const [name, setName] = useQueryState(SERVER_FILTERS.NAME, queryTypes.string.withDefault(''));
  const [island, setIsland] = useQueryState(SERVER_FILTERS.ISLAND, queryTypes.string.withDefault(''));
  const [version, setVersion] = useQueryState(SERVER_FILTERS.VERSION, queryTypes.string.withDefault(''));
  const [mods, setMods] = useQueryState(SERVER_FILTERS.MODS, {
    parse: (query: string) => query.split(','),
    serialize: (value) => value.join(','),
  });
  const [firstPerson, setFirstPerson] = useQueryState(SERVER_FILTERS.FIRST_PERSON, queryTypes.boolean.withDefault(false));
  const [official, setOfficial] = useQueryState(SERVER_FILTERS.OFFICIAL, queryTypes.boolean.withDefault(false));
  const [experimental, setExperimental] = useQueryState(SERVER_FILTERS.EXPERIMENTAL, queryTypes.boolean.withDefault(false));
  const [hasNoQueue, setHasNoQueue] = useQueryState(SERVER_FILTERS.HAS_NO_QUEUE, queryTypes.boolean.withDefault(false));

  return {
    name,
    setName,
    island,
    setIsland,
    version,
    setVersion,
    mods,
    setMods,
    firstPerson,
    setFirstPerson,
    official,
    setOfficial,
    experimental,
    setExperimental,
    hasNoQueue,
    setHasNoQueue,
  };
}
