/**
 * Token Details API Route
 * 
 * Provides detailed information for a specific token
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const tokenData = await getTokenDetails(id);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tokenData);
  } catch (error) {
    console.error('Token details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token details' },
      { status: 500 }
    );
  }
}

async function getTokenDetails(id: string) {
  const API_BASE = 'https://api.coingecko.com/api/v3';
  
  try {
    const response = await fetch(
      `${API_BASE}/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) return null;
    
    const coin = await response.json();
    
    return {
      id: coin.id,
      symbol: coin.symbol?.toUpperCase() || '',
      name: coin.name || '',
      description: coin.description?.en || '',
      price: coin.market_data?.current_price?.usd || 0,
      marketCap: coin.market_data?.market_cap?.usd || 0,
      volume24h: coin.market_data?.total_volume?.usd || 0,
      change24h: coin.market_data?.price_change_percentage_24h || 0,
      change7d: coin.market_data?.price_change_percentage_7d || 0,
      change30d: coin.market_data?.price_change_percentage_30d || 0,
      rank: coin.market_cap_rank || 0,
      logoUrl: coin.image?.large || coin.image?.small || '',
      circulatingSupply: coin.market_data?.circulating_supply || 0,
      totalSupply: coin.market_data?.total_supply || 0,
      maxSupply: coin.market_data?.max_supply || null,
      ath: coin.market_data?.ath?.usd || 0,
      athChangePercent: coin.market_data?.ath_change_percentage?.usd || 0,
      athDate: coin.market_data?.ath_date?.usd || null,
      atl: coin.market_data?.atl?.usd || 0,
      atlChangePercent: coin.market_data?.atl_change_percentage?.usd || 0,
      atlDate: coin.market_data?.atl_date?.usd || null,
      fdv: coin.market_data?.fully_diluted_valuation?.usd || 0,
      high24h: coin.market_data?.high_24h?.usd || 0,
      low24h: coin.market_data?.low_24h?.usd || 0,
      sparkline: coin.market_data?.sparkline_7d?.price || [],
      categories: coin.categories || [],
      platforms: coin.platforms || {},
      links: {
        website: coin.links?.homepage?.[0] || null,
        whitepaper: coin.links?.whitepaper || null,
        twitter: coin.links?.twitter_screen_name ? `https://twitter.com/${coin.links.twitter_screen_name}` : null,
        telegram: coin.links?.telegram_channel_identifier ? `https://t.me/${coin.links.telegram_channel_identifier}` : null,
        discord: coin.links?.chat_url?.[0] || null,
        github: coin.links?.repos_url?.github?.[0] || null,
        reddit: coin.links?.subreddit_url || null,
      },
      community: {
        twitterFollowers: coin.community_data?.twitter_followers || 0,
        redditSubscribers: coin.community_data?.reddit_subscribers || 0,
        telegramMembers: coin.community_data?.telegram_channel_user_count || 0,
      },
      developer: {
        forks: coin.developer_data?.forks || 0,
        stars: coin.developer_data?.stars || 0,
        subscribers: coin.developer_data?.subscribers || 0,
        commits4Weeks: coin.developer_data?.commit_count_4_weeks || 0,
      },
      tickers: (coin.tickers || []).slice(0, 10).map((t: any) => ({
        exchange: t.market?.name || '',
        pair: `${t.base}/${t.target}`,
        price: t.last || 0,
        volume24h: t.converted_volume?.usd || 0,
        trustScore: t.trust_score || null,
      })),
      lastUpdated: coin.last_updated || new Date().toISOString(),
    };
  } catch (error) {
    console.error('CoinGecko token details API error:', error);
    return null;
  }
}
