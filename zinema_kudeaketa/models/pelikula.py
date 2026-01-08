from odoo import models, fields

class ZineaPelikula(models.Model):
    _name = 'zinea.pelikula'
    _description = 'Pelikula'
    
    Izenbura = fields.Char(string='Izenburua', required=True)
    Zuzendaria = fields.Char(string='Zuzendaria', required=True)
    Emanaldi_data = fields.Date(string='Emanaldi data')
    Sinopsia = fields.Text(string='Sinopsia')
    Iraupena_min = fields.Integer(string='Iraupena (min)')  # Quité el "adecualo"