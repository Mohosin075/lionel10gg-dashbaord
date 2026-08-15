"use client";

import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAdminPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  type SubscriptionPlan,
} from "@/redux/features/subscription/subscriptionApi";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type PlanForm = {
  name: string;
  description: string;
  price: string;
  currency: string;
  interval: "month" | "year";
  featuresText: string;
};

const emptyForm: PlanForm = {
  name: "",
  description: "",
  price: "0.99",
  currency: "eur",
  interval: "month",
  featuresText: "",
};

export default function SubscriptionPlansPage() {
  const { data, isLoading } = useGetAdminPlansQuery();
  const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: deleting }] = useDeletePlanMutation();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PlanForm>(emptyForm);

  const plans: SubscriptionPlan[] = Array.isArray(data?.data)
    ? data.data
    : data?.data?.result || data?.data?.data || [];

  const openCreate = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const handleCreate = async () => {
    const price = Number(form.price);
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required");
      return;
    }
    if (Number.isNaN(price) || price < 0.99 || price > 50) {
      toast.error("Price must be between €0.99 and €50.00");
      return;
    }
    const features = form.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    if (features.length === 0) {
      toast.error("Add at least one feature");
      return;
    }

    try {
      const res = await createPlan({
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        currency: form.currency,
        interval: form.interval,
        intervalCount: 1,
        features,
      }).unwrap();
      toast.success(res.message || "Plan created");
      setOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to create plan");
    }
  };

  const toggleActive = async (plan: SubscriptionPlan) => {
    try {
      await updatePlan({
        planId: plan._id,
        isActive: !plan.isActive,
      }).unwrap();
      toast.success("Plan updated");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update plan");
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Delete this plan?")) return;
    try {
      await deletePlan(planId).unwrap();
      toast.success("Plan deleted");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to delete plan");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Subscription Plans"
          description="Manage Stripe-backed pricing tiers (€0.99 – €50.00)"
        />
        <Button
          onClick={openCreate}
          className="bg-emerald-900 hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading plans...</p>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-slate-500">
            No subscription plans yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan._id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    {plan.description}
                  </p>
                </div>
                <Badge variant={plan.isActive ? "active" : "restricted"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-semibold">
                  {plan.currency?.toUpperCase()} {plan.price}
                  <span className="text-sm font-normal text-slate-500">
                    {" "}
                    / {plan.interval}
                  </span>
                </div>
                <p className="text-xs text-slate-500 break-all">
                  stripePriceId: {plan.stripePriceId || "—"}
                </p>
                <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                  {(plan.features || []).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!plan.isActive}
                      onCheckedChange={() => toggleActive(plan)}
                      disabled={updating}
                    />
                    <span className="text-sm text-slate-600">Active</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    disabled={deleting}
                    onClick={() => handleDelete(plan._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create subscription plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  min={0.99}
                  max={50}
                  step={0.01}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(value) =>
                    setForm({ ...form, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Interval</Label>
              <Select
                value={form.interval}
                onValueChange={(value: "month" | "year") =>
                  setForm({ ...form, interval: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <textarea
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.featuresText}
                onChange={(e) =>
                  setForm({ ...form, featuresText: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-900 hover:bg-emerald-800"
              disabled={creating}
              onClick={handleCreate}
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
