import type { RequestHandler } from 'express';

const msisdnRegex = /^\+?\d{8,15}$/;

export const handleTransferBalance: RequestHandler = (req, res) => {
  const { sender, receiver, amount } = req.body || {};
  if (!msisdnRegex.test(sender) || !msisdnRegex.test(receiver)) {
    return res.status(400).json({ error: 'Invalid MSISDN(s).' });
  }
  const amt = Number(amount);
  if (!Number.isInteger(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive integer.' });
  }

  return res.json({ message: `Transferred ${amt} from ${sender} to ${receiver}.` });
};
