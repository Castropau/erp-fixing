import React from "react";
import { ChequeLists } from "@/api/cheque-request/fetchCheque";
import PersonalInformation from "../Modal/PersonalInformation";
import ModuleAccess from "../Modal/ModuleAccess";
interface User {
  id: number; // id as an integer
  full_name: string; // full_name as a string
  department: string; // department as a string
  role: string;
  is_active: boolean;
  is_superuser: boolean;
}

type TableUsersProps = {
  data: User[];
};

const TableUsers: React.FC<TableUsersProps> = ({ data }) => {
  return (
    <div className="overflow-auto border border-gray-700 rounded-lg shadow-sm">
      <table className="min-w-full text-sm bg-white">
        <thead className="bg-gray-700 text-white dark:bg-gray-950">
          <tr>
            <th className="px-4 py-3 text-left">Full Name</th>
            <th className="px-4 py-3 text-left">Department</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Active</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center text-gray-500 py-4 dark:bg-gray-dark dark:text-white"
              >
                No records found
              </td>
            </tr>
          ) : (
            data?.map((user, index) => (
              <tr
                key={user.id}
                className={`transition-colors duration-300 ease-in-out
       ${
         index % 2 === 0
           ? "bg-gray-50 dark:bg-gray-600"
           : "bg-white dark:bg-gray-700"
       }
       text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-400`}
              >
                <td className="px-4 py-2">{user.full_name}</td>
                <td className="px-4 py-2">{user.department}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`${
                      user.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    } py-1 px-3 rounded-full`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="inline-flex gap-2 items-center justify-center">
                    <PersonalInformation id={user.id} />
                    <ModuleAccess />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableUsers;
