import { useEffect, useState } from 'react';
import logDataBase from '../assets/log.txt';

function useLogData() {
  const [logData, setLogData] = useState(null);

  useEffect(() => {
    fetchLogData();
  }, []);

  const fetchLogData = async () => {
    try {
      const response = await fetch(logDataBase);
      const logText = await response.text();
      const logLines = logText.split('\n');

      const data = {
        hitpointsHealed: 0,
        damageTaken: {
          total: 0,
          byCreatureKind: {},
        },
        experienceGained: 0,
        loot: {}
      };

      logLines.forEach((line) => {
        if (line.includes('You healed yourself for')) {
          const regex = /You healed yourself for (\d+) hitpoints/;
          const match = line.match(regex);
          if (match) {
            const [, healedAmount] = match;
            data.hitpointsHealed += parseInt(healedAmount);
          }
        } else if (line.includes('You lose')) {
          const regex = /You lose (\d+) hitpoints/;
          const match = line.match(regex);
          if (match) {
            const [, damageAmount] = match;
            data.damageTaken.total += parseInt(damageAmount);
          }
        }
      });

      logLines.forEach((line) => {
        if (line.includes('You lose') && !line.includes('Black Knight')) {
          const regex = /You lose (\d+) hitpoints due to an attack by a (\w+)/;
          const match = line.match(regex);
          if (match) {
            const [, damageAmount, creatureType] = match;
            if (data.damageTaken.byCreatureKind.hasOwnProperty(creatureType)) {
              data.damageTaken.byCreatureKind[creatureType] += parseInt(damageAmount);
            } else {
              data.damageTaken.byCreatureKind[creatureType] = parseInt(damageAmount);
            }
          }
        }
      });



      logLines.forEach((line) => {
        if (line.includes('You gained')) {
          const regex = /You gained (\d+) experience points/;
          const match = line.match(regex);
          if (match) {
            const [, experienceGainedAmount] = match;
            data.experienceGained += parseInt(experienceGainedAmount);
          }
        }
      });

      setLogData(data);
    } catch (error) {
      console.error('Error fetching log data:', error);
    }
  };

  return logData;
}

export default useLogData;
