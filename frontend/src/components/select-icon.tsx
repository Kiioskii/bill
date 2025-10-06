import { IoMdClose } from "react-icons/io";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import * as FaIcons from "react-icons/fa";
import { useState } from "react";

const SelectIcon = ({ setSelectedIcon, setShowIconPicker }) => {
  const [search, setSearch] = useState<string>("");

  const allIcons = Object.keys(FaIcons);

  const handleSelectIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    setShowIconPicker(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-xl w-3/4 max-h-[80vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold mb-3">Chose color</h3>
          <Button
            className="rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer h-8 w-8"
            onClick={() => setShowIconPicker(false)}
            variant="secondary"
          >
            <IoMdClose />
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Szukaj ikony..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />
        <div className="grid grid-cols-6 gap-3 border-2">
          {allIcons
            .filter((icon) => icon.toLowerCase().includes(search.toLowerCase()))
            .map((icon) => {
              const IconComponent = FaIcons[icon];
              return (
                <div
                  key={icon}
                  onClick={() => handleSelectIcon(icon)}
                  className="flex justify-center items-center p-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <IconComponent size={22} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SelectIcon;
