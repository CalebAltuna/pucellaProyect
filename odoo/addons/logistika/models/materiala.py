from odoo import models, fields

class LogistikaMateriala(models.Model):
    _name = "logistika.materiala"
    _description = "Logistika Materiala"

    name = fields.Char(string="Izena", required=True)
    type  = fields.Selection([
                                        ('sound', 'Soinua'),
                                        ('lights', 'Argiztapena'),
                                        ('furniture', 'Altzariak'),
                                        ('others', 'Besteak'),
                        ], string='Mota', default='sound')
    is_available = fields.Boolean(string="Eskuragarri?", default=False)
    available_date = fields.Date(string="Eskuragarri data", required=True)
    hourly_rate = fields.Float(string="Prezioa orduko", required=False)
    note  = fields.Text(string="Oharra", required=False)
