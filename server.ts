import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import * as XLSX from 'xlsx';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Simple in-memory session token store for admin auth
const activeAdminTokens = new Set<string>();

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies['travstories_admin_token'] || req.headers['x-admin-token'];
  if (token && activeAdminTokens.has(token as string)) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Admin login required.' });
};

// ==========================================
// PUBLIC SEO ROUTES
// ==========================================

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(
`User-agent: *
Allow: /
Allow: /kerala
Disallow: /admin
Disallow: /api/admin

Sitemap: https://travstories.com/sitemap.xml
`
  );
});

app.get('/sitemap.xml', (req, res) => {
  const packages = db.getPackages(false);
  const now = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Static pages
  xml += `  <url>\n    <loc>https://travstories.com/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>https://travstories.com/kerala</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

  // Dynamic tour package pages
  for (const pkg of packages) {
    xml += `  <url>\n    <loc>https://travstories.com/kerala#${pkg.slug}</loc>\n    <lastmod>${pkg.updatedAt.split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  xml += `</urlset>`;
  res.type('application/xml');
  res.send(xml);
});

// ==========================================
// PUBLIC APIS
// ==========================================

app.get('/api/public/branding', (req, res) => {
  try {
    const branding = db.getBranding();
    res.json(branding);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    // Return only public contact details, not private notification email
    res.json({
      phoneNumber: settings.phoneNumber,
      whatsappNumber: settings.whatsappNumber,
      contactEmail: settings.contactEmail,
      officeAddress: settings.officeAddress
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/packages', (req, res) => {
  try {
    const packages = db.getPackages(false);
    res.json(packages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/packages/:id', (req, res) => {
  try {
    const pkg = db.getPackageById(req.params.id);
    if (!pkg || !pkg.published) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(pkg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/testimonials', (req, res) => {
  try {
    const testimonials = db.getTestimonials();
    res.json(testimonials);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Honeypot & Lead submission
app.post('/api/public/leads', (req, res) => {
  try {
    const { name, mobile, packageId, inquiryType, travelDate, travellers, notes, honeypot } = req.body;

    // Spam protection: silent reject if honeypot is populated
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(200).json({ success: true, message: 'Inquiry received' });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name (minimum 2 characters).' });
    }

    if (!mobile || typeof mobile !== 'string') {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }

    // Clean Indian mobile number (stripping whitespace, hyphens, and +91/0 prefix)
    const cleanedMobile = mobile.replace(/[\s\-\(\)]/g, '');
    const indianMobileRegex = /^(?:\+91|0)?([6-9]\d{9})$/;
    const match = cleanedMobile.match(indianMobileRegex);

    if (!match) {
      return res.status(400).json({
        error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
      });
    }

    const normalizedMobile = match[1];

    const result = db.createLead({
      name: name.trim(),
      mobile: normalizedMobile,
      packageId,
      inquiryType: inquiryType || 'PACKAGE_DETAIL',
      travelDate,
      travellers,
      notes,
      source: 'Website Kerala Page'
    });

    res.status(201).json({
      success: true,
      leadId: result.lead.id,
      unlocked: true,
      message: 'Inquiry received successfully. Complete package details unlocked!'
    });
  } catch (err: any) {
    console.error('Error creating lead:', err);
    res.status(500).json({ error: 'Server error processing inquiry. Please try again.' });
  }
});

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = db.getAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const valid = bcrypt.compareSync(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    // Generate session token
    const token = 'trav_adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    activeAdminTokens.add(token);

    // Set cookie
    res.cookie('travstories_admin_token', token, {
      httpOnly: true,
      secure: false, // development container
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/logout', (req, res) => {
  const token = req.cookies['travstories_admin_token'] || req.headers['x-admin-token'];
  if (token) {
    activeAdminTokens.delete(token as string);
  }
  res.clearCookie('travstories_admin_token');
  res.json({ success: true });
});

app.get('/api/admin/me', (req, res) => {
  const token = req.cookies['travstories_admin_token'] || req.headers['x-admin-token'];
  if (!token || !activeAdminTokens.has(token as string)) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({
    authenticated: true,
    email: 'sales.travstories@gmail.com',
    name: 'TravStories Admin'
  });
});

// ==========================================
// ADMIN PROTECTED APIS
// ==========================================

app.get('/api/admin/dashboard-stats', requireAdmin, (req, res) => {
  try {
    const stats = db.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Package Management
app.get('/api/admin/packages', requireAdmin, (req, res) => {
  try {
    const packages = db.getPackages(true);
    res.json(packages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/packages', requireAdmin, (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      duration,
      image,
      destinations,
      shortDescription,
      basicItinerary,
      completeItinerary,
      highlights,
      inclusions,
      exclusions,
      hotelInformation,
      transportationInformation,
      featured,
      published,
      tag
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Package Name and Starting Price are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPkg = db.createPackage({
      name,
      slug: slug || 'pkg-' + Date.now(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      duration: duration || '3 Nights / 4 Days',
      image: image || 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop',
      destinations: destinations || 'Kerala',
      shortDescription: shortDescription || '',
      basicItinerary: basicItinerary || '',
      completeItinerary: Array.isArray(completeItinerary) ? completeItinerary : [],
      highlights: Array.isArray(highlights) ? highlights : (highlights ? [highlights] : []),
      inclusions: Array.isArray(inclusions) ? inclusions : (inclusions ? [inclusions] : []),
      exclusions: Array.isArray(exclusions) ? exclusions : (exclusions ? [exclusions] : []),
      hotelInformation: hotelInformation || 'Standard 3-Star Hotels',
      transportationInformation: transportationInformation || 'Private AC Car with driver',
      featured: Boolean(featured),
      published: published !== undefined ? Boolean(published) : true,
      tag: tag || ''
    });

    res.status(201).json(newPkg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/packages/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updatePackage(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/packages/:id', requireAdmin, (req, res) => {
  try {
    const deleted = db.deletePackage(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Lead Management
app.get('/api/admin/leads', requireAdmin, (req, res) => {
  try {
    const { status, packageId, search, startDate, endDate } = req.query;
    const leads = db.getLeads({
      status: status as string,
      packageId: packageId as string,
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.json(leads);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/leads/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateLeadStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/leads/:id', requireAdmin, (req, res) => {
  try {
    const deleted = db.deleteLead(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Excel Export
app.get('/api/admin/leads/export', requireAdmin, (req, res) => {
  try {
    const { status, packageId, search, startDate, endDate } = req.query;
    const leads = db.getLeads({
      status: status as string,
      packageId: packageId as string,
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string
    });

    const exportRows = leads.map(l => ({
      'Lead ID': l.id,
      'Customer Name': l.name,
      'Mobile Number': l.mobile,
      'Interested Package': l.packageName || 'General Inquiry',
      'Inquiry Type': l.inquiryType,
      'Travel Date': l.travelDate || 'Not specified',
      'Travellers': l.travellers || 'Not specified',
      'Status': l.status,
      'Source': l.source,
      'Received Date': new Date(l.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    // Set auto column widths
    const colWidths = [
      { wch: 14 },
      { wch: 22 },
      { wch: 15 },
      { wch: 35 },
      { wch: 18 },
      { wch: 16 },
      { wch: 14 },
      { wch: 12 },
      { wch: 20 },
      { wch: 22 }
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kerala Travel Leads');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="travstories-kerala-leads-${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('Failed to export leads:', err);
    res.status(500).json({ error: 'Excel export failed' });
  }
});

// Admin Branding Management
app.get('/api/admin/branding', requireAdmin, (req, res) => {
  try {
    const branding = db.getBranding();
    res.json(branding);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/branding', requireAdmin, (req, res) => {
  try {
    const updated = db.updateBranding(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Settings Management
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// VITE INTEGRATION & SERVER START
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TravStories Kerala Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
