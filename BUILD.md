# Build Instructions

## Development Build

Development build includes source maps for debugging:

```bash
npm start
```

This uses `.env.development` configuration:
- `GENERATE_SOURCEMAP=true` - Source maps enabled
- Full debugging capabilities in browser DevTools

## Production Build

Production build excludes source maps for security:

```bash
npm run build
```

This uses `.env.production` configuration:
- `GENERATE_SOURCEMAP=false` - Source maps disabled
- Minified and optimized code
- Source code is not visible in browser DevTools
- Smaller bundle size

## Build Output

The production build will be in the `build/` directory:
- `build/static/js/*.js` - JavaScript bundles (no .map files)
- `build/static/css/*.css` - CSS files (no .map files)
- `build/index.html` - Main HTML file

## Verification

After building, you can verify source maps are disabled:

1. Build the project: `npm run build`
2. Check the build directory: `ls -la build/static/js/`
3. You should NOT see any `.map` files
4. Open browser DevTools → Sources tab
5. You should see minified code, not original source

## Security Note

**Never enable source maps in production!**

Source maps expose your original source code, including:
- Business logic
- API endpoints
- Internal structure
- Comments and documentation

Always keep `GENERATE_SOURCEMAP=false` in production.
