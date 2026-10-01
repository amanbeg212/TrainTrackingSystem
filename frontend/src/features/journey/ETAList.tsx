import React from 'react';
import { StationReference } from '../../types';
import { StationRow } from './StationRow';

interface ETAListProps {
  upcomingStations: StationReference[];
  completedStations: StationReference[];
  currentStation?: StationReference;
  onSelectStation?: (station: StationReference) => void;
}

export const ETAList: React.FC<ETAListProps> = ({
  upcomingStations,
  completedStations,
  currentStation,
  onSelectStation,
}) => {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      {currentStation && (
        <StationRow station={currentStation} isCurrent onSelect={onSelectStation} />
      )}
      {upcomingStations.map((st, idx) => (
        <StationRow
          key={st.code}
          station={st}
          isNext={idx === 0}
          onSelect={onSelectStation}
        />
      ))}
      {completedStations.map((st) => (
        <StationRow key={st.code} station={st} isPassed onSelect={onSelectStation} />
      ))}
    </div>
  );
};
