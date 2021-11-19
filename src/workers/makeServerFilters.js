const makeServerFilters = (servers, islands) => {
  const versionsValues = [
    { label: 'None', value: '', occurrences: 0 },
    ...[
      ...new Set(
        servers.reduce((acc, curr) => {
          if (!curr?.version) return acc;

          const option = { label: curr.version, value: curr.version, occurrences: 1 };

          const foundIdx = acc.findIndex((o) => o.value === option.value);
          if (foundIdx === -1) {
            acc.push(option);
          } else {
            acc[foundIdx].occurrences += 1;
          }

          return acc;
        }, [])
      ),
    ]
      .sort((a, b) => a.label.localeCompare(b.label))
      .reverse(),
  ];

  const islandsValues = [
    { label: 'None', value: '', occurrences: 0 },
    ...servers
      .reduce((acc, curr) => {
        const island = islands.find((island) => curr?.island?.toLowerCase().includes(island.terrainId.toLowerCase()));
        const option = { label: island?.name || curr?.island, value: island?.terrainId || curr?.island, occurrences: 1 };

        if (!option.label) return acc;

        const foundIdx = acc.findIndex((o) => o.value === option.value);
        if (foundIdx === -1) {
          acc.push(option);
        } else {
          acc[foundIdx].occurrences += 1;
        }

        return acc;
      }, [])
      .sort((a, b) => b.occurrences - a.occurrences),
  ];

  const modsValues = servers
    .reduce((acc, curr) => {
      if (!curr?.mods?.length) return acc;

      curr.mods.forEach((mod) => {
        const option = { label: mod.name, value: mod.steamId, occurrences: 1 };

        const foundIdx = acc.findIndex((o) => o.value === option.value);
        if (foundIdx === -1) {
          acc.push(option);
        } else {
          acc[foundIdx].occurrences += 1;
        }
      });

      return acc;
    }, [])
    .sort((a, b) => b.occurrences - a.occurrences);

  return {
    versionsValues,
    islandsValues,
    modsValues,
  };
};

addEventListener('message', (e) => {
  postMessage(makeServerFilters(e?.data?.servers || [], e?.data?.islands || []));
});
