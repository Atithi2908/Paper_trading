import { useState, useRef, useEffect } from 'react';
import { FaFacebookMessenger, FaBell, FaUser, FaCaretDown, FaSearch } from 'react-icons/fa';

export default function Topbar({ siteName = 'MyWebsite', balance = 10000 }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    

    return (
      <header className="w-full bg-[#1F2940] border-b border-gray-200 shadow-sm">
  <div className="flex items-center justify-between h-16 px-0">

    {/* Left: Site Name */}
    <div className="text-xl font-semibold text-sky-600 ml-2">
      {siteName}
    </div>

    {/* Center: Search Box */}
    <div className="flex-1 flex justify-center">
      <div className="hidden md:flex items-center border rounded-md px-2 py-1 gap-2 w-96">
        <input
          type="text"
          placeholder="Search stocks, crypto..."
          className="outline-none bg-transparent text-base text-white placeholder-gray-400 w-full"
        />
        <FaSearch className="text-white" />
      </div>
    </div>

    
    <div className="flex items-center gap-4 mr-2">

     
      <button className="relative p-2 rounded-lg hover:bg-gray-700 transition">
        <FaFacebookMessenger size={20} className="text-white" />
        <span className="absolute top-0 right-0 -mt-1 -mr-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">3</span>
      </button>

     
      <button className="relative p-2 rounded-lg hover:bg-gray-700 transition">
        <FaBell size={20} className="text-white" />
        <span className="absolute top-0 right-0 -mt-1 -mr-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">7</span>
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((s) => !s)}
          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-700 transition"
        >
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
            <FaUser size={16} />
          </div>
          <span className="hidden sm:block text-sm font-medium text-white">John</span>
          <FaCaretDown size={16} className={`text-white transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-20">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
            <div className="border-t border-gray-100"></div>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
          </div>
        )}
      </div>

      {/* Balance */}
      <div className="bg-black px-2 py-1 text-base text-green-600 flex items-center justify-center rounded-full">
        ${balance.toLocaleString()}
      </div>

    </div>
  </div>
</header>


    );
}