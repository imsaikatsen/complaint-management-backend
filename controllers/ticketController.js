const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createTicket = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Authenticated user:', req.user);

    const { subject, description } = req.body;

    if (!subject || !description) {
      return res
        .status(400)
        .json({ message: 'Subject and description are required.' });
    }

    const newTicket = await prisma.ticket.create({
      data: {
        subject,
        description,
        status: 'Open',
        customerId: req.user.id, // Use customer ID from the token
      },
    });

    res
      .status(201)
      .json({ ticket: newTicket, message: 'Ticket created successfully!' });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTAllickets = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const tickets = await prisma.ticket.findMany({
      where: status ? { status } : undefined,
      skip: Number(skip),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const totalCount = await prisma.ticket.count({
      where: status ? { status } : undefined,
    });

    res
      .status(200)
      .json({ tickets, totalCount, totalPages: Math.ceil(totalCount / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getTicketById = async (req, res) => {
  const { id } = req.params;
  console.log('Received ID:', id); // Check what's being passed

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ticket ID format' });
  }

  try {
    const ticketId = parseInt(id, 10); // Ensure it's parsed as an integer

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        user: true,
        admin: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { status },
    });

    res
      .status(200)
      .json({ message: 'Status updated successfully', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.assignTicketToAdmin = async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;

  try {
    const ticket = await prisma.ticket.update({
      where: { id: parseInt(id, 10) },
      data: { adminId },
    });

    res.json({ message: 'Ticket assigned to admin successfully', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getCustomerTickets = async (req, res) => {
  try {
    const customerId = req.user.id; // Extract customer ID from the decoded token

    // Fetch tickets associated with the logged-in customer
    const tickets = await prisma.ticket.findMany({
      where: { customerId: customerId },
    });

    res.json({ tickets });
  } catch (error) {
    console.error('Error fetching customer tickets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateTicket = async (req, res) => {
  const { id } = req.params; // Ticket ID from URL
  const { subject, description, status } = req.body; // Fields to update

  console.log('Updating Ticket ID:', id);

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ticket ID format' });
  }

  try {
    const ticketId = parseInt(id, 10); // Ensure ID is an integer

    // Check if there are fields to update
    if (!subject && !description && !status) {
      return res.status(400).json({ error: 'No fields to update provided' });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ...(subject && { subject }),
        ...(description && { description }),
        ...(status && { status }),
      },
    });

    if (!updatedTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.status(200).json({
      message: 'Ticket updated successfully',
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTicket = async (req, res) => {
  const { id } = req.params;

  // Validate the ticket ID
  if (!id || isNaN(Number(id))) {
    return res
      .status(400)
      .json({ message: 'Invalid Ticket ID provided. ID must be a number.' });
  }

  try {
    // Attempt to delete the ticket
    const ticket = await prisma.ticket.delete({
      where: { id: parseInt(id, 10) },
    });

    // Respond with a success message
    res.status(200).json({
      message: 'Ticket deleted successfully',
      ticket,
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);

    // Handle record not found (P2025) error
    if (error.code === 'P2025') {
      return res.status(404).json({
        message: `Ticket with ID ${id} not found.`,
      });
    }

    // Handle Prisma-specific validation errors
    if (error.name === 'PrismaClientValidationError') {
      return res.status(400).json({
        message: 'Invalid data provided for ticket deletion.',
      });
    }

    // Handle general server errors
    res.status(500).json({
      message:
        'An unexpected error occurred while deleting the ticket. Please try again later.',
      error: error.message,
    });
  }
};
