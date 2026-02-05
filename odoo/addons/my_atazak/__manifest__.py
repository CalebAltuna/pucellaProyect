{
    'name': 'facturas',
    'version': '1.0',
    'sumarry':'gestion de facturas',
    'description': 'modulo de gestion de facturas',
    'author':'Pucella',
    'category': 'Tools',
    'depends':['base'],
    'data': [
            'security/ir.model.access.csv',
            'views/book_library.xml',
            ],
    'installable': True,
    'application':True,
}