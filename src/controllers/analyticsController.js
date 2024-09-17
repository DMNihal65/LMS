const Analytics = require('../models/Analytics');

// Log analytics event
exports.logEvent = async (req, res) => {
  try {
    const event = new Analytics(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error logging event', error });
  }
};

// Get all analytics events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Analytics.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

// Get analytics report
exports.getReport = async (req, res) => {
  try {
    const { startDate, endDate, eventType } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (eventType) {
      query.type = eventType;
    }
    const events = await Analytics.find(query);
    const report = {
      totalEvents: events.length,
      eventsByType: {},
      eventsByProduct: {},
      eventsByUser: {}
    };
    events.forEach(event => {
      report.eventsByType[event.type] = (report.eventsByType[event.type] || 0) + 1;
      if (event.productId) {
        report.eventsByProduct[event.productId] = (report.eventsByProduct[event.productId] || 0) + 1;
      }
      if (event.userId) {
        report.eventsByUser[event.userId] = (report.eventsByUser[event.userId] || 0) + 1;
      }
    });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
};