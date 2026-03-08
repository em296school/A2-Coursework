import { HistoryIcon } from '../icons/HistoryIcon';

export interface HistoryLayoutProps {
  title: string;
  icon: React.ReactElement;
  children?: React.ReactElement[];
}

export default function HistoryLayout(props: HistoryLayoutProps) {
  return (
    <div className="flex flex-col gap-2 w-100 h-200 px-4 py-2">
      <span className="flex flex-row gap-2 items-center w-full">
        {props.icon}
        <h2 className="text-2xl font-medium">{props.title}</h2>
      </span>
      <div className="flex flex-col gap-1 w-full h-full overflow-y-auto">
        {props.children}
      </div>
    </div>
  );
}
