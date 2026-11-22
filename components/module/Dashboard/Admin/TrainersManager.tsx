"use client";

import React, { useState } from "react";
import {
  useGetTrainersQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  TrainerProfile,
} from "@/redux/api/trainerApi";
import {
  Users,
  Plus,
  Edit2,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  Loader2,
  Sparkles,
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

export default function TrainersManager() {
  const { data: trainersResponse, isLoading, refetch } = useGetTrainersQuery(undefined) as any;
  const trainers: TrainerProfile[] = trainersResponse?.data || [];

  const [createTrainer, { isLoading: isCreating }] = useCreateTrainerMutation();
  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerProfile | null>(null);

  // Form State: New Trainer
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [specialtiesInput, setSpecialtiesInput] = useState("");
  const [certificationsInput, setCertificationsInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setBio("");
    setSpecialtiesInput("");
    setCertificationsInput("");
    setIsPublic(true);
    setSelectedTrainer(null);
  };

  const handleOpenEdit = (trainer: TrainerProfile) => {
    setSelectedTrainer(trainer);
    setBio(trainer.bio || "");
    setSpecialtiesInput((trainer.specialties || []).join(", "));
    setCertificationsInput((trainer.certifications || []).join(", "));
    setIsPublic(trainer.isPublic);
    setEditModalOpen(true);
  };

  const handleCreateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error("Please fill in required fields (Name, Email, Phone, Password)");
      return;
    }

    const specialties = specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const certifications = certificationsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      await createTrainer({
        name,
        email,
        phone,
        password,
        bio,
        specialties,
        certifications,
        isPublic,
      }).unwrap();

      toast.success(`Trainer account for ${name} created successfully`);
      setAddModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create trainer account");
    }
  };

  const handleUpdateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;

    const specialties = specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const certifications = certificationsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      await updateTrainer({
        id: selectedTrainer.userId,
        bio,
        specialties,
        certifications,
        isPublic,
      }).unwrap();

      toast.success(`Trainer profile updated successfully`);
      setEditModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update trainer profile");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xs border border-gray-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Trainers & Coaching Staff Directory</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage fitness coach accounts, assign credentials, and curate public specialties.
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setAddModalOpen(true);
          }}
          size="sm"
          className="gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
        >
          <Plus size={14} />
          <span>Onboard New Trainer</span>
        </Button>
      </div>

      {/* Trainers Cards Grid */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center bg-white rounded-xs border border-gray-200">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xs border border-gray-200 shadow-xs">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-900">No trainers registered yet</p>
          <Button
            onClick={() => {
              resetForm();
              setAddModalOpen(true);
            }}
            size="sm"
            className="mt-3 text-xs"
          >
            Onboard First Coach
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      TRAINER ACCOUNT
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1">
                      {t.user?.name || "Coach"}
                    </h3>
                  </div>
                  <Badge
                    variant={t.isPublic ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {t.isPublic ? "PUBLIC" : "PRIVATE"}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="text-gray-400" />
                    <span>{t.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-gray-400" />
                    <span>{t.user?.phone || "N/A"}</span>
                  </div>
                </div>

                {t.bio && (
                  <p className="text-xs text-gray-600 line-clamp-2 italic mb-3">
                    &quot;{t.bio}&quot;
                  </p>
                )}

                {/* Specialties */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">
                    Specialties
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(t.specialties || []).map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-gray-50 text-gray-700 border border-gray-200 px-1.5 py-0.5 rounded font-mono"
                      >
                        {spec}
                      </span>
                    ))}
                    {(t.specialties || []).length === 0 && (
                      <span className="text-xs text-gray-400 italic">None specified</span>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                {(t.certifications || []).length > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700">
                    <Award size={13} />
                    <span>{t.certifications.length} certifications recorded</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-3 border-t border-gray-100 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(t)}
                  className="h-7 px-2.5 text-xs gap-1 cursor-pointer"
                >
                  <Edit2 size={12} />
                  <span>Edit Profile</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Onboard New Trainer */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900">
              Onboard New Coach
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Create a coach login account and initialize their directory profile.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTrainer} className="space-y-3 text-xs mt-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Coach Tariqul Islam"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tariqul@platinumgym.com"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Phone (Bangladesh) *
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801700000000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Initial Password *
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Specialties (Comma Separated)
              </label>
              <Input
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
                placeholder="Powerlifting, Functional HIIT, Hypertrophy"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Certifications (Comma Separated)
              </label>
              <Input
                value={certificationsInput}
                onChange={(e) => setCertificationsInput(e.target.value)}
                placeholder="CSCS, ACE Certified, CPR/AED"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Professional Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief athletic background..."
                rows={2}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-gray-700">Display in Public Directory</span>
            </label>

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
                disabled={isCreating}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isCreating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Create Trainer Account"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Edit Existing Trainer */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900">
              Edit Trainer Profile: {selectedTrainer?.user?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Update coach bio, certifications, and public visibility.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateTrainer} className="space-y-3 text-xs mt-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Specialties (Comma Separated)
              </label>
              <Input
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
                placeholder="Powerlifting, HIIT"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Certifications (Comma Separated)
              </label>
              <Input
                value={certificationsInput}
                onChange={(e) => setCertificationsInput(e.target.value)}
                placeholder="CSCS, ACE"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Professional Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-gray-700">Display in Public Directory</span>
            </label>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
