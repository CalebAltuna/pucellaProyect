{
    'name': 'Piso y Zereginak',
    'version': '1.0',
    'category': 'Custom',
    'summary': 'Gestiona pisos y tareas asociadas',
    'depends': ['base'], 
    'data': [
        'security/security.xml',           
        'security/ir.model.access.csv',    
        'views/pisua_views.xml',
    ],
    'installable': True,
    'application': False,
}