#!/usr/bin/env python3
"""
Real-Time Crypto Sentiment Dashboard
=====================================

Advanced example showing:
- Real-time WebSocket streaming
- Multi-token sentiment tracking
- Price correlation analysis
- Alert system
- Visual dashboard (terminal-based)
"""

import asyncio
from datetime import datetime, timedelta
from typing import Dict, List
from dataclasses import dataclass
from collections import deque


@dataclass
class TokenSentiment:
    """Token sentiment data."""
    token: str
    sentiment: str
    confidence: float
    mention_count: int
    trending_score: float
    price_correlation: float
    timestamp: datetime


class CryptoSentimentDashboard:
    """
    Real-time crypto sentiment monitoring dashboard.
    
    Features:
    - Multi-token tracking
    - Sentiment history
    - Trend detection
    - Price correlation
    - Automated alerts
    """
    
    def __init__(self, tokens: List[str]):
        """Initialize dashboard."""
        self.tokens = tokens
        self.sentiment_history: Dict[str, deque] = {
            token: deque(maxlen=100) for token in tokens
        }
        self.alerts: List[Dict] = []
    
    async def start_monitoring(self, update_interval: int = 5):
        """
        Start real-time monitoring.
        
        Args:
            update_interval: Seconds between updates
        """
        print("""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   📊 Real-Time Crypto Sentiment Dashboard                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        """)
        
        print(f"Monitoring tokens: {', '.join(self.tokens)}")
        print(f"Update interval: {update_interval}s\n")
        
        try:
            while True:
                await self._update_sentiments()
                await self._display_dashboard()
                await self._check_alerts()
                await asyncio.sleep(update_interval)
                
        except KeyboardInterrupt:
            print("\n\n⏹  Monitoring stopped")
    
    async def _update_sentiments(self):
        """Update sentiment data for all tokens."""
        for token in self.tokens:
            # Simulate sentiment analysis
            import random
            
            sentiments = ["bullish", "bearish", "neutral"]
            sentiment = random.choice(sentiments)
            
            data = TokenSentiment(
                token=token,
                sentiment=sentiment,
                confidence=random.uniform(0.7, 0.95),
                mention_count=random.randint(500, 5000),
                trending_score=random.uniform(0.5, 1.0),
                price_correlation=random.uniform(-0.5, 0.8),
                timestamp=datetime.now(),
            )
            
            self.sentiment_history[token].append(data)
    
    async def _display_dashboard(self):
        """Display the dashboard."""
        print("\033[2J\033[H")  # Clear screen
        
        print(f"{'='*70}")
        print(f"  Crypto Sentiment Dashboard - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*70}\n")
        
        for token in self.tokens:
            if not self.sentiment_history[token]:
                continue
            
            current = self.sentiment_history[token][-1]
            
            # Sentiment indicator
            if current.sentiment == "bullish":
                indicator = "🟢 📈"
            elif current.sentiment == "bearish":
                indicator = "🔴 📉"
            else:
                indicator = "🟡 ➡️"
            
            print(f"{indicator} {current.token}")
            print(f"   Sentiment:    {current.sentiment.upper()}")
            print(f"   Confidence:   {current.confidence:.1%}")
            print(f"   Mentions:     {current.mention_count:,}")
            print(f"   Trending:     {'⭐' * int(current.trending_score * 5)}")
            print(f"   Correlation:  {current.price_correlation:+.2f}")
            
            # Sentiment trend
            if len(self.sentiment_history[token]) >= 3:
                recent = list(self.sentiment_history[token])[-3:]
                bullish_count = sum(1 for s in recent if s.sentiment == "bullish")
                
                if bullish_count == 3:
                    print(f"   Trend:        🚀 Strong Bullish")
                elif bullish_count == 0:
                    print(f"   Trend:        ⚠️  Strong Bearish")
                else:
                    print(f"   Trend:        ↔️  Mixed")
            
            print()
        
        # Recent alerts
        if self.alerts:
            print(f"{'-'*70}")
            print("Recent Alerts:")
            for alert in self.alerts[-5:]:
                print(f"   {alert['emoji']} {alert['message']}")
            print()
    
    async def _check_alerts(self):
        """Check for alert conditions."""
        for token in self.tokens:
            if len(self.sentiment_history[token]) < 2:
                continue
            
            current = self.sentiment_history[token][-1]
            previous = self.sentiment_history[token][-2]
            
            # Sentiment shift alert
            if current.sentiment != previous.sentiment:
                if current.sentiment == "bullish" and previous.sentiment == "bearish":
                    self.alerts.append({
                        "emoji": "🔔",
                        "message": f"{token}: Sentiment flipped to BULLISH!",
                        "timestamp": datetime.now(),
                    })
            
            # High confidence alert
            if current.confidence > 0.9:
                self.alerts.append({
                    "emoji": "⚡",
                    "message": f"{token}: High confidence {current.sentiment} signal",
                    "timestamp": datetime.now(),
                })
            
            # Trending alert
            if current.trending_score > 0.9:
                self.alerts.append({
                    "emoji": "🔥",
                    "message": f"{token}: Highly trending ({current.mention_count:,} mentions)",
                    "timestamp": datetime.now(),
                })
            
            # Strong correlation alert
            if abs(current.price_correlation) > 0.7:
                direction = "positive" if current.price_correlation > 0 else "negative"
                self.alerts.append({
                    "emoji": "📊",
                    "message": f"{token}: Strong {direction} price correlation",
                    "timestamp": datetime.now(),
                })
    
    def generate_report(self) -> str:
        """Generate a summary report."""
        report = []
        report.append("="*70)
        report.append("CRYPTO SENTIMENT REPORT")
        report.append("="*70)
        report.append("")
        
        for token in self.tokens:
            if not self.sentiment_history[token]:
                continue
            
            history = list(self.sentiment_history[token])
            
            # Calculate averages
            avg_confidence = sum(s.confidence for s in history) / len(history)
            avg_mentions = sum(s.mention_count for s in history) / len(history)
            
            # Sentiment distribution
            bullish_pct = sum(1 for s in history if s.sentiment == "bullish") / len(history)
            bearish_pct = sum(1 for s in history if s.sentiment == "bearish") / len(history)
            neutral_pct = sum(1 for s in history if s.sentiment == "neutral") / len(history)
            
            report.append(f"{token} Summary:")
            report.append(f"  Avg Confidence: {avg_confidence:.1%}")
            report.append(f"  Avg Mentions:   {avg_mentions:,.0f}")
            report.append(f"  Sentiment Breakdown:")
            report.append(f"    Bullish: {bullish_pct:.1%}")
            report.append(f"    Bearish: {bearish_pct:.1%}")
            report.append(f"    Neutral: {neutral_pct:.1%}")
            report.append("")
        
        return "\n".join(report)


async def main():
    """Run the crypto sentiment dashboard."""
    tokens = ["BTC", "ETH", "SOL", "DOGE", "ADA"]
    
    dashboard = CryptoSentimentDashboard(tokens)
    
    print("Starting real-time monitoring...")
    print("Press Ctrl+C to stop and generate report\n")
    
    try:
        await dashboard.start_monitoring(update_interval=5)
    except KeyboardInterrupt:
        print("\n\n" + "="*70)
        print(dashboard.generate_report())
        print("="*70)


if __name__ == "__main__":
    asyncio.run(main())
