from odoo import models,fields

class baliabideakTresnak(models.Models):
    _name = 'baliabideak.tresnak'
    _description = 'baliabide tresnak'
    
    name = fields.Char(string= 'Izena', required=True)
    serial_number= fields.Char(string= 'Serie Zenbakia', requiered= True)
    purchase_date= fields.Date(string = 'Erosketa_data', requiered = True)
    value = fields.Integer(string = 'Balioa')
    state= fields.Selection([('available','Erabilgarri'), ('rented','Maileguan')], ('damaged','Hautsita') , default='Erabilgarri')
    is_electric= fields.Boolean(string= 'elektriokoa da?', required= True)
    description= fields.Text(string = 'deskribapena', required= True)