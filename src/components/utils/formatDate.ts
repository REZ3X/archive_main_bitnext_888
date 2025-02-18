export function formatDate(dateString: string, expanded: boolean = false) {
    // Create date object in UTC
    const date = new Date(dateString);
    
    // Convert to UTC+7
    const jakartaTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    const now = new Date();
    const jakartaNow = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    
    const diff = jakartaNow.getTime() - jakartaTime.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (expanded) {
      return jakartaTime.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      });
    }
  
    if (seconds < 60) {
      return 'just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return jakartaTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      });
    }
  }