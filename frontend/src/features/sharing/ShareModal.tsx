import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Copy, Check, Share2, Link as LinkIcon } from 'lucide-react';
import { api } from '../../api/client';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainNumber: string;
  trainName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  trainNumber,
  trainName,
}) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && !shareUrl) {
      generateLink();
    }
  }, [isOpen]);

  const generateLink = async () => {
    setIsLoading(true);
    try {
      const res = await api.createShareLink(trainNumber);
      const fullUrl = `${window.location.origin}${res.urlPath}`;
      setShareUrl(fullUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share && shareUrl) {
      navigator.share({
        title: `Track ${trainName} live on RailGaadi`,
        text: `Live tracking for Train #${trainNumber} - ${trainName}`,
        url: shareUrl,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Live Journey">
      <div className="space-y-5">
        <p className="text-sm font-semibold text-slate-600">
          Anyone with this link can view the live status, location, and ETA for <span className="font-bold text-slate-900">Train #{trainNumber}</span>.
        </p>

        {isLoading ? (
          <div className="p-4 rounded-2xl bg-slate-100 animate-pulse text-center text-xs font-semibold text-slate-500">
            Generating secure public share link...
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="p-2 text-slate-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              readOnly
              value={shareUrl || ''}
              className="flex-1 bg-transparent text-xs font-mono font-bold text-slate-800 outline-none truncate"
            />
            <Button
              variant="primary"
              size="sm"
              icon={isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopy}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        )}

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            variant="outline"
            size="md"
            icon={<Share2 className="w-4 h-4 text-indigo-600" />}
            onClick={handleNativeShare}
            className="w-full"
          >
            Share via Apps
          </Button>
        )}
      </div>
    </Modal>
  );
};
