"use client";

import { useMemo, useState } from "react";
import QRCode from "react-qr-code";
import {
  ClipboardIcon,
  CheckIcon,
  QrCodeIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { useInternalWallet } from "@/hooks/use-internal-wallet";
import RevealMnemonicDialog from "./RevealMnemonicDialog";

export default function InternalWalletSection() {
  const { address, walletLoading, createIfMissing, refreshMe } =
    useInternalWallet();
  const [copied, setCopied] = useState(false);
  const [showMnemonicDialog, setShowMnemonicDialog] = useState(false);

  const addressShort = useMemo(() => {
    const a = address || "";
    return a.length > 16 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a;
  }, [address]);

  const copy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 900);
    toast.info("Olym3 Wallet address copied.");
  };

  return (
    <ProfileSection
      title="Olym3 Wallet"
      actions={
        address ? (
          <div className="flex gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={copy}
              disabled={!address}
            >
              {copied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <ClipboardIcon className="h-4 w-4" />
              )}
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowMnemonicDialog(true)}
              disabled={!address}
            >
              <KeyIcon className="h-4 w-4" />
              Mnemonic
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            onClick={createIfMissing}
            disabled={walletLoading}
          >
            {walletLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <QrCodeIcon className="h-4 w-4" />
            )}
            Create wallet
          </button>
        )
      }
    >
      {walletLoading && (
        <div
          className="skeleton h-40 w-full rounded-xl"
          aria-label="Loading internal wallet"
        />
      )}

      {!walletLoading && !address && (
        <div className="rounded-xl border border-base-300 bg-base-200 p-4 text-sm text-base-content/70">
          No internal wallet yet. Click{" "}
          <span className="font-medium">Create wallet</span> to generate a
          custodial address managed by Olympay.
        </div>
      )}

      {!walletLoading && address && (
        <article className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <div className="mx-auto w-[160px] rounded bg-white p-2">
            <QRCode value={address} size={156} />
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-base-content/60">Address</div>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm break-all">
                  {addressShort}
                </code>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={copy}
                  aria-label="Copy internal address"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-primary" />
                  ) : (
                    <ClipboardIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="text-xs text-base-content/60 mt-1">
                Share or scan this QR to send tokens to your Olympay balance.
              </div>
            </div>

            <div className="pt-2">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => refreshMe()}
              >
                Refresh
              </button>
            </div>
          </div>
        </article>
      )}

      <RevealMnemonicDialog
        open={showMnemonicDialog}
        onOpenChange={setShowMnemonicDialog}
      />
    </ProfileSection>
  );
}
