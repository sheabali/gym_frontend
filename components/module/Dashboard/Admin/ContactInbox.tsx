"use client";

import React, { useState } from "react";
import {
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  ContactInquiry,
} from "@/redux/api/contactApi";
import {
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Archive,
  Inbox,
  Loader2,
  Send,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ContactInbox() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | "NEW" | "REPLIED" | "CLOSED">("ALL");
  const [selectedMessage, setSelectedMessage] = useState<ContactInquiry | null>(null);

  const { data: contactsResponse, isLoading, refetch } = useGetContactsQuery(
    statusFilter === "ALL" ? undefined : { status: statusFilter }
  ) as any;
  const messages: ContactInquiry[] = contactsResponse?.data || [];

  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactStatusMutation();

  const handleStatusChange = async (
    id: string,
    newStatus: "NEW" | "REPLIED" | "CLOSED"
  ) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Inquiry status updated to ${newStatus}`);
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update inquiry status");
    }
  };

  const newCount = messages.filter((m) => m.status === "NEW").length;

  return (
    <div className="space-y-4 text-white">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e0e12] p-4 rounded-xs border border-white/[0.08] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#22c55e]/10 text-[#22c55e] rounded-xs border border-[#22c55e]/30">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight">
              Visitor Inquiries & Trials
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Submissions received from the public website contact terminal.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center p-0.5 bg-[#121216] rounded-xs border border-white/[0.08] text-xs font-mono">
          {(["ALL", "NEW", "REPLIED", "CLOSED"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setStatusFilter(filter);
                setSelectedMessage(null);
              }}
              className={`px-3 py-1 rounded-xs transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
                statusFilter === filter
                  ? "bg-[#22c55e] !text-black font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {filter}
              {filter === "NEW" && newCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-bold">
                  {newCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inbox Layout: Master / Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="lg:col-span-1 bg-[#0e0e12] rounded-xs border border-white/[0.08] shadow-lg overflow-hidden">
          <div className="p-3 border-b border-white/[0.06] text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
            Inquiries ({messages.length})
          </div>

          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#22c55e]" />
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 font-mono">
              No inquiries found in this view.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05] max-h-[600px] overflow-y-auto">
              {messages.map((item) => {
                const isSelected = selectedMessage?.id === item.id;
                const isNew = item.status === "NEW";

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMessage(item)}
                    className={`p-3.5 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-white/[0.06] border-l-3 border-[#22c55e]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${isNew ? "font-bold text-white" : "font-medium text-zinc-300"}`}>
                        {item.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          item.status === "NEW"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                            : item.status === "REPLIED"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            : "bg-white/[0.04] text-zinc-400 border border-white/[0.08]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2">
                      {item.message}
                    </p>

                    <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-2 bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg h-fit text-white">
          {selectedMessage ? (
            <div className="space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    {selectedMessage.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-zinc-400 font-mono">
                    {selectedMessage.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-zinc-500" />
                        <span>{selectedMessage.email}</span>
                      </span>
                    )}
                    {selectedMessage.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-400" />
                        <span>{selectedMessage.phone}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="flex items-center gap-2">
                  {selectedMessage.status !== "REPLIED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(selectedMessage.id, "REPLIED")}
                      className="h-7 text-[11px] gap-1 text-blue-700 hover:bg-blue-50 border-blue-200 cursor-pointer"
                    >
                      <CheckCircle2 size={12} />
                      <span>Mark Replied</span>
                    </Button>
                  )}

                  {selectedMessage.status !== "CLOSED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(selectedMessage.id, "CLOSED")}
                      className="h-7 text-[11px] gap-1 text-gray-700 hover:bg-gray-100 border-gray-200 cursor-pointer"
                    >
                      <Archive size={12} />
                      <span>Close Ticket</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-gray-50/60 p-5 rounded-xs border border-gray-100 space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
                  Original Message Body
                </span>
                <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-gray-400 font-mono">
                Received timestamp:{" "}
                {new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                  timeZone: "Asia/Dhaka",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}{" "}
                (Asia/Dhaka)
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-gray-400 space-y-2">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs font-semibold text-gray-700">
                Select an inquiry from the list to view full communication details
              </p>
              <p className="text-[11px] text-gray-400">
                You can reply via direct phone/email or update ticket status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
