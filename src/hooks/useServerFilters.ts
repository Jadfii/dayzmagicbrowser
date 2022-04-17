import { useQueryState, queryTypes } from 'next-usequerystate';

export default function useServerFilters() {
  // Filters
  const [name, setName] = useQueryState('name', queryTypes.string.withDefault(''));
  const [island, setIsland] = useQueryState('island', queryTypes.string.withDefault(''));
  const [version, setVersion] = useQueryState('version', queryTypes.string.withDefault(''));
  const [mods, setMods] = useQueryState('mods', queryTypes.string.withDefault(''));
  const [firstPerson, setFirstPerson] = useQueryState('firstperson', queryTypes.boolean.withDefault(false));
  const [official, setOfficial] = useQueryState('official', queryTypes.boolean.withDefault(false));
  const [experimental, setExperimental] = useQueryState('experimental', queryTypes.boolean.withDefault(false));

  return {
    name,
    setName,
    island,
    setIsland,
    version,
    setVersion,
    mods: mods.split(','),
    setMods,
    firstPerson,
    setFirstPerson,
    official,
    setOfficial,
    experimental,
    setExperimental,
  };
}
