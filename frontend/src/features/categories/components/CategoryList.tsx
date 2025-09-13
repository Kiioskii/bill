import { useCategoryList } from "../hooks/useCategoryList";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import Dialog from "@/components/dialog";
import CreateFileComponent from "@/features/documents/components/CreateFileComponent";
import CategoryRow from "./CategoryRow";

const CategoryList = () => {
  const [openNewFileDialog, setOpenNewFileDialog] = useState<boolean | string>(
    false
  );
  const { data, error, isPending } = useCategoryList();

  if (isPending)
    return (
      <div className="w-full h-full flex  justify-center align-middle">
        <ClipLoader
          loading={isPending}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  return (
    <div className="w-full h-fit">
      {Array.isArray(data) ? (
        data?.map((item) => (
          <CategoryRow
            item={item}
            addNewDocumentHandler={setOpenNewFileDialog}
          />
        ))
      ) : (
        <p className="text-gray-400">Brak danych</p>
      )}

      {openNewFileDialog && (
        <Dialog title={"Add new file"} toggleOpen={setOpenNewFileDialog}>
          <CreateFileComponent
            categoryId={openNewFileDialog}
            closeHandle={setOpenNewFileDialog}
          />
        </Dialog>
      )}
    </div>
  );
};

export default CategoryList;
