import React from "react";
import { FiEdit2, FiTrash2, FiMapPin, FiPhone, FiHash, FiLayers, FiUsers } from "react-icons/fi";

const OrganizationTable = ({ data = [], onEdit, onDelete }) => {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border border-blue-50 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-blue-100">
              <th className="px-4 py-4 text-[12px] font-bold text-[#2D468A] uppercase tracking-wider">Name & Local Authority</th>
              <th className="px-4 py-4 text-[12px] font-bold text-[#2D468A] uppercase tracking-wider">URN & Phase</th>
              <th className="px-4 py-4 text-[12px] font-bold text-[#2D468A] uppercase tracking-wider">Contact & Gender</th>
              <th className="px-4 py-4 text-[12px] font-bold text-[#2D468A] uppercase tracking-wider">Location & Postcode</th>
              <th className="px-4 py-4 text-[12px] font-bold text-[#2D468A] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {data.map((org) => (
              <tr key={org.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-base">{org.name}</span>
                    <span className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                       <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">{org.local_authority || "N/A"}</span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <FiHash className="text-blue-400" size={12} />
                      <span className="font-medium">{org.urn || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <FiLayers className="text-blue-400" size={12} />
                      <span className="font-medium">{org.phase || "N/A"}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                   <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <FiPhone className="text-blue-400" size={12} />
                      <span>{org.telephone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <FiUsers className="text-blue-400" size={12} />
                      <span>{org.gender || "Mixed"}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{org.town || "N/A"}</span>
                    <span className="text-[11px] text-gray-400 truncate max-w-[150px]">
                      {[org.street, org.address_line_1, org.postcode].filter(Boolean).join(", ")}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit && onEdit(org.id)}
                      className="p-2 text-gray-400 hover:text-[#2D468A] hover:bg-blue-50 rounded-lg transition-all"
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
