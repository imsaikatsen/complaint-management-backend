const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const { validateTicket } = require('../helper/validateTicket');

//Auth Route
const { login, register } = require('../controllers/authController');

router.post('/auth/register', register);
router.post('/auth/login', login);

// Tickets Route

const {
  createTicket,
  getTAllickets,
  getCustomerTickets,
  getTicketById,
  updateTicketStatus,
  assignTicketToAdmin,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
router.post('/tickets/create', authenticate, validateTicket, createTicket);
router.get('/tickets/', authenticate, getTAllickets);
router.get('/tickets/customer', authenticate, getCustomerTickets);
router.get('/tickets/:id', authenticate, getTicketById);
router.patch('/tickets/:id/status', authenticate, updateTicketStatus);
router.patch('/tickets/:id/assign', authenticate, assignTicketToAdmin);
router.put('/tickets/updateTicket/:id', authenticate, updateTicket);
router.delete('/tickets/:id', authenticate, deleteTicket);

module.exports = router;
