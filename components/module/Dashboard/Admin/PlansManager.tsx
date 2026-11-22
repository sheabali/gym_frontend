"use client";

import React, { useState } from "react";
import {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  MembershipPlan,
} from "@/redux/api/planApi";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Layers,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function PlansManager() {
  const { data: plansResponse, isLoading, refetch } = useGetPlansQuery({
    includeInactive: true,
  }) as any;
  const plans: MembershipPlan[] = plansResponse?.data || [];

  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceBdt, setPriceBdt] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [featuresInput, setFeaturesInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPriceBdt("");
    setDurationDays("30");
    setFeaturesInput("");
    setIsFeatured(false);
    setIsActive(true);
    setEditingPlan(null);
  };

  const openCreateModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setDescription(plan.description || "");
    setPriceBdt((plan.price / 100).toString());
    setDurationDays(plan.durationDays.toString());
    setFeaturesInput(plan.features?.join(", ") || "");
    setIsFeatured(plan.isFeatured);
    setIsActive(plan.isActive);
    setAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !priceBdt || !durationDays) {
      toast.error("Please fill in required fields (Name, Price, Duration)");
      return;
    }

    const pricePaisa = Math.round(parseFloat(priceBdt) * 100);
    const days = parseInt(durationDays, 10);
    const features = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingPlan) {
        await updatePlan({
          id: editingPlan.id,
          name,
          description,
          price: pricePaisa,
          durationDays: days,
          features,
          isFeatured,
          isActive,
        }).unwrap();
        toast.success(`Plan "${name}" updated successfully`);
      } else {
        await createPlan({
          name,
          description,
          price: pricePaisa,
          durationDays: days,
          features,
          isFeatured,
          isActive,
        }).unwrap();
        toast.success(`Plan "${name}" created successfully`);
      }
      setAddModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save plan");
    }
  };

  const handleDeactivate = async (plan: MembershipPlan) => {
    if (!confirm(`Are you sure you want to deactivate "${plan.name}"? Past subscriptions remain valid.`)) {
      return;
    }
    try {
      await deletePlan(plan.id).unwrap();
      toast.success(`Plan "${plan.name}" deactivated`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to deactivate plan");
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xs border border-gray-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Membership Plans Catalog</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Prices are saved in paisa integers and snapshotted at time of purchase.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          size="sm"
          className="gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
        >
          <Plus size={14} />
          <span>Add New Plan</span>
        </Button>
      </div>

      {/* Plans Table */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center bg-white rounded-xs border border-gray-200">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xs border border-gray-200 shadow-xs">
          <Layers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-900">No membership plans created yet</p>
          <Button onClick={openCreateModal} size="sm" className="mt-3 text-xs">
            Create First Plan
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xs border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Plan Name & Slug</th>
                  <th className="py-3 px-4">Price (BDT)</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Features</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {plans.map((plan) => {
                  const priceBdtFormatted = (plan.price / 100).toLocaleString("en-US");

                  return (
                    <tr key={plan.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{plan.name}</div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          /{plan.slug}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-700">
                          ৳ {priceBdtFormatted}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-mono">
                          {plan.price} paisa
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {plan.durationDays} days
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-gray-600 truncate" title={plan.features?.join(", ")}>
                          {plan.features?.length || 0} benefits configured
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {plan.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Sparkles className="w-3 h-3" />
                            FEATURED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            plan.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {plan.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(plan)}
                            className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </Button>

                          {plan.isActive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeactivate(plan)}
                              className="h-7 px-2 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-gray-200 cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span>Deactivate</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Plan Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900">
              {editingPlan ? "Edit Membership Plan" : "Create New Membership Plan"}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Set the price, validity duration, and member privileges.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Plan Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 1 Month Standard Access"
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Price in BDT (৳) *
                </label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  value={priceBdt}
                  onChange={(e) => setPriceBdt(e.target.value)}
                  placeholder="e.g. 2500"
                  className="text-xs"
                  required
                />
                <span className="text-[10px] text-gray-400">
                  Stored as {priceBdt ? Math.round(parseFloat(priceBdt) * 100) : 0} paisa
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Duration (Days) *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder="30"
                  className="text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short plan summary..."
                rows={2}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Included Privileges (Comma Separated)
              </label>
              <Input
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="Unlimited gym floor access, Locker access, Free trial class"
                className="text-xs"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-gray-700">Featured Tier</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-gray-700">Active in Catalog</span>
              </label>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isCreating || isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>{editingPlan ? "Save Changes" : "Create Plan"}</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
