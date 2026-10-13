import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
  const token = req.cookies?.abroadmate_token;
  if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    res.clearCookie('abroadmate_token', cookieOptions());
    return res.status(401).json({ message: 'Your session expired. Please sign in again.' });
  }
}
export function cookieOptions() {
  const secure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
  return { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 };
}
