export type WalletAddress = string;

export interface EncryptedMnemonic {
  ciphertext: string;
  iv: string;
  tag: string;
  version: number;
}

export interface SolAirdropResult {
  success: boolean;
  signature?: string;
  balance?: number;
  error?: string;
}

export interface InternalWallet {
  encMnemonic: EncryptedMnemonic;
  addressDigest: string;
  createdAt: Date;
  version: number;
  oVND: number;
  oUSDC: number;
  solAirdrop?: SolAirdropResult;
}

export interface InternalWalletResponse {
  address: WalletAddress | null;
}
