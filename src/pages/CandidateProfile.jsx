"use client";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft, Briefcase, Camera, CheckCircle, Clock, Eye,
  Loader2, Mail, MapPin, Phone, Save, Trash2, X, XCircle,
  Zap, User, Tag, Activity, Edit3, FileText, Shield,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { getCandidateById, updateCandidateStatus, deleteCandidate } from "../api/candidateApi";

const qualityOptions = {
  pending: { label: "Pending",        icon: Clock,        className: "bg-amber-100 text-amber-700" },
  passed:  { label: "Quality Passed", icon: CheckCircle,  className: "bg-emerald-100 text-emerald-700" },
  failed:  { label: "Quality Failed", icon: XCircle,      className: "bg-red-100 text-red-700" },
  manual:  { label: "Manual Review",  icon: Eye,          className: "bg-violet-100 text-violet-700" },
};
const availabilityOptions = {
  available:     { label: "Available",     icon: CheckCircle, className: "bg-emerald-100 text-emerald-700" },
  not_available: { label: "Not Available", icon: XCircle,     className: "bg-red-100 text-red-700" },
};

function toArr(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title }) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
      <Icon size={15} className="text-[#2D468A]" />
      <h2 className="text-sm font-bold text-gray-800 tracking-wide">{title}</h2>
    </div>
  );
}

function InfoGrid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 p-6">{children}</div>;
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || "—"}</p>
    </div>
  );
}

function EditField({ label, field, type = "text", form, set }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">{label}</label>
      <input
        type={type}
        value={form[field] || ""}
        onChange={e => set(field, e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D468A]/25 focus:border-[#2D468A] transition bg-gray-50 hover:bg-white"
      />
    </div>
  );
}

function ActionButton({ onClick, disabled, variant = "default", children }) {
  const variants = {
    primary:  "bg-[#2D468A] hover:bg-[#243872] text-white shadow-md hover:shadow-lg",
    indigo:   "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md hover:shadow-lg",
    outline:  "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
    danger:   "border border-red-200 bg-red-50 hover:bg-red-100 text-red-600",
    success:  "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [candidate, setCandidate] = useState(null);
  const [form, setForm]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getCandidateById(id);
        const fullName = res.name || "Unknown";
        const parts = fullName.trim().split(" ");
        const rawSur = res.name_without_surname || "";
        const surname = rawSur ? rawSur.trim().split(" ").pop() : (parts.length > 1 ? parts[parts.length - 1] : "");
        const d = {
          id: res.id,
          name: fullName,
          name_without_surname: surname,
          email: res.email || "",
          phone: res.whatsapp_number || "",
          experience: Number(res.years_of_experience) || 0,
          skills: toArr(res.skills),
          status: res.quality_status || "pending",
          availability: res.availability_status || "not_available",
          photo: res.profile_photo_url || null,
          location: res.location || "",
          job_titles: toArr(res.job_titles),
          bio: res.bio || res.description || "",
          createdAt: res.created_at ? new Date(res.created_at) : null,
          updatedAt: res.updated_at ? new Date(res.updated_at) : null,
          original_cv_url: res.original_cv_url || null,
        };
        setCandidate(d);
        setForm(d);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load candidate");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }));
  const setArr2 = (field, csv) => setForm(p => ({ ...p, [field]: csv.split(",").map(s => s.trim()).filter(Boolean) }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(p => ({ ...p, new_photo_file: file, photo_preview: URL.createObjectURL(file) }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (form.new_photo_file) {
        const fd = new FormData();
        fd.append("profile_photo", form.new_photo_file);
        await updateCandidateStatus(id, fd);
      }
      const payload = {};
      if (form.name !== candidate.name) payload.name = form.name;
      if (form.name_without_surname !== candidate.name_without_surname) payload.name_without_surname = form.name_without_surname?.trim().split(" ").pop() || "";
      if (form.email !== candidate.email) payload.email = form.email;
      if (form.phone !== candidate.phone) payload.whatsapp_number = form.phone;
      if (Number(form.experience) !== Number(candidate.experience)) payload.years_of_experience = form.experience;
      if (form.location !== candidate.location) payload.location = form.location;
      if (form.bio !== candidate.bio) payload.bio = form.bio;
      if (form.skills.join(",") !== candidate.skills.join(",")) payload.skills = form.skills;
      if (form.job_titles.join(",") !== candidate.job_titles.join(",")) payload.job_titles = form.job_titles;
      if (Object.keys(payload).length > 0) await updateCandidateStatus(id, payload);
      const updated = { ...form, photo: form.photo_preview || form.photo, new_photo_file: null, photo_preview: null };
      setCandidate(updated);
      setForm(updated);
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCandidate(id);
      toast.success("Candidate deleted");
      navigate("/cv/queue");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
      setConfirmDel(false);
    }
  };

  const handleQuality = async (val) => {
    try {
      await updateCandidateStatus(id, { quality_status: val });
      setCandidate(p => ({ ...p, status: val }));
      setForm(p => ({ ...p, status: val }));
      toast.success("Status updated!");
    } catch { toast.error("Failed"); }
  };

  const handleAvail = async (val) => {
    try {
      await updateCandidateStatus(id, { availability_status: val });
      setCandidate(p => ({ ...p, availability: val }));
      setForm(p => ({ ...p, availability: val }));
      toast.success("Availability updated!");
    } catch { toast.error("Failed"); }
  };

  const handleViewCV = async () => {
    try {
      const res = await getCandidateById(id);
      if (!res.original_cv_url) { toast.error("CV not available"); return; }
      window.open(res.original_cv_url, "_blank");
    } catch { toast.error("Failed to open CV"); }
  };

  const fmtDate = (d) => d
    ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "N/A";

  const expLabel = (yrs) => {
    if (yrs <= 1) return "Junior";
    if (yrs <= 3) return "Mid-Level";
    if (yrs <= 6) return "Senior";
    return "Expert";
  };

  const activity = form ? [
    form.availability === "available" && {
      icon: Mail, bg: "bg-blue-50", border: "border-blue-100", iconColor: "text-blue-500",
      label: "Availability mail sent", date: fmtDate(form.updatedAt || form.createdAt),
    },
    form.status === "passed" && {
      icon: CheckCircle, bg: "bg-emerald-50", border: "border-emerald-100", iconColor: "text-emerald-500",
      label: "Quality check passed", date: fmtDate(form.updatedAt || form.createdAt),
    },
    form.status === "failed" && {
      icon: XCircle, bg: "bg-red-50", border: "border-red-100", iconColor: "text-red-500",
      label: "Quality check failed", date: fmtDate(form.updatedAt || form.createdAt),
    },
    form.createdAt && {
      icon: Activity, bg: "bg-gray-50", border: "border-gray-100", iconColor: "text-gray-400",
      label: "Candidate profile created", date: fmtDate(form.createdAt),
    },
  ].filter(Boolean) : [];

  const currentPhoto = form?.photo_preview || form?.photo;

  /* ── Loading / Error ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D468A]" />
      <p className="text-gray-500 font-medium text-sm">Loading candidate profile…</p>
    </div>
  );
  if (!form) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <XCircle size={48} className="text-red-400" />
      <p className="text-gray-600 font-semibold">Candidate not found.</p>
      <button onClick={() => navigate("/cv/queue")} className="px-5 py-2 rounded-xl bg-[#2D468A] text-white text-sm font-bold">← Back to Queue</button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto space-y-5 pb-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/cv/queue")}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-[#2D468A] hover:border-blue-200 transition-all shadow-sm"
        >
          <ArrowLeft size={14} /> CV Queue
        </button>
        <span className="text-gray-300 text-sm">/</span>
        <span className="text-sm text-gray-500 font-medium truncate max-w-xs">{form.name}</span>
      </div>

      {/* ── Hero Card ── */}
      <Card>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">

            {/* Avatar */}
            <div
              className={`relative flex-shrink-0 ${editing ? "group cursor-pointer" : ""}`}
              onClick={() => editing && fileInputRef.current?.click()}
            >
              {currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt={form.name}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-[#2D468A]/10 shadow-md ${editing ? "group-hover:opacity-70 transition-opacity" : ""}`}
                />
              ) : (
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#2D468A] to-indigo-400 text-white text-3xl font-black flex items-center justify-center shadow-md ${editing ? "group-hover:opacity-70 transition-opacity" : ""}`}>
                  {form.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              {editing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              )}
              {form.availability === "available" && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow" />
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>

            {/* Name / titles */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-2">
                  <input value={form.name} onChange={e => set("name", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2D468A]/25 focus:border-[#2D468A] bg-gray-50"
                    placeholder="Full name" />
                  <input value={form.name_without_surname || ""} onChange={e => set("name_without_surname", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2D468A]/25 focus:border-[#2D468A] bg-gray-50"
                    placeholder="Name without surname" />
                  <input value={form.job_titles.join(", ")} onChange={e => setArr2("job_titles", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2D468A]/25 focus:border-[#2D468A] bg-gray-50"
                    placeholder="Job titles (comma separated)" />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900">{form.name}</h1>
                    <StatusBadge value={form.status} options={qualityOptions} onChange={handleQuality} />
                    <StatusBadge value={form.availability} options={availabilityOptions} onChange={handleAvail} />
                  </div>
                  {form.job_titles.length > 0 && (
                    <p className="text-[#2D468A] font-semibold text-sm mb-2">{form.job_titles.join(", ")}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    {form.location && <span className="flex items-center gap-1.5"><MapPin size={12} className="text-gray-400" />{form.location}</span>}
                    <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-gray-400" />{form.experience}+ Years Experience</span>
                    {form.email && <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400" />{form.email}</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left (2/3) */}
        <div className="lg:col-span-2 space-y-5">

          {/* Personal Information */}
          <Card>
            <CardHeader icon={User} title="Personal Information" />
            {editing ? (
              <InfoGrid>
                <EditField label="Email Address"       field="email"      type="email"  form={form} set={set} />
                <EditField label="Phone Number"        field="phone"      type="tel"    form={form} set={set} />
                <EditField label="Location"            field="location"   type="text"   form={form} set={set} />
                <EditField label="Years of Experience" field="experience" type="number" form={form} set={set} />
              </InfoGrid>
            ) : (
              <InfoGrid>
                <InfoItem label="Email Address"  value={form.email} />
                <InfoItem label="Phone Number"   value={form.phone} />
                <InfoItem label="Total Experience" value={`${form.experience} Year${form.experience !== 1 ? "s" : ""}`} />
                {form.bio && (
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bio</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{form.bio}</p>
                  </div>
                )}
              </InfoGrid>
            )}
            {editing && (
              <div className="px-6 pb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Bio</label>
                <textarea
                  value={form.bio || ""}
                  onChange={e => set("bio", e.target.value)}
                  rows={3}
                  placeholder="Write a short bio…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D468A]/25 focus:border-[#2D468A] transition bg-gray-50 hover:bg-white resize-none"
                />
              </div>
            )}
          </Card>

          {/* Technical Expertise */}
          <Card>
            <CardHeader icon={Tag} title="Technical Expertise" />
            <div className="p-6">
              {editing ? (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Skills (comma separated)</label>
                  <input
                    value={form.skills.join(", ")}
                    onChange={e => setArr2("skills", e.target.value)}
                    placeholder="e.g. React, Node.js, Python"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D468A]/25 focus:border-[#2D468A] transition bg-gray-50"
                  />
                </div>
              ) : form.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-blue-50 hover:text-[#2D468A] hover:border-blue-200 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No skills listed.</p>
              )}
            </div>
          </Card>

          {/* Activity & Tracking */}
          <Card>
            <CardHeader icon={Activity} title="Activity & Tracking" />
            <div className="p-6">
              {activity.length > 0 ? (
                <div className="space-y-3">
                  {activity.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${item.bg} ${item.border}`}>
                        <div className={`mt-0.5 flex-shrink-0 ${item.iconColor}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">on {item.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No activity recorded yet.</p>
              )}
            </div>
          </Card>

        </div>

        {/* Right (1/3) */}
        <div className="space-y-5">

          {/* Actions */}
          <Card>
            <CardHeader icon={Shield} title="Actions" />
            <div className="p-4 space-y-2.5">
              {editing ? (
                <>
                  <ActionButton onClick={handleSave} disabled={saving} variant="success">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? "Saving…" : "Save Changes"}
                  </ActionButton>
                  <ActionButton onClick={() => { setForm(candidate); setEditing(false); }} variant="outline">
                    <X size={14} /> Cancel
                  </ActionButton>
                </>
              ) : (
                <>
                  <ActionButton onClick={() => setEditing(true)} variant="primary">
                    <Edit3 size={14} /> Edit Profile
                  </ActionButton>
                  {form.status === "passed" && (
                    <ActionButton onClick={() => navigate("/ai/re-writer", { state: { candidate } })} variant="indigo">
                      <FileText size={14} /> Generate CV
                    </ActionButton>
                  )}
                  <ActionButton onClick={handleViewCV} variant="outline">
                    <Eye size={14} /> View CV
                  </ActionButton>
                  {confirmDel ? (
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleDelete} disabled={deleting}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition disabled:opacity-50">
                        {deleting ? "…" : "Yes, Delete"}
                      </button>
                      <button onClick={() => setConfirmDel(false)}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-bold hover:bg-gray-50 transition">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <ActionButton onClick={() => setConfirmDel(true)} variant="danger">
                      <Trash2 size={14} /> Delete Candidate
                    </ActionButton>
                  )}
                </>
              )}
            </div>

            {/* Last modified */}
            {(form.updatedAt || form.createdAt) && (
              <div className="mx-4 mb-4 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Last Modified</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#2D468A]/10 flex items-center justify-center flex-shrink-0">
                    <User size={11} className="text-[#2D468A]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Modified by Admin</p>
                    <p className="text-[11px] text-gray-400">{fmtDate(form.updatedAt || form.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          <Card>
            <div className="p-5 space-y-1">
              {[
                { label: "Experience",  val: `${form.experience} yr${form.experience !== 1 ? "s" : ""}` },
                { label: "Level",       val: expLabel(form.experience) },
                { label: "Skills",      val: form.skills.length },
                { label: "Job Titles",  val: form.job_titles.length },
                { label: "Added",       val: fmtDate(form.createdAt) },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                  <span className="text-sm font-bold text-gray-800">{val}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
