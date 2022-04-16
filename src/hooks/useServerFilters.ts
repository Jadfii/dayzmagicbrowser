import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useServerFilters() {
  const router = useRouter();

  // Filters
  const [name, setName] = useState<string>('');
  const [island, setIsland] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [mods, setMods] = useState<string[]>([]);

  // Apply filters to URL
  useEffect(() => {
    const filters = {
      ...(name ? { name } : {}),
      ...(island ? { island } : {}),
      ...(version ? { version } : {}),
      ...(mods.length > 0 ? { modIds: mods.join(',') } : {}),
    };

    router.push({
      query: filters,
    });
  }, [name, island, version]);

  return { name, setName, island, setIsland, version, setVersion, mods, setMods };
}
