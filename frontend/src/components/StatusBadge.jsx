import React from 'react';
import { Clock, CheckCircle2, Search, ArrowRightLeft, ShieldCheck, CheckCheck, XCircle } from 'lucide-react';

export const StatusBadge = ({ status, type }) => {
  const normStatus = (status || 'OPEN').toUpperCase();

  const getBadgeConfig = () => {
    switch (normStatus) {
      case 'OPEN':
        return {
          className: 'badge-open',
          icon: <Search size={12} />,
          text: 'Open Report'
        };
      case 'MATCHED':
        return {
          className: 'badge-matched',
          icon: <ArrowRightLeft size={12} />,
          text: 'Matched'
        };
      case 'CLAIM_REQUESTED':
      case 'PENDING':
        return {
          className: 'badge-claim-requested',
          icon: <Clock size={12} />,
          text: 'Claim Pending'
        };
      case 'VERIFYING':
        return {
          className: 'badge-verifying',
          icon: <ShieldCheck size={12} />,
          text: 'Verifying with Security'
        };
      case 'APPROVED':
        return {
          className: 'badge-approved',
          icon: <CheckCircle2 size={12} />,
          text: 'Claim Approved'
        };
      case 'RETURNED':
      case 'CLOSED':
        return {
          className: 'badge-returned',
          icon: <CheckCheck size={12} />,
          text: 'Item Returned'
        };
      case 'REJECTED':
        return {
          className: 'badge-rejected',
          icon: <XCircle size={12} />,
          text: 'Claim Rejected'
        };
      default:
        return {
          className: 'badge-open',
          icon: <Clock size={12} />,
          text: normStatus
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

export const TypeBadge = ({ type }) => {
  const isLost = type?.toUpperCase() === 'LOST';
  return (
    <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
      {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
    </span>
  );
};

export default StatusBadge;
