import React from 'react';

interface Gastuak {
    id: number;
    izena: string;
    deskribapena: string;
    user_erosle_id: number | [number, string];
    user_partaide_id: number | [number, string];
    totala: number;
}

interface ErakutsiProps {
    gastuak: Gastuak[];
}

export default function Erakutsi({ gastuak }: ErakutsiProps) {
    // Odoo-ren Many2one formatua kudeatu: [id, izena] edo ID soila
    const formatuIzena = (userData: number | [number, string]) => {
        if (Array.isArray(userData)) return userData[1];
        return `ID: ${userData}`;
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Gastuen Zerrenda</h2>

            {gastuak.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Ez dago gasturik erakusteko.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kontzeptua
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Eroslea
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Partaidea
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guztira
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {gastuak.map((gastu) => (
                                <tr key={gastu.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="font-medium text-gray-900">{gastu.izena}</div>
                                        <div className="text-gray-400 text-xs">{gastu.deskribapena}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatuIzena(gastu.user_erosle_id)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatuIzena(gastu.user_partaide_id)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        {gastu.totala.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
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