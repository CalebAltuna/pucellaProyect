{
    'name': 'Gym Kudeaketa',
    'version': '1.0',
    'summary':'Gym kudeaketa sistema',
    'description': 'Gym kudeaketa sistema',
    'author':'Caleb',
    'category': 'Tools',
    'depends':['base'],
    'data': [
            # groups badaude xml-a inportatu egin behar da
            'security/groups.xml',
            'security/ir.model.access.csv',
            # ordena eragina du.
            'views/gym_bazkideak_views.xml',
            ],
    'installable': True,
    'application':True,
}