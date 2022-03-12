import { useState, useEffect, useMemo, useCallback } from 'react';

export const parse24HourTimeToUnix = (value) => {
  const hours = value.substring(0, 2);
  const minutes = value.substring(3, 5);

  const timerDate = new Date();
  timerDate.setHours(hours);
  timerDate.setMinutes(minutes);
  timerDate.setSeconds(0);
  timerDate.setMilliseconds(0);
  return timerDate.getTime();
}

export const useTimer = (end, updateRate) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const getUpdatedTime = useCallback(() => Math.max(end - Date.now(), 0), [end])

  useEffect(() => {
    setRemainingTime(getUpdatedTime());

    const interval = setInterval(() => {
      const newRemainingTime = getUpdatedTime();
      setRemainingTime(newRemainingTime);
      
      if (newRemainingTime === 0) {
        clearInterval(interval);
      }
    }, updateRate);

    return () => clearInterval(interval)
  }, [end, updateRate, getUpdatedTime]);

  return [remainingTime];
}

export const useParsedTimer = (end, updateRate) => {
  const [remainingTime] = useTimer(end, updateRate);
  const minutesValue = Math.floor(remainingTime / 60_000)
  const secondsValue = Math.floor(remainingTime % 60_000 / 1000)

  const parsedRemainingTime = useMemo(() => ({
    minutesValue,
    secondsValue, 
    minutesString: `${minutesValue}`.padStart(2, '0'),
    secondsString: `${secondsValue}`.padStart(2, '0')
  }), [remainingTime]);

  return [parsedRemainingTime];
}