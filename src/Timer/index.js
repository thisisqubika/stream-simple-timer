import { useState, useCallback } from 'react';
import { useParsedTimer, parse24HourTimeToUnix } from './timeUtils';
import styles from './Timer.module.css';

const DEFAULT_TIME = '12:35';

const App = () => {
  const [timerToggle, setTimerToggle] = useState(true);
  const toggleTimerStarted = useCallback(() => setTimerToggle(!timerToggle), [timerToggle]);
  
  const [timerEnd, setTimerEnd] = useState(parse24HourTimeToUnix(DEFAULT_TIME));
  const [remainingTime] = useParsedTimer(timerEnd, 250);

  const [timePicker, setTimePicker] = useState(DEFAULT_TIME);
  const updateTimerEnd = useCallback((newTime) => {
    setTimePicker(newTime);
    setTimerEnd(parse24HourTimeToUnix(newTime));
  }, []);
  
  let timerStyles;
  let startingSoonStyles;
  if (remainingTime.minutesValue === 0 && remainingTime.secondsValue === 0) {
    timerStyles = `${styles.timer} ${styles.stopped}`;
    startingSoonStyles = `${styles.startingSoon} ${styles.startingSoonFadeIn}`;
  } else if (remainingTime.minutesValue === 0 && remainingTime.secondsValue < 15) {
    timerStyles = `${styles.timer} ${styles.pulse}`;
    startingSoonStyles = styles.startingSoon;
  } else {
    timerStyles = styles.timer;
    startingSoonStyles = styles.startingSoon;
  }

  return (
    <div className={styles.container}>
      <button onClick={toggleTimerStarted}>Toggle</button>
      <div className={timerStyles}>
        { timerToggle && `${remainingTime.minutesString}:${remainingTime.secondsString}` }
      </div>
      <input type="time" value={timePicker} onChange={(event) => updateTimerEnd(event.target.value)} />
      <div className={startingSoonStyles}>
        { remainingTime.minutesValue === 0 && remainingTime.secondsValue === 0 && "Starting soon..."}
      </div>
    </div>
  );
}

export default App;
