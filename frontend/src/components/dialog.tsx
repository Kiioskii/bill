import { IoMdClose } from "react-icons/io";
import { Button } from "./ui/button";

const Dialog = ({ title, children, toggleOpen }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-xl w-fit max-h-[80vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold mb-3">{title}</h3>
          <Button
            className="rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer h-8 w-8"
            onClick={() => toggleOpen(false)}
            variant="secondary"
          >
            <IoMdClose />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
