"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAdminPremiumBenefitsQuery,
  useCreatePremiumBenefitMutation,
  useUpdatePremiumBenefitMutation,
  useDeletePremiumBenefitMutation,
  type PremiumBenefit,
} from "@/redux/features/subscription/subscriptionApi";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

type BenefitForm = {
  serialNumber: string;
  text: string;
  isActive: boolean;
};

const emptyForm: BenefitForm = {
  serialNumber: "1",
  text: "",
  isActive: true,
};

export default function PremiumBenefitsPage() {
  const { data, isLoading } = useGetAdminPremiumBenefitsQuery();
  const [createBenefit, { isLoading: creating }] =
    useCreatePremiumBenefitMutation();
  const [updateBenefit, { isLoading: updating }] =
    useUpdatePremiumBenefitMutation();
  const [deleteBenefit, { isLoading: deleting }] =
    useDeletePremiumBenefitMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PremiumBenefit | null>(null);
  const [form, setForm] = useState<BenefitForm>(emptyForm);

  const benefits: PremiumBenefit[] = useMemo(() => {
    const list: PremiumBenefit[] = data?.data || [];
    return [...list].sort((a, b) => a.serialNumber - b.serialNumber);
  }, [data]);

  const openCreate = () => {
    setEditing(null);
    const nextSerial =
      benefits.length > 0
        ? Math.max(...benefits.map((b) => b.serialNumber)) + 1
        : 1;
    setForm({ ...emptyForm, serialNumber: String(nextSerial) });
    setOpen(true);
  };

  const openEdit = (benefit: PremiumBenefit) => {
    setEditing(benefit);
    setForm({
      serialNumber: String(benefit.serialNumber),
      text: benefit.text,
      isActive: benefit.isActive,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const serialNumber = Number(form.serialNumber);
    if (!form.text.trim()) {
      toast.error("Benefit text is required");
      return;
    }
    if (Number.isNaN(serialNumber) || serialNumber < 1) {
      toast.error("Serial number must be a positive number");
      return;
    }

    try {
      if (editing) {
        await updateBenefit({
          id: editing._id,
          serialNumber,
          text: form.text.trim(),
          isActive: form.isActive,
        }).unwrap();
        toast.success("Benefit updated");
      } else {
        await createBenefit({
          serialNumber,
          text: form.text.trim(),
          isActive: form.isActive,
        }).unwrap();
        toast.success("Benefit created");
      }
      setOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to save benefit");
    }
  };

  const toggleActive = async (benefit: PremiumBenefit) => {
    try {
      await updateBenefit({
        id: benefit._id,
        isActive: !benefit.isActive,
      }).unwrap();
      toast.success("Benefit status updated");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update benefit");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this benefit?")) return;
    try {
      await deleteBenefit(id).unwrap();
      toast.success("Benefit deactivated");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to delete benefit");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Premium Benefits"
          description="Add, edit, reorder (serial), and toggle the 14 premium screen benefit points"
        />
        <Button
          onClick={openCreate}
          className="bg-emerald-900 hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Benefit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Benefits ({benefits.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="p-6 text-sm text-slate-500">Loading benefits...</p>
          ) : benefits.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No benefits yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Serial</TableHead>
                  <TableHead>Text</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-28">Active</TableHead>
                  <TableHead className="text-right w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benefits.map((benefit) => (
                  <TableRow key={benefit._id}>
                    <TableCell className="font-medium">
                      #{benefit.serialNumber}
                    </TableCell>
                    <TableCell>{benefit.text}</TableCell>
                    <TableCell>
                      <Badge
                        variant={benefit.isActive ? "active" : "restricted"}
                      >
                        {benefit.isActive ? "On" : "Off"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={benefit.isActive}
                        onCheckedChange={() => toggleActive(benefit)}
                        disabled={updating}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(benefit)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        disabled={deleting}
                        onClick={() => handleDelete(benefit._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit benefit" : "Add benefit"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Serial number</Label>
              <Input
                type="number"
                min={1}
                value={form.serialNumber}
                onChange={(e) =>
                  setForm({ ...form, serialNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Benefit text</Label>
              <textarea
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isActive: checked })
                }
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-900 hover:bg-emerald-800"
              disabled={creating || updating}
              onClick={handleSave}
            >
              {creating || updating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
