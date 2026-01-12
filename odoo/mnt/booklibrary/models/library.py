from odoo import models, fields

class Library(models.Model):
    _name = 'library.book'
    _description = 'Library Book'
    
    title = fields.Char(string='Titulua', required=True)
    author = fields.Char(string='Egilea', required=True)
    published_date = fields.Date(string='Argitaratze data')
    available = fields.Boolean(string='Eskuragarri', default=True)