import { useQueryState, queryTypes } from 'next-usequerystate';

export default function useServerFilters() {
  // Filters
  const [name, setName] = useQueryState('name', queryTypes.string.withDefault(''));
  const [island, setIsland] = useQueryState('island', queryTypes.string.withDefault(''));
  const [version, setVersion] = useQueryState('version', queryTypes.string.withDefault(''));
  const [mods, setMods] = useQueryState('mods', {
    parse: (query: string) => query.split(','),
    serialize: (value) => value.join(','),
  });
  const [firstPerson, setFirstPerson] = useQueryState('firstperson', queryTypes.boolean.withDefault(false));
  const [official, setOfficial] = useQueryState('official', queryTypes.boolean.withDefault(false));
  const [experimental, setExperimental] = useQueryState('experimental', queryTypes.boolean.withDefault(false));
  const [hasNoQueue, setHasNoQueue] = useQueryState('noqueue', queryTypes.boolean.withDefault(false));

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
