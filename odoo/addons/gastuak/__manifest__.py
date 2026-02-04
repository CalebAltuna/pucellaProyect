# __manifest__.py
{
    'name': 'Extensión de Gastos Personalizada',
    'version': '1.0',
    'category': 'Human Resources/Expenses',
    'summary': 'Añade campos personalizados para nueva factura/gasto',
    'author': 'Tu Nombre',
    'depends': ['hr_expense'],  # Importante: Heredamos de Gastos
    'data': [
        'views/expense_view_inherit.xml',
    ],
    'installable': True,
    'application': False,
}