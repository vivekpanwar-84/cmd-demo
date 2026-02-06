// "use client";

// import React, { useState } from 'react';
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import { cn } from "@/components/ui/utils";

// const ALL_PERMISSIONS = [
//     "View Organization",
//     "Create Organization",
//     "View Staff",
//     "Create Staff",
//     "View Customer",
//     "Create Customer",
//     "Delete Customer",
//     "Update Staff",
//     "Delete Staff",
//     "Update Organization",
//     "Delete Organization",
//     "Update Customer",
//     "View Invoices"
// ];

// type Role = 'Admin' | 'Admin Staff' | 'Manager';

// export default function Permissions() {
//     const [selectedRole, setSelectedRole] = useState<Role | null>('Admin');
//     const [rolePermissions, setRolePermissions] = useState<Record<Role, string[]>>({
//         Admin: [...ALL_PERMISSIONS],
//         "Admin Staff": ["View Staff", "View Customer", "Create Customer", "Delete Customer", "Update Customer", "View Invoices"],
//         Manager: [...ALL_PERMISSIONS]
//     });

//     const togglePermission = (permission: string) => {
//         if (!selectedRole) return;
//         setRolePermissions(prev => {
//             const current = prev[selectedRole];
//             if (current.includes(permission)) {
//                 return { ...prev, [selectedRole]: current.filter(p => p !== permission) };
//             } else {
//                 return { ...prev, [selectedRole]: [...current, permission] };
//             }
//         });
//     };

//     const handleSave = () => {
//         console.log("Saving permissions for", selectedRole, rolePermissions[selectedRole!]);
//         // setSelectedRole(null); // Optional: close panel after save
//     };

//     return (
//         <div className="flex items-start justify-start p-0 bg-gray-50/50 min-h-full">
//             <div className="bg-white rounded-xl border shadow-sm flex overflow-hidden w-full max-w-[950px] min-h-[600px]">
//                 {/* Left Sidebar */}
//                 <div className="w-[280px] border-r bg-[#fafafa] p-0 flex flex-col">
//                     <div className="p-6 border-b bg-white">
//                         <h2 className="text-xl font-semibold text-gray-800">Permissions</h2>
//                     </div>

//                     <div className="flex-1 p-4 space-y-2 mt-2">
//                         <button
//                             onClick={() => setSelectedRole('Admin')}
//                             className={cn(
//                                 "w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all text-sm",
//                                 selectedRole === 'Admin'
//                                     ? "bg-primary text-white shadow-sm"
//                                     : "text-gray-600 hover:bg-gray-100"
//                             )}
//                         >
//                             Admin
//                         </button>
//                         <button
//                             onClick={() => setSelectedRole('Admin Staff')}
//                             className={cn(
//                                 "w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all text-sm",
//                                 selectedRole === 'Admin Staff'
//                                     ? "bg-primary text-white shadow-sm"
//                                     : "text-gray-600 hover:bg-gray-100"
//                             )}
//                         >
//                             Admin Staff
//                         </button>
//                         <button
//                             onClick={() => setSelectedRole('Manager')}
//                             className={cn(
//                                 "w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all text-sm",
//                                 selectedRole === 'Manager'
//                                     ? "bg-primary text-white shadow-sm"
//                                     : "text-gray-600 hover:bg-gray-100"
//                             )}
//                         >
//                             Manager
//                         </button>
//                     </div>
//                 </div>

//                 {/* Right Panel */}
//                 <div className="flex-1 flex flex-col bg-white">
//                     {selectedRole ? (
//                         <>
//                             <div className="p-6 border-b flex justify-between items-start">
//                                 <div>
//                                     <h3 className="text-xl font-bold text-gray-800">{selectedRole} Permissions</h3>
//                                     <p className="text-sm text-gray-500 mt-1 font-medium">Manage permissions for the {selectedRole.toLowerCase()} role</p>
//                                 </div>
//                                 <button
//                                     onClick={() => setSelectedRole(null)}
//                                     className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//                                 >
//                                     <X className="w-5 h-5 text-gray-400" />
//                                 </button>
//                             </div>

