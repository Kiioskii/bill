import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryList } from "@/features/categories/hooks/useCategoryList";
import { showToast } from "@/lib/toast";
import { createElement, useState, type FormEvent } from "react";
import * as FaIcons from "react-icons/fa";
import { useCreateDocument } from "../hooks/useCreateDocument";

const CreateFileComponent = ({
  categoryId,
  closeHandle,
}: {
  categoryId: string;
}) => {
  const { data, error, isPending } = useCategoryList();

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string | null>(categoryId);
  const [file, setFile] = useState<File | null>(null);
  const { mutate: createDocument, isPending: createIsPending } =
    useCreateDocument();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name || !category || !file) {
      showToast("All fields are required", "error");
      return;
    }

    createDocument(
      { name, file, categoryId: category },
      {
        onSuccess: () => {
          closeHandle(false);
        },
      }
    );
  };

  return (
    <form
      className="grid w-[40vw] max-w-xl gap-6 text-black  p-4"
      onSubmit={handleSubmit}
    >
      <div className="grid w-full gap-2">
        <Label htmlFor="email">Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="File name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="grid w-full gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          disabled={isPending || !!error}
          defaultValue={String(categoryId)}
          onValueChange={(val) => setCategory(val)}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue
              placeholder={isPending ? "Loading..." : "Select a category"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {data?.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  <span className="flex items-center gap-2">
                    {item.icon && FaIcons[item.icon]
                      ? createElement(FaIcons[item.icon], { size: 18 })
                      : null}
                    {item.name}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="cursor-pointer"
        />
      </div>

      <Button type="submit">
        {createIsPending ? "Uploading ..." : "Add file"}
      </Button>
    </form>
  );
};

export default CreateFileComponent;
