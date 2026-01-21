{
    'name': 'Book library',
    'version': '1.0',
    'sumarry':'Liburuen maileguak kudeatzeko',
    'description': 'Liburuak sortzea eta kudeatzea ahalbidetzen du modulo hau',
    'author':'Caleb',
    'category': 'Tools',
    'depends':['base'],
    'data': [
            'security/ir.model.access.csv',
            'views/book_library.xml',
            ],
    'installable': True,
    'application':True,
}