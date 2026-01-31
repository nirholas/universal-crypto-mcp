/**
 * ============================================================
 * 🎬 Video Downloader
 * ============================================================
 * 
 * @name        video-downloader.js
 * @description Download videos from any X/Twitter post
 * @author      nichxbt (https://x.com/nichxbt)
 * @version     1.0.0
 * @date        2026-01-26
 * @repository  https://github.com/nirholas/XActions
 * 
 * ============================================================
 * 📋 USAGE INSTRUCTIONS:
 * 
 * 1. Go to any tweet with a video:
 *    https://x.com/user/status/TWEET_ID
 * 
 * 2. Open Chrome DevTools (F12 or Cmd+Option+I)
 * 3. Paste this script and press Enter
 * 4. Video URLs will be shown + best quality auto-downloads
 * 
 * ============================================================
 * ⚙️ CONFIGURATION
 * ============================================================
 */

const CONFIG = {
  // Quality preference: 'highest', 'lowest', 'all'
  quality: 'highest',
  
  // Auto-download best quality
  autoDownload: true,
  
  // Show all available qualities in console
  showAllQualities: true
};

/**
 * ============================================================
 * 🚀 SCRIPT START
 * ============================================================
 */

(async function videoDownloader() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  🎬 VIDEO DOWNLOADER                                       ║');
  console.log('║  by nichxbt - https://github.com/nirholas/XActions         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Verify we're on a tweet page
  if (!window.location.href.includes('/status/')) {
    console.error('❌ ERROR: Must be on a tweet page with a video!');
    console.log('📍 Go to any tweet: https://x.com/user/status/TWEET_ID');
    return;
  }
  
  console.log('🔍 Searching for video URLs...');
  console.log('');
  
  const videoUrls = new Set();
  
  // Method 1: Check video elements directly
  document.querySelectorAll('video').forEach(video => {
    if (video.src && video.src.includes('video.twimg.com')) {
      videoUrls.add(video.src);
    }
    
    // Check source elements
    video.querySelectorAll('source').forEach(source => {
      if (source.src && source.src.includes('video.twimg.com')) {
        videoUrls.add(source.src);
      }
    });
  });
  
  // Method 2: Search in page source for video URLs
  const pageHtml = document.documentElement.innerHTML;
  const videoRegex = /https:\/\/video\.twimg\.com\/[^"'\s]+\.mp4[^"'\s]*/g;
  const matches = pageHtml.match(videoRegex);
  
  if (matches) {
    matches.forEach(url => {
      // Clean up the URL
      const cleanUrl = url.split('"')[0].split("'")[0].split('\\')[0];
      if (cleanUrl.includes('.mp4')) {
        videoUrls.add(cleanUrl);
      }
    });
  }
  
  // Method 3: Check for blob URLs and try to find actual source
  document.querySelectorAll('video[src^="blob:"]').forEach(video => {
    console.log('📍 Found blob video - checking for source...');
    // For blob videos, we need to check network requests
  });
  
  if (videoUrls.size === 0) {
    console.log('❌ No video URLs found!');
    console.log('');
    console.log('💡 Tips:');
    console.log('   - Make sure the video has loaded/played');
    console.log('   - Try refreshing the page');
    console.log('   - Some videos may use DRM protection');
    return;
  }
  
  // Parse and sort by quality
  const videos = [];
  
  videoUrls.forEach(url => {
    // Try to extract resolution from URL
    const resMatch = url.match(/\/(\d{3,4})x(\d{3,4})\//);
    let width = 0, height = 0;
    
    if (resMatch) {
      width = parseInt(resMatch[1]);
      height = parseInt(resMatch[2]);
    } else {
      // Try alternate pattern
      const altMatch = url.match(/vid\/(\d+)x(\d+)\//);
      if (altMatch) {
        width = parseInt(altMatch[1]);
        height = parseInt(altMatch[2]);
      }
    }
    
    videos.push({
      url: url,
      width,
      height,
      resolution: width && height ? `${width}x${height}` : 'Unknown',
      pixels: width * height
    });
  });
  
  // Sort by resolution (highest first)
  videos.sort((a, b) => b.pixels - a.pixels);
  
  // Display results
  console.log(`✅ Found ${videos.length} video URL(s):`);
  console.log('');
  
  if (CONFIG.showAllQualities) {
    console.log('📊 Available qualities:');
    videos.forEach((v, i) => {
      console.log(`   ${i + 1}. ${v.resolution}`);
      console.log(`      ${v.url}`);
      console.log('');
    });
  }
  
  // Get preferred video
  let selectedVideo;
  if (CONFIG.quality === 'highest') {
    selectedVideo = videos[0];
  } else if (CONFIG.quality === 'lowest') {
    selectedVideo = videos[videos.length - 1];
  }
  
  if (selectedVideo) {
    console.log(`🎯 Selected: ${selectedVideo.resolution}`);
    console.log('');
    
    // Copy URL to clipboard
    try {
      await navigator.clipboard.writeText(selectedVideo.url);
      console.log('📋 Video URL copied to clipboard!');
    } catch (error) {
      console.warn('Failed to copy video URL to clipboard:', error.message);
    }
    
    // Auto-download
    if (CONFIG.autoDownload) {
      console.log('💾 Starting download...');
      console.log('');
      
      try {
        const response = await fetch(selectedVideo.url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `twitter_video_${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Download started!');
      } catch (e) {
        console.log('⚠️ Auto-download failed. Opening in new tab...');
        window.open(selectedVideo.url, '_blank');
      }
    }
  }
  
  console.log('');
  console.log('💡 You can also right-click the video URL above and "Open in new tab"');
  console.log('   then right-click the video and "Save video as..."');
  console.log('');
  
  window.videoUrls = videos;
  console.log('💡 Access all URLs via: window.videoUrls');
  
  return videos;
})();
