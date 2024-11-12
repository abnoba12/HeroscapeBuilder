export function getCookie(cookieName: string): string | null {
    // Use `document.cookie` to get all cookies as a single string
    const cookies = document.cookie;

    // Find the specific cookie by name and return its value if it exists
    const cookie = cookies
        .split('; ')
        .find((cookie) => cookie.startsWith(`${cookieName}=`));

    // If the cookie exists, return its value, otherwise return null
    return cookie ? cookie.split('=')[1] : null;
}