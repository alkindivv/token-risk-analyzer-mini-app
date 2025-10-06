// lib/goplus.ts
import axios from 'axios';
import { TokenSecurityData } from '@/types';

const GOPLUS_BASE_URL = 'https://api.gopluslabs.io/api/v1';

class GoPlusClient {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async getTokenSecurity(
    chainId: string,
    contractAddress: string
  ): Promise<TokenSecurityData | null> {
    try {
      const url = `${GOPLUS_BASE_URL}/token_security/${chainId}`;
      const params = { contract_addresses: contractAddress.toLowerCase() };
      const headers = this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {};

      const response = await axios.get(url, { params, headers });

      if (response.data.code !== 1) {
        throw new Error('GoPlus API error: ' + response.data.message);
      }

      const tokenData = response.data.result[contractAddress.toLowerCase()];
      if (!tokenData) return null;

      return {
        contractAddress,
        chainId,
        tokenName: tokenData.token_name || 'Unknown',
        tokenSymbol: tokenData.token_symbol || 'Unknown',
        holderCount: parseInt(tokenData.holder_count) || 0,
        totalSupply: tokenData.total_supply || '0',
        
        isOpenSource: tokenData.is_open_source || '0',
        isProxy: tokenData.is_proxy || '0',
        isMintable: tokenData.is_mintable || '0',
        canTakeBackOwnership: tokenData.can_take_back_ownership || '0',
        ownerChangeBalance: tokenData.owner_change_balance || '0',
        hiddenOwner: tokenData.hidden_owner || '0',
        selfDestruct: tokenData.selfdestruct || '0',
        externalCall: tokenData.external_call || '0',
        
        buyTax: tokenData.buy_tax || '0',
        sellTax: tokenData.sell_tax || '0',
        cannotBuy: tokenData.cannot_buy || '0',
        cannotSellAll: tokenData.cannot_sell_all || '0',
        slippageModifiable: tokenData.slippage_modifiable || '0',
        isHoneypot: tokenData.is_honeypot || '0',
        transferPausable: tokenData.transfer_pausable || '0',
        isBlacklisted: tokenData.is_blacklisted || '0',
        
        lpHolderCount: parseInt(tokenData.lp_holder_count) || 0,
        lpTotalSupply: tokenData.lp_total_supply || '0',
        
        holders: tokenData.holders || [],
        creatorPercent: tokenData.creator_percent || '0',
      };
    } catch (error) {
      console.error('GoPlus API Error:', error);
      throw error;
    }
  }
}

export const goPlusClient = new GoPlusClient(process.env.GOPLUS_API_KEY);
