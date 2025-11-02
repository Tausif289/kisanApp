"use client";
import { useContext, useEffect, useState } from "react";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackItem from "@/components/feedback/FeedbackItem";
import EditModal from "@/components/feedback/EditModel";
import { fetchFeedbacks, putFeedback, delFeedback } from "@/lib/api";
import { Feedback } from "@/types/feedback";
import toast from "react-hot-toast";
import { AppContext } from "@/app/context/appcontext";
import { jwtDecode } from "jwt-decode";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

interface TokenPayload {
  id: string;
}

export default function FeedbackPage() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within AppContextProvider");
  }
  const { token, name } = context;

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Feedback | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!token) return;
    try {
      const payload = jwtDecode<TokenPayload>(token);
      setCurrentUserId(payload.id);
    } catch {
      setCurrentUserId(undefined);
    }
  }, [token]);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await fetchFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (newFb: Feedback) => setFeedbacks(prev => [newFb, ...prev]);
  const handleEdit = (fb: Feedback) => setEditing(fb);
  const handleDelete = async (id: string) => {
    if (!token) return toast.error("Login required");
    if (!confirm("Delete this feedback?")) return;
    try {
      await delFeedback(id, token);
      setFeedbacks(prev => prev.filter(f => f._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const submitEdit = async (data: { title?: string; content?: string; improvements?: string[] }) => {
    if (!editing || !token) return;
    try {
      const updated = await putFeedback(editing._id, data, token);
      setFeedbacks(prev => prev.map(f => (f._id === editing._id ? updated : f)));
      setEditing(null);
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ✅ Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
        <DashboardHeader
          title="Farmer Feedback"
          subtitle={`Share and view experiences from fellow farmers, ${name || "Guest"}`}
        />
      </div>

      {/* ✅ Full Width Content */}
      <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-auto w-full">

        {/* ✅ Make Feedback Form Full Width */}
        <div className="w-full">
          <FeedbackForm onAdded={handleAdd} />
        </div>

        {/* ✅ Full-width Feedback List */}
        <div className="w-full mt-6">
          <h3 className="text-lg font-semibold mb-2">All Feedbacks</h3>
          {loading ? (
            <p>Loading...</p>
          ) : feedbacks.length === 0 ? (
            <p>No feedback yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {feedbacks.map(fb => (
                <FeedbackItem
                  key={fb._id}
                  fb={fb}
                  currentUserId={currentUserId}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  refresh={loadFeedbacks}
                />
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editing && (
          <EditModal
            feedback={editing}
            onClose={() => setEditing(null)}
            onSubmit={submitEdit}
          />
        )}
      </main>
    </div>
  );
}
