import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { showToast } from "@/lib/toast";
import { useState } from "react";
import { useFile } from "../hooks/useFile";

const SheetComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { saveFile } = useFile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ["application/pdf", "text/csv"];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        showToast("Only .pdf and .csv files are allowed", "error");
        e.target.value = "";
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      saveFile.mutate(selectedFile);
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Upload report</SheetTitle>
        <SheetDescription>
          1. Dowland months report from your bank account <br />
          2. Upload file
        </SheetDescription>
      </SheetHeader>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div className="grid gap-3">
          <Label htmlFor="sheet-demo-name">File</Label>
          <Input
            id="bill"
            type="file"
            accept=".pdf,.csv"
            className="cursor-pointer"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <SheetFooter>
        <Button
          type="submit"
          disabled={!selectedFile || saveFile.isPending}
          onClick={handleSubmit}
        >
          {saveFile.isPending ? "Uploading..." : "Save file"}
        </Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};

export default SheetComponent;
