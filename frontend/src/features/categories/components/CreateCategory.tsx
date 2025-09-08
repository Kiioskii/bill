import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoMdClose } from "react-icons/io";
import ColorSelector from "./ColorSelector";
import { useCategory } from "../hooks/useCategories";

const CreateCategory = ({ toggleOpen }) => {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("blue-500");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const allIcons = Object.keys(FaIcons);

  const { createCategory } = useCategory();

  const handleSelectIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    setShowIconPicker(false);
  };

  const handleCreateCategory = () => {
    if (!name || !color || !selectedIcon) return;
    createCategory.mutate(
      {
        name,
        color,
        icon: selectedIcon,
      },
      {
        onSuccess: () => {
          toggleOpen();
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 ">
      {/* Input na tytuł */}
      <Input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Wybór ikony */}
      <div className="flex items-center justify-between  space-x-2">
        <Button variant="outline" onClick={() => setShowIconPicker(true)}>
          {selectedIcon ? (
            <>
              {React.createElement(FaIcons[selectedIcon], { size: 20 })}
              <span className="ml-2">Change icon</span>
            </>
          ) : (
            "Chose icon"
          )}
        </Button>
      </div>
      <ColorSelector value={color} onChange={setColor} />

      {/* Modal wyboru ikony */}
      {showIconPicker && (
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
                .filter((icon) =>
                  icon.toLowerCase().includes(search.toLowerCase())
                )
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
      )}

      <Button
        onClick={handleCreateCategory}
        disabled={!name || !selectedIcon || !color}
        variant={"default"}
        className="cursor-pointer"
      >
        {createCategory.isPending ? "Creating..." : "Create"}
      </Button>
    </div>
  );
};

export default CreateCategory;
