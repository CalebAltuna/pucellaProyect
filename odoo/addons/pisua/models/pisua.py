from odoo import models, fields

class Pisua(models.Model):
    _name = 'pisua.pisua'
    _description = 'Gestión de Pisos e Inmuebles'
    name = fields.Char(string='Nombre del Piso', required=True)
    code = fields.Char(string='Código Referencia')
    coordinator_id = fields.Many2one(
        comodel_name='res.users', 
        string='Coordinador',
        help="Usuario responsable de este piso"
    )