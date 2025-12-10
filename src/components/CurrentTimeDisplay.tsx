import { format } from 'date-fns';

interface CurrentTimeDisplayProps {
  currentTime: Date;
}

export function CurrentTimeDisplay({ currentTime }: CurrentTimeDisplayProps) {
  const dayName = format(currentTime, 'EEEE');
  const monthDay = format(currentTime, 'MMMM d');
  const time = format(currentTime, 'h:mm a');

  return (
    <div className="flex items-center justify-between w-full px-4 py-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">{dayName}</h1>
        <p className="text-xl md:text-2xl text-foreground">{monthDay}</p>
      </div>
      <div className="text-6xl md:text-8xl font-bold text-navy font-mono">
        {time}
      </div>
    </div>
  );
}
