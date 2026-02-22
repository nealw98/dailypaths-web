import { bp, BASE_URL } from '../helpers/config.mjs';

/**
 * Renders the admin page — a self-contained SPA shell.
 * Authentication, data loading, and UI are all handled client-side by admin.js.
 */
export function renderAdminPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin | Al-Anon Daily Paths</title>
  <meta name="robots" content="noindex, nofollow">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="${bp('/assets/favicon.png')}">

  <!-- Styles -->
  <link rel="stylesheet" href="${bp('/css/admin.css')}">
</head>
<body class="page-admin">
  <div id="admin-app"></div>
  <div id="admin-toast" class="admin-toast"></div>
  <script src="${bp('/js/admin.js')}" defer></script>
</body>
</html>`;
}
