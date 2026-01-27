from odoo import models, fields

class BaliabideakTresnak(models.Model):
    _name = "baliabideak.tresnak"
    _description = "Baliabideak Tresnak"

    name = fields.Char(string="Izena", required=True)
    serial_number = fields.Char(string="Serie Zenbakia", required=False )
    purchase_date = fields.Date(string="Erosketa Data", required=False)
    value = fields.Double(string="Balioa", required=False)
    state = fields.Selection([('available','Erabilgarri'), ('rented','Maileguan'), ('damaged','Hautsita'),], string="Elektrikoa da?", default='available')
    is_electric = fields.Boolean(string="Elektrikoa?", required=False)
    description = fields.Text(string="Deskribapena", required=False)