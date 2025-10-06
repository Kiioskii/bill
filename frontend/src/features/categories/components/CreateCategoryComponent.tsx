import { createElement, useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ColorSelector from "./ColorSelector";
import { useCreateCategory } from "../hooks/useCreateCategory";
import SelectIcon from "@/components/select-icon";

const CreateCategoryComponent = ({ toggleOpen }) => {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("blue-500");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);

  const createCategory = useCreateCategory();

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
    <div className="max-w-md mx-auto p-4 pl-0 space-y-4 ">
      <div className="w-full flex flex-row gap-5 ">
        <Input
          type="text"
          placeholder="Category name"
          className="w-2/3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex items-center justify-between w-1/3 space-x-2 ">
          <Button variant="outline" onClick={() => setShowIconPicker(true)}>
            {selectedIcon ? (
              <>
                {createElement(FaIcons[selectedIcon], { size: 20 })}
                <span className="ml-2">Change icon</span>
              </>
            ) : (
              "Chose icon"
            )}
          </Button>
        </div>
      </div>

      <ColorSelector value={color} onChange={setColor} />

      {showIconPicker && (
        <SelectIcon
          setSelectedIcon={setSelectedIcon}
          setShowIconPicker={setShowIconPicker}
        />
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

export default CreateCategoryComponent;
