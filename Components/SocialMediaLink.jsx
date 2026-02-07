import React from 'react';

const SocialMediaLink = ({ url }) => {
  // Function to detect platform from URL
  const detectPlatform = (url) => {
    if (!url) return null;
    
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
      return {
        name: 'YouTube',
        icon: 'play_circle',
        color: 'text-red-600'
      };
    }
    
    if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
      return {
        name: 'Facebook',
        icon: 'group',
        color: 'text-blue-600'
      };
    }
    
    if (urlLower.includes('linkedin.com')) {
      return {
        name: 'LinkedIn',
        icon: 'work',
        color: 'text-blue-700'
      };
    }
    
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
      return {
        name: 'Twitter/X',
        icon: 'chat_bubble',
        color: 'text-sky-500'
      };
    }
    
    if (urlLower.includes('instagram.com')) {
      return {
        name: 'Instagram',
        icon: 'photo_camera',
        color: 'text-pink-600'
      };
    }
    
    if (urlLower.includes('github.com')) {
      return {
        name: 'GitHub',
        icon: 'code',
        color: 'text-gray-800'
      };
    }
    
    if (urlLower.includes('tiktok.com')) {
      return {
        name: 'TikTok',
        icon: 'music_note',
        color: 'text-black'
      };
    }
    
    if (urlLower.includes('behance.net')) {
      return {
        name: 'Behance',
        icon: 'palette',
        color: 'text-blue-500'
      };
    }
    
    if (urlLower.includes('dribbble.com')) {
      return {
        name: 'Dribbble',
        icon: 'brush',
        color: 'text-pink-500'
      };
    }
    
    if (urlLower.includes('medium.com')) {
      return {
        name: 'Medium',
        icon: 'article',
        color: 'text-gray-800'
      };
    }
    
    // Default/Generic link
    return {
      name: 'رابط',
      icon: 'link',
      color: 'text-sky-600'
    };
  };

  const platform = detectPlatform(url);
  
  if (!platform || !url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block mt-2 ${platform.color} hover:text-blue-900 text-sm flex items-center gap-1 justify-end`}
    >
      <span>{platform.name}</span>
      <span className="material-symbols-outlined text-sm">{platform.icon}</span>
    </a>
  );
};

export default SocialMediaLink;
