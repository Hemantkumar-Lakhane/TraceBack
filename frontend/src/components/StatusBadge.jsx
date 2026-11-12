import React from 'react';
import { Clock, CheckCircle2, Search, ArrowRightLeft, ShieldCheck, CheckCheck, XCircle } from 'lucide-react';

export const StatusBadge = ({ status, type }) => {
  const normStatus = (status || 'OPEN').toUpperCase();

  const getBadgeConfig = () => {
    switch (normStatus) {
      case 'OPEN':
        return {
          className: 'badge-open',
          icon: <Search size={11} />,
          text: 'Open'
        };
      case 'MATCHED':
        return {
          className: 'badge-matched',
          icon: <ArrowRightLeft size={11} />,
          text: 'Matched'
        };
      case 'CLAIM_REQUESTED':
      case 'PENDING':
        return {
          className: 'badge-claim-requested',
          icon: <Clock size={11} />,
          text: 'Pending'
        };
      case 'VERIFYING':
        return {
          className: 'badge-verifying',
          icon: <ShieldCheck size={11} />,
          text: 'In Verification'
        };
      case 'APPROVED':
        return {
          className: 'badge-approved',
          icon: <CheckCircle2 size={11} />,
          text: 'Approved'
        };
      case 'RETURNED':
      case 'CLOSED':
        return {
          className: 'badge-returned',
          icon: <CheckCheck size={11} />,
          text: 'Returned'
        };
      case 'REJECTED':
        return {
          className: 'badge-rejected',
          icon: <XCircle size={11} />,
          text: 'Rejected'
        };
      default:
        return {
          className: 'badge-open',
          icon: <Clock size={11} />,
          text: normStatus
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};

export const TypeBadge = ({ type }) => {
  const isLost = type?.toUpperCase() === 'LOST';
  return (
    <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
      {isLost ? 'Lost' : 'Found'}
    </span>
  );
};

export default StatusBadge;
