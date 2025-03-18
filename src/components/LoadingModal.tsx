interface LoadingModalProps {
  isOpen: boolean;
}

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px]" />
      <div className="bg-white rounded-xl !border-2 !border-soft-gold/50 w-full max-w-[90vw] sm:max-w-md shadow-[0_0_15px_rgba(212,175,55,0.2)] [border-color:rgb(218,165,32,0.5)] relative">
        <div className="p-4 sm:p-8 flex flex-col items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(218,165,32,0.3)] [border-color:rgb(218,165,32,0.8)]" />
          <p className="font-seasons text-xl sm:text-2xl text-soft-gold">
            Consulting the Oracle
          </p>
          <p className="font-circe text-sm sm:text-base text-moonlight-silver text-center">
            Please wait while we connect with the spiritual realm
          </p>
        </div>
      </div>
    </div>
  );
}
