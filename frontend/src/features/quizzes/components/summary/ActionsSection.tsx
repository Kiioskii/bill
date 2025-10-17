import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa6";
import { MdHome } from "react-icons/md";
import { TbReload } from "react-icons/tb";

const ActionsSection = () => {
  return (
    <div className="bg-white w-full grid grid-cols-3 rounded-md p-5 gap-5 border text-white font-semibold">
      <Button size={"lg"} variant={"default"}>
        <TbReload />
        Retry Quiz
      </Button>
      <Button
        size={"lg"}
        variant={"secondary"}
        className="bg-red-500 text-white "
      >
        <FaEye />
        Review Mistakes
      </Button>
      <Button
        size={"lg"}
        variant={"secondary"}
        className="bg-gray-500 text-white "
      >
        <MdHome />
        Back to Dashboard
      </Button>
    </div>
  );
};

export default ActionsSection;
