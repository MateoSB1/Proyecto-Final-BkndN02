import Ticket from '../models/ticketModel.js'

class TicketManager {
    async createTicket(ticketData) {
        const ticket = new Ticket(ticketData)
        return await ticket.save()
    }
}

export default new TicketManager()