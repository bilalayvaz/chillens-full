'use client';
import { useState, useCallback } from 'react';
import { useUpdateProfileManagers, useSession, SessionType, ProfileSession } from '@lens-protocol/react-web';
import Navbar from '@/app/components/Navbar';
import { withAuth } from '@/app/components/hoc/withAuth';
import { ChevronDown } from 'lucide-react';
import PaymentContent from '../../components/PaymentHistory';

const PermissionlessContent = ({ 
  enableSignless, 
  loading, 
  error,
  isSignlessActive 
}: { 
  enableSignless: () => Promise<void>,
  loading: boolean,
  error: string | null,
  isSignlessActive: boolean
}) => (
  <div className="flex flex-col items-center justify-center h-full">
    <p className="text-2xl mb-4 max-w-md text-center">
      Hey Lens Frens! If you didn&apos;t enable Lens gasless yet, please click this button now to
    </p>
    <button
      onClick={enableSignless}
      disabled={loading || isSignlessActive}
      className={`text-red-500 text-3xl md:text-5xl border border-black py-4 md:py-6 px-4 md:px-28 transition-colors mb-4 w-full md:w-auto ${
        loading || isSignlessActive
          ? 'bg-gray-100 cursor-not-allowed'
          : 'hover:bg-red-50 cursor-pointer'
      }`}
    >
      {loading ? 'ENABLING...' : isSignlessActive ? 'ENABLED' : 'ENABLE'}
    </button>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    <p className="text-2xl mb-4 max-w-md text-center">
      gasless experience on Lens!
    </p>
  </div>
);

const PaymentsContent = () => <PaymentContent />;

const SignlessActivationPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { execute: updateProfileManagers } = useUpdateProfileManagers();
  const { data: session } = useSession();
  const profileSession = session as ProfileSession;
  
  const [selectedOption, setSelectedOption] = useState('permissionless');
  
  const options = [
    { id: 'permissionless', label: 'Permissionless' },
    { id: 'payments', label: 'Payments' }
  ];

  const enableSignless = useCallback(async () => {
    if (!profileSession?.profile?.id) return;
    setLoading(true);
    setError(null);
    try {
      await updateProfileManagers({ approveSignless: true });
    } catch (err) {
      console.error('Signless activation error:', err);
      setError('Signless could not be enabled. Please try again..');
    } finally {
      setLoading(false);
    }
  }, [profileSession?.profile, updateProfileManagers]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4">
        <div className="mt-8 border border-black">
          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <div className="border-b border-black p-4">
              <p className="text-xl text-center">
                @{profileSession.profile?.handle?.fullHandle.replace('lens/', '')}
              </p>
              
              <div className="relative mt-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full p-3 border border-black bg-white flex items-center justify-between"
                >
                  <span>{options.find(opt => opt.id === selectedOption)?.label}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-black border-t-0 z-10">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSelectedOption(option.id);
                          setIsOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              {selectedOption === 'permissionless' ? (
                <PermissionlessContent 
                  enableSignless={enableSignless}
                  loading={loading}
                  error={error}
                  isSignlessActive={session?.type === SessionType.WithProfile && (session as ProfileSession)?.profile?.signless}
                />
              ) : (
                <PaymentsContent />
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-8">
            <div className="col-span-2 border-r border-black p-6">
              <p className="text-xl text-center mb-8">
                @{profileSession.profile?.handle?.fullHandle.replace('lens/', '')}
              </p>
              
              <div className="flex flex-col gap-2">
                {options.map((option) => (
                  <button
                    key={option.id}
                    className={`p-3 border border-black transition-colors ${
                      selectedOption === option.id 
                        ? 'bg-black text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-6 p-6">
              {selectedOption === 'permissionless' ? (
                <PermissionlessContent 
                  enableSignless={enableSignless}
                  loading={loading}
                  error={error}
                  isSignlessActive={session?.type === SessionType.WithProfile && (session as ProfileSession)?.profile?.signless}
                />
              ) : (
                <PaymentsContent />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default withAuth(SignlessActivationPage);