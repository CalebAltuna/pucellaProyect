
{
    'name': 'Gastos Pisos',
    'depends': ['base', 'hr_expense', 'pisua'], # <--- IMPORTANTE: 'pisua' debe estar aquí
    'data': [
        'views/expense_view_inherit.xml',
    ],
}