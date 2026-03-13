import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

interface GreetingProps {
  name: string;
  isOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Greeting = ({ name, isOpen, onToggleSidebar }: GreetingProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 w-full h-16 flex items-center justify-between px-6 shadow-lg">
      {/* Mobile Toggle Button */}
      <button
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="lg:hidden text-brand text-2xl z-999"
        onClick={onToggleSidebar}
      >
        {isOpen ? <RiCloseLine /> : <RiMenu3Line />}
      </button>

      {/* Spacer for desktop (no toggle shown) */}
      <div className="hidden lg:block" />

      {/* Content */}
      <div className="relative flex flex-col items-center">
        <h1 className="text-xl font-bold text-brand truncate">Halo, {name}!</h1>
      </div>
    </div>
  );
};
