// src/components/admin/CustomRequestsTable.ts
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { CustomRequest } from '../../../types';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { toast } from 'react-toastify';

interface CustomRequestsTableProps {
  customRequests: CustomRequest[];
}

const CustomRequestsTable: React.FC<CustomRequestsTableProps> = ({
  customRequests,
}) => {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomRequests, setFilteredCustomRequests] = useState(
    customRequests
  );

  useEffect(() => {
    const filteredRequests = customRequests.filter((request) =>
      request.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomRequests(filteredRequests);
  }, [searchTerm, customRequests]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleQuoteDispatch = async (requestId: number) => {
    try {
      const response = await fetch(`/api/ai/quote-dispatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });

      if (response.ok) {
        toast.success('Quote dispatched successfully!');
      } else {
        toast.error('Error dispatching quote. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error dispatching quote. Please try again.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">Custom Requests</h2>
        <div className="flex items-center">
          <AiOutlineSearch size={20} className="mr-2" />
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by buyer name"
            className="py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 w-64"
          />
        </div>
      </div>
      <table className="w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Buyer Name</th>
            <th className="px-4 py-2 text-left">Request Description</th>
            <th className="px-4 py-2 text-left">Quote Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomRequests.map((request) => (
            <tr key={request.id}>
              <td className="px-4 py-2">{request.buyerName}</td>
              <td className="px-4 py-2">{request.requestDescription}</td>
              <td className="px-4 py-2">
                {request.quoteStatus === 'pending' ? (
                  <span className="text-yellow-500">Pending</span>
                ) : request.quoteStatus === 'dispatched' ? (
                  <span className="text-green-500">Dispatched</span>
                ) : (
                  <span className="text-red-500">Error</span>
                )}
              </td>
              <td className="px-4 py-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={() => handleQuoteDispatch(request.id)}
                >
                  Dispatch Quote
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomRequestsTable;