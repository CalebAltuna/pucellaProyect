import React from 'react';
import { Link } from '@inertiajs/react';

interface Pisua {
    id: number;
    name: string;
    code: string;
    coordinator_id?: [number, string] | null;
}

interface ErakutsiProps {
    pisuak: Pisua[];
}

export default function Erakutsi({ pisuak }: ErakutsiProps) {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-[#534595]">Pisuen Zerrenda</h2>

            {pisuak.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Ez dago pisurik erakusteko.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Izena</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kodea</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Koordinatzailea</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pisuak.map((pisua) => (
                                <tr key={pisua.id} className="hover:bg-purple-50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <Link 
                                            href={`/pisua/${pisua.id}`} 
                                            className="text-[#534595] group-hover:underline"
                                        >
                                            {pisua.name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                                            {pisua.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {Array.isArray(pisua.coordinator_id)
                                            ? pisua.coordinator_id[1]
                                            : <span className="text-gray-400 italic">Esleitu gabe</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}