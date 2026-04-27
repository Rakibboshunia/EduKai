import React from "react";
import { FiEdit2, FiTrash2, FiMail, FiPhone, FiBriefcase, FiMapPin } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

const ContactTable = ({ data = [], onEdit, onDelete }) => {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border border-blue-50 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-blue-100">
              <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Contact Person & Mail</th>
              
              <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Organization Name</th>
              <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Job Title</th>
              <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Local Authority</th>
              <th className="px-4 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {data.map((contact) => (
              <tr key={contact.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-[14px]">{contact.contact_person || contact.name}</span>
                    <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                      <FiMail size={13} className="text-brand-primary" />
                      <span className="text-[12px] font-medium">{contact.work_email || contact.email || "No email"}</span>
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-gray-800">
                      <HiOutlineOfficeBuilding className="text-brand-primary" size={16} />
                      <span>{contact.organization_name || contact.organization?.name || "N/A"}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[12px] text-gray-700 font-bold">
                      <FiBriefcase className="text-brand-primary" size={14} />
                      <span>{contact.job_title || "N/A"}</span>
                    </div>
                    {contact.whatsapp_number && (
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                        <FiPhone className="text-brand-primary" size={12} />
                        <span>{contact.whatsapp_number}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                   <span className="px-2.5 py-1 bg-blue-50 text-brand-primary font-bold tracking-wide text-[11px] rounded-lg border border-blue-100 uppercase">
                     {contact.local_authority || contact.organization?.local_authority || "N/A"}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 transition-opacity">
                    <button
                      onClick={() => onEdit && onEdit(contact.id)}
                      className="p-2 text-gray-400 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(contact.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {data.map((contact) => (
          <div key={contact.id} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg truncate">{contact.contact_person || contact.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-blue-600">
                   <FiMail size={12} />
                   <span className="text-xs font-medium truncate">{contact.email}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => onEdit(contact.id)} className="p-2 text-blue-600 bg-blue-50 rounded-lg">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => onDelete(contact.id)} className="p-2 text-red-600 bg-red-50 rounded-lg">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-50">
               <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                 <HiOutlineOfficeBuilding className="text-blue-500 mt-1 shrink-0" size={20} />
                 <div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Organization</span>
                   <p className="text-sm font-bold text-gray-800">{contact.organization_name || contact.organization?.name || "N/A"}</p>
                   <p className="text-xs text-gray-500 mt-0.5">{contact.local_authority || contact.organization?.local_authority || "N/A"}</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                 <FiBriefcase className="text-blue-500 mt-1 shrink-0" size={18} />
                 <div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Job Title</span>
                   <p className="text-sm font-bold text-gray-800">{contact.job_title || "N/A"}</p>
                 </div>
               </div>

               {contact.whatsapp_number && (
                  <div className="flex items-center gap-2 px-3 text-sm font-medium text-gray-600">
                    <FiPhone className="text-green-500" size={14} />
                    <span>{contact.whatsapp_number}</span>
                  </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactTable;
