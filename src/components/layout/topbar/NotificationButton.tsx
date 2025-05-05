
import { Bell } from 'lucide-react';

const NotificationButton = ({ count = 0 }) => {
  return (
    <button className="relative">
      <Bell className="h-5 w-5 text-gray-600 hover:text-procloud-green transition-colors" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationButton;
