{
    'name': 'Task Tracker',
    'version': '1.0',
    'sumarry':'Atazen jarraipenarako modu sinplea',
    'description': 'Atazak sortzea ahalbidetzen du, izena eta egoerarekin',
    'author':'Caleb',
    'category': 'Tools',
    'depends':['base'],
    'data': [
            'security/ir.model.access.csv',
            'views/task_views.xml',
            ],
    'installable': True,
    'application':True,
}