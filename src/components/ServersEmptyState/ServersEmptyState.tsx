import { Button, Text, useTheme } from '@geist-ui/core';
import { Frown } from '@geist-ui/react-icons';
import React from 'react';

interface Props {
  dim?: boolean;
  onResetFilters?: () => void;
}

const ServersEmptyState: React.FC<Props> = ({ dim = false, onResetFilters }) => {
  const theme = useTheme();
  const dimColour = theme.palette.accents_5;

  function onResetFiltersClick() {
    if (onResetFilters) onResetFilters();
  }

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <Frown size={48} color={dim ? dimColour : undefined} />
      <Text h2 my={0} style={{ ...(dim ? { color: dimColour } : {}) }}>
        No servers found
      </Text>

      {onResetFilters && (
        <>
          <Text p my={0}>
            Try adjusting your filter options to find servers.
          </Text>

          <Button auto onClick={onResetFiltersClick} mt={1}>
            Reset filters
          </Button>
        </>
      )}
    </div>
  );
};

export default ServersEmptyState;