//                             <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
//                                 <div className="space-y-4">
//                                     {ALL_PERMISSIONS.map((permission) => (
//                                         <div key={permission} className="flex items-center group cursor-pointer" onClick={() => togglePermission(permission)}>
//                                             <Checkbox
//                                                 id={`${selectedRole}-${permission}`}
//                                                 checked={rolePermissions[selectedRole].includes(permission)}
//                                                 onCheckedChange={() => togglePermission(permission)}
//                                                 className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
//                                             />
//                                             <label
//                                                 htmlFor={`${selectedRole}-${permission}`}
//                                                 className="text-sm font-medium leading-none ml-4 cursor-pointer text-gray-700 group-hover:text-gray-900 transition-colors"
//                                                 onClick={(e) => e.stopPropagation()}
//                                             >
//                                                 {permission}
//                                             </label>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="p-6 border-t flex justify-end bg-white">
//                                 <Button
//                                     onClick={handleSave}
//                                     className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-lg font-semibold shadow-sm transition-all active:scale-95"
//                                 >
//                                     Save
//                                 </Button>
//                             </div>
//                         </>
//                     ) : (
//                         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
//                             <div className="p-4 bg-gray-50 rounded-full">
//                                 <X className="w-8 h-8 text-gray-300" />
//                             </div>
//                             <p className="text-gray-500 font-medium">Select a role from the sidebar to manage permissions.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
"use client";

import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { toast } from "sonner";

const ALL_PERMISSIONS = [
    "View Organization",
    "Create Organization",
    "View Staff",
    "Create Staff",
    "View Customer",
    "Create Customer",
    "Delete Customer",
    "Update Staff",
    "Delete Staff",
    "Update Organization",
    "Delete Organization",
    "Update Customer",
    "View Invoices"
];

type Role = 'Admin Staff' | 'Manager';

export default function Permissions() {
    const [selectedRole, setSelectedRole] = useState<Role | null>('Admin Staff');

    const [rolePermissions, setRolePermissions] = useState<Record<Role, string[]>>({
        "Admin Staff": [
            "View Staff",
            "View Customer",
            "Create Customer",
            "Delete Customer",
            "Update Customer",
            "View Invoices"
        ],
        Manager: [...ALL_PERMISSIONS]
    });

    const togglePermission = (permission: string) => {
        if (!selectedRole) return;

        setRolePermissions(prev => {
            const current = prev[selectedRole];
            return {
                ...prev,
                [selectedRole]: current.includes(permission)
                    ? current.filter(p => p !== permission)
                    : [...current, permission]
            };
        });
    };

    const handleSave = () => {
        console.log("Saving permissions for", selectedRole, rolePermissions[selectedRole!]);
        toast.success(`Permissions for ${selectedRole} saved successfully`);
    };

    return (
        <div className="flex items-start justify-start p-0 bg-gray-50/50 min-h-full">
            <div className="bg-white rounded-xl border shadow-sm flex overflow-hidden w-full max-w-[950px] min-h-[600px]">

                {/* Left Sidebar */}
                <div className="w-[280px] border-r bg-[#fafafa] flex flex-col">
                    <div className="p-6 border-b bg-white">
                        <h2 className="text-xl font-semibold text-gray-800">Permissions</h2>
                    </div>

                    <div className="flex-1 p-4 space-y-2 mt-2">
                        <button
                            onClick={() => setSelectedRole('Admin Staff')}
                            className={cn(
                                "w-full px-4 py-3 rounded-lg font-medium text-sm transition-all",
                                selectedRole === 'Admin Staff'
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            Admin Staff
                        </button>

                        <button
                            onClick={() => setSelectedRole('Manager')}
                            className={cn(
                                "w-full px-4 py-3 rounded-lg font-medium text-sm transition-all",
                                selectedRole === 'Manager'
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            Manager
                        </button>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedRole ? (
                        <>
                            <div className="p-6 border-b flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {selectedRole} Permissions
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">
                                        Manage permissions for the {selectedRole.toLowerCase()} role
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedRole(null)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-4">
                                    {ALL_PERMISSIONS.map(permission => (
                                        <div
                                            key={permission}
                                            className="flex items-center cursor-pointer"
                                            onClick={() => togglePermission(permission)}
                                        >
                                            <Checkbox
                                                checked={rolePermissions[selectedRole].includes(permission)}
                                                onCheckedChange={() => togglePermission(permission)}
                                            />
                                            <span className="ml-4 text-sm font-medium text-gray-700">
                                                {permission}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 border-t flex justify-end">
                                <Button className="px-10 py-5" onClick={handleSave}>
                                    Save
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a role to manage permissions
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
