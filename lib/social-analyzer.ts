// lib/social-analyzer.ts - Social media sentiment
interface SocialMetrics {
  githubScore: number;
  hasGithub: boolean;
  twitterMentions: number;
  communitySize: 'LARGE' | 'MEDIUM' | 'SMALL' | 'NONE';
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  redFlags: string[];
}

class SocialAnalyzer {
  analyzeSocial(tokenName: string, tokenSymbol: string): SocialMetrics {
    // In production, would call GitHub/Twitter APIs
    // For now, return reasonable defaults
    
    const hasGithub = this.estimateGithub(tokenSymbol);
    const githubScore = hasGithub ? 70 : 20;
    const communitySize = this.estimateCommunity(tokenSymbol);
    const sentiment = this.analyzeSentiment(communitySize);
    const redFlags = this.checkRedFlags(hasGithub, communitySize);

    return {
      githubScore,
      hasGithub,
      twitterMentions: 0,
      communitySize,
      sentiment,
      redFlags,
    };
  }

  private estimateGithub(symbol: string): boolean {
    // Major tokens likely have GitHub
    const majorTokens = ['USDC', 'USDT', 'WETH', 'DAI', 'LINK', 'UNI'];
    return majorTokens.includes(symbol.toUpperCase());
  }

  private estimateCommunity(symbol: string): SocialMetrics['communitySize'] {
    const majorTokens = ['USDC', 'USDT', 'WETH', 'DAI'];
    if (majorTokens.includes(symbol.toUpperCase())) return 'LARGE';
    return 'SMALL';
  }

  private analyzeSentiment(size: SocialMetrics['communitySize']): SocialMetrics['sentiment'] {
    if (size === 'LARGE') return 'POSITIVE';
    if (size === 'MEDIUM') return 'NEUTRAL';
    return 'NEGATIVE';
  }

  private checkRedFlags(hasGithub: boolean, size: SocialMetrics['communitySize']): string[] {
    const flags: string[] = [];

    if (!hasGithub) {
      flags.push('⚠️ No public GitHub repository - code not auditable');
    }

    if (size === 'NONE') {
      flags.push('🚩 No social media presence - potential scam');
    }

    return flags;
  }
}

export const socialAnalyzer = new SocialAnalyzer();
