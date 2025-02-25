import TicketManager from '../dao/classes/ticketDAO.js'
import TicketDTO from '../dto/ticketDTO.js'

class TicketRepository {
    async createTicket(ticketData) {
        const ticket = await TicketManager.createTicket(ticketData)
        return new TicketDTO(ticket)
    }
}

export default new TicketRepository()
