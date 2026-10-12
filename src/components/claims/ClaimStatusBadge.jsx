import React from 'react';
import { Clock, CheckCircle2, XCircle, Gift } from 'lucide-react';

export const ClaimStatusBadge = ({ status }) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="badge badge-claim-pending">
          <Clock size={12} /> Pending Review
        </span>
      );
    case 'VERIFIED':
      return (
        <span className="badge badge-open">
          <CheckCircle2 size={12} /> Verified &bull; Awaiting Pickup
        </span>
      );
    case 'REJECTED':
      return (
        <span className="badge badge-lost">
          <XCircle size={12} /> Rejected
        </span>
      );
    case 'RECOVERED':
      return (
        <span className="badge badge-recovered">
          <Gift size={12} /> Recovered
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};
