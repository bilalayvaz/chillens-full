import { useState, useEffect } from 'react';
import { useSession, SessionType, ProfileSession } from '@lens-protocol/react-web';
import { paymentService } from '../services/api';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { withAuth } from './hoc/withAuth';

interface Payment {
  paymentId: string;
  token: string;
  paidAmount: number;
  txHash: string;
  creditAmount: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  network: string;
}

const PaymentContent = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const profileSession = session as ProfileSession;

  useEffect(() => {
    const fetchPayments = async () => {
      if (session?.type !== SessionType.WithProfile || !profileSession?.profile?.id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await paymentService.getPaymentHistory(profileSession.profile.id);
        setPayments(data);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payment history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [session?.type, profileSession?.profile?.id]);

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <p className="text-2xl text-gray-500 mb-4">No Payment History</p>
        <p className="text-gray-400">You haven&apos;t made any payments yet.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-medium mb-6">Payment History</h2>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div 
            key={payment.paymentId} 
            className="border border-black p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(payment.status)}
                <span className="font-medium capitalize">{payment.status}</span>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(payment.timestamp)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                <p className="font-medium">{payment.paidAmount} BONSAI</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Credits Received</p>
                <p className="font-medium">{payment.creditAmount} Credits</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Transaction Hash</p>
                <a 
                  href={`https://polygonscan.com/tx/${payment.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 truncate block"
                >
                  {payment.txHash}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(PaymentContent);