from odoo import models, fields

class PisuaCompra(models.Model):
    _inherit = 'purchase.order'

    baliabide_tresna_id = fields.Many2one(
        'pisua',
        string='Pisu eroslea'
    )