import React from 'react';

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
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Pisuen Taldeak
            </h2>

            {pisuak.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                    Ez dago pisurik erakusteko.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pisuak.map((pisua) => (
                        <div
                            key={pisua.id}
                            className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-gray-50"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {pisua.name}
                            </h3>

                            <p className="text-sm text-gray-600 mb-3">
                                Kodea:
                                <span className="ml-2 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    {pisua.code}
                                </span>
                            </p>

                            <p className="text-sm text-gray-600">
                                Koordinatzailea:
                                <span className="ml-2 font-medium text-gray-800">
                                    {Array.isArray(pisua.coordinator_id)
                                        ? pisua.coordinator_id[1]
                                        : <span className="italic text-gray-400">Esleitu gabe</span>}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
