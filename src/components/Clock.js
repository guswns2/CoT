import { useState, useEffect } from "react";
function Clock() {
  const [time, setTime] = useState(new Date());
  const [day,setDay] = useState();
  const week = ["일","월", "화", "수","목","금","토"]
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    for (let i = 0; i < week.length;i++){
      if (time.getDay() == i){
        setDay(week[i]);
      }
    }
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <span>{time.toLocaleDateString()}{day}</span><br></br>
      <span>{time.toLocaleTimeString()}</span>
    </>
  );
}
export default Clock;