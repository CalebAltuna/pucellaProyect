from odoo import models, fields
class Atazak(models.Model):
    _name = 'pisua.atazak'
    _description = 'Gestión de Tareas (Atazak)'

    name = fields.Char(string="Ataza Izena", required=True)
    description = fields.Text(string="Deskribapena")
    
    state = fields.Selection([
        ('todo', 'Egiteko'),
        ('doing', 'Egiten'),
        ('done', 'Eginda')
    ], string="Egoera", default='todo')

    pisua_id = fields.Many2one(
        comodel_name='pisua.pisua', 
        string="Pisua", 
        required=True,
        ondelete='cascade' 
    )

class PisuaExtension(models.Model):
    _inherit = 'pisua.pisua'  
    atazak_ids = fields.One2many(
        comodel_name='pisua.atazak', 
        inverse_name='pisua_id', 
        string="Atazak (Tareas)"
    )