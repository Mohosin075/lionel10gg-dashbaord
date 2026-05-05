import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { initialData } from "@/app/(dashboard)/content/page";
import { useState } from "react";
import { toast } from "sonner";

export default function TranslationsTable() {
  const [data, setData] = useState(initialData);

  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    toast.success("Translation removed");
  };
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-slate-900">
          All Translations
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Language</TableHead>
            <TableHead>Translator</TableHead>
            <TableHead>Verses</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.language}</TableCell>
              <TableCell>{item.translator}</TableCell>
              <TableCell>{item.verses.toLocaleString()}</TableCell>
              <TableCell>{item.lastUpdated}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    item.status === "published" ? "default" : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-3">
                  <button>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
