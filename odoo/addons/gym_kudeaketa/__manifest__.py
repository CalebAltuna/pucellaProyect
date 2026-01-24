{
    'name': 'Book library',
    'version': '1.0',
    'sumarry':'Gym kudeaketa sistema',
    'description': 'Gym kudeaketa sistema',
    'author':'Caleb',
    'category': 'Tools',
    'depends':['base'],
    'data': [
            'security/ir.model.access.csv',
            # groups badaude xml-a inportatu egin behar da
            'security/groups.xml',
            # ordena eragina du.
            'views/gym_kudeaketa.xml',
            ],
    'installable': True,
    'application':True,
}