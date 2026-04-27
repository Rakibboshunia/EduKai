import React from "react";
import { FiEdit2, FiTrash2, FiMapPin, FiPhone, FiHash, FiLayers, FiUsers } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

const OrganizationTable = ({ data = [], onEdit, onDelete }) => {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border border-blue-50 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-blue-100">
              <th className="px-3 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Organization Name</th>
              
              
              <th className="px-3 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Contact & Gender</th>
              <th className="px-3 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Location & Postcode</th>
              <th className="px-3 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">URN & Phase</th>
              <th className="px-3 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider">Local Authority</th>
              <th className="px-3 py-3 text-[12px] font-bold text-brand-primary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {data.map((org) => (
              <tr key={org.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-brand-primary shrink-0 border border-blue-100">
                       <HiOutlineOfficeBuilding size={18} />
                    </div>
                    <span className="font-bold text-gray-900 text-[14px]">{org.name}</span>
                  </div>
                </td>
                
                
                <td className="px-3 py-3">
                   <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[12px] text-gray-700">
                       <FiPhone className="text-brand-primary" size={13} />
                      <span className="font-medium">{org.telephone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-700">
                       <FiUsers className="text-brand-primary" size={13} />
                      <span className="font-medium">{org.gender || "Mixed"}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-[12px]">{org.town || "N/A"}</span>
                    <span className="text-[11px] text-gray-500 mt-1 leading-relaxed max-w-[180px]">
                      {[org.street, org.address_line_1, org.postcode].filter(Boolean).join(", ")}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[12px] text-gray-700 font-medium">
                       <FiHash className="text-brand-primary" size={13} />
                      <span>{org.urn || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-700 font-medium">
                       <FiLayers className="text-brand-primary" size={13} />
                      <span>{org.phase || "N/A"}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                    <span className="px-2.5 py-1 bg-blue-50 text-brand-primary font-bold tracking-wide text-[11px] rounded-lg border border-blue-100 uppercase">
                     {org.local_authority || "N/A"}
                   </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit && onEdit(org.id)}
                       className="p-2 text-gray-400 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(org.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
        {data.map((org) => (
          <div key={org.id} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{org.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{org.local_authority}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(org.id)} className="p-2 text-blue-600 bg-blue-50 rounded-lg">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => onDelete(org.id)} className="p-2 text-red-600 bg-red-50 rounded-lg">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">URN & Phase</span>
                <p className="text-xs font-semibold text-gray-700">{org.urn}</p>
                <p className="text-[10px] text-gray-500">{org.phase}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact</span>
                <p className="text-xs font-semibold text-gray-700">{org.telephone}</p>
                <p className="text-[10px] text-gray-500">{org.gender}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
                <div className="flex items-start gap-1.5">
                  <FiMapPin className="text-gray-400 mt-0.5 shrink-0" size={12} />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {[org.street, org.address_line_1, org.address_line_2, org.town, org.county, org.postcode].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationTable;
