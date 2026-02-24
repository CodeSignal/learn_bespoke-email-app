import { init } from './email-app.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init({}));
} else {
  init({});
}
