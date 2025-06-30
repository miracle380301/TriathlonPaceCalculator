interface Activity {
  type: string;
  duration: number;
  distance: number;
}

interface CreateTCXParams {
  date: string | Date;
  activities: Activity[];
}

export const createTCX = ({ date, activities }: CreateTCXParams) => {
  let startTime = new Date(date);

  const laps = activities.map((act) => {
    const isoTime = startTime.toISOString();
    // Lap의 시작 시각을 저장하고, 다음 Lap 시작 시각으로 누적
    startTime = new Date(startTime.getTime() + act.duration * 1000);

    return `
      <Lap StartTime="${isoTime}">
        <TotalTimeSeconds>${act.duration}</TotalTimeSeconds>
        <DistanceMeters>${act.distance}</DistanceMeters>
        <Intensity>Active</Intensity>
      </Lap>
    `;
  });

  return `
<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
  <Activities>
    <Activity Sport="Other">
      <Id>${date}</Id>
      ${laps.join('\n')}
    </Activity>
  </Activities>
</TrainingCenterDatabase>
`;
};