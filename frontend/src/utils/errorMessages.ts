import { AxiosError } from 'axios';

const friendlyMessages: Record<string, string> = {
  'Invalid credentials': 'Wrong username or password. Please try again.',
  'Username already taken': 'This username is already taken. Try a different one.',
  'Account not found': 'This account no longer exists. It may have been deleted.',
  'Transaction not found': 'This transaction no longer exists. It may have been deleted.',
  'Access denied': 'You don\'t have permission to do this.',
  'Account with this name already exists': 'You already have an account with this name.',
  'Cannot delete account with existing transactions': 'This account has transactions. Delete or move them first.',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // No response — network/server issue
    if (!error.response) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    // Backend returned an error message
    const serverMsg = error.response.data?.error;
    if (serverMsg && friendlyMessages[serverMsg]) {
      return friendlyMessages[serverMsg];
    }
    if (serverMsg) {
      // Validation errors from backend (e.g., "amount: must be positive; type: must not be null")
      if (serverMsg.includes(':')) {
        return serverMsg.split(';').map((s: string) => {
          const parts = s.trim().split(':');
          if (parts.length === 2) {
            const field = parts[0].trim().replace(/([A-Z])/g, ' $1').toLowerCase().trim();
            return `${field.charAt(0).toUpperCase() + field.slice(1)} ${parts[1].trim()}`;
          }
          return s.trim();
        }).join('. ') + '.';
      }
      return serverMsg;
    }
    // HTTP status fallbacks
    const status = error.response.status;
    if (status === 401) return 'Your session has expired. Please sign in again.';
    if (status === 403) return 'You don\'t have permission to do this.';
    if (status === 404) return 'The item you\'re looking for doesn\'t exist.';
    if (status === 409) return 'This conflicts with existing data. Please refresh and try again.';
    if (status >= 500) return 'Something went wrong on our end. Please try again in a moment.';
  }
  return 'Something unexpected happened. Please try again.';
}
