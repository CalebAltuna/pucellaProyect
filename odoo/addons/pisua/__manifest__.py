{
    'name': 'Pisua',
    'version': '1.0',
    'category': 'Custom',
    'summary': 'Gestiona pisos',
    'depends': ['base'], 
    'data': [
        'security/groups.xml',
        'security/ir.model.access.csv', 
        'views/pisua_views.xml',
    ],
    'installable': True,
    'application': True,
}