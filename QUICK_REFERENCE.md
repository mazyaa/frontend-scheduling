# Quick Reference Guide - New Modules

## How to Use Each Module

### 1. Kelola Penilaian (Admin & Asesor)

**Admin Access:**
```
URL: /admin/kelola-penilaian
Component: KelolaPenilaian (DataTable pattern)
```

**Asesor Access:**
```
URL: /asesor/kelola-penilaian
Component: KelolaPenilaianGrid (GridBackground pattern)
```

**Features:**
- Add new penilaian (assessment) for peserta
- Edit existing penilaian
- Delete penilaian
- Search by peserta name
- View nilai (score) and catatan (notes)

**Required Props:**
- `scheduleId` (optional) - Filter by specific schedule

---

### 2. Kelola E-Sertifikat (Admin Only)

**Admin Access:**
```
URL: /admin/kelola-e-sertifikat
Component: KelolaESertifikat
```

**Workflow:**
1. **DRAFT** → Click "Publish" → **PUBLISHED**
2. **PUBLISHED** → Click "Download" to get PDF
3. **PUBLISHED** → Click "Revisi" → Upload new file → **REVISION_ADMIN**
4. **REVISION_ADMIN** → Click "Setujui" → **APPROVED**
5. **REVISION_ADMIN** → Click "Tolak" → **REJECTED**

**Status Flow:**
```
DRAFT → PUBLISHED → REVISION_ADMIN/REVISION_PESERTA → APPROVED/REJECTED
```

---

### 3. Kelola Laporan (Admin & Direktur)

**Access:**
```
Admin URL: /admin/kelola-laporan
Direktur URL: /direktur/kelola-laporan
Component: KelolaLaporan
```

**Two Tabs:**

**Tab 1: Laporan Sertifikat**
- View all issued certificates
- Filter by peserta name
- See status and tanggal terbit

**Tab 2: Laporan Peserta**
- View peserta statistics
- Total training participated
- Training completed
- Average score

---

### 4. Dashboard (Admin & Direktur)

**Access:**
```
Admin URL: /admin/dashboard
Direktur URL: /direktur/dashboard
Component: Dashboard
```

**Statistics Displayed:**
- Total Peserta
- Total Instruktur
- Total Asesor
- Total Training
- Jadwal Training Aktif
- Sertifikat Terbit
- Total Materi Training
- Total Penilaian

**Auto-refresh:** Data refreshes on page load

---

### 5. Sertifikat Verify (Public)

**Access:**
```
URL: /sertifikat/verify (No login required)
Component: SertifikatVerify
```

**How to Use:**
1. Enter nomor sertifikat
2. Click "Verifikasi" or press Enter
3. View result:
   - ✅ **Valid**: Shows peserta details, training info, nilai, tanggal terbit
   - ❌ **Invalid**: Shows error message
4. Click "Reset" to verify another certificate

---

## API Integration Notes

### Authentication Required
All endpoints except `/sertifikat/verify` require authentication token.

### Pagination Parameters
```typescript
params = `limit=${limit}&page=${page}&search=${search}`
```

### Error Handling
All components use toast notifications:
- Success: Green toast
- Error: Red toast with error message

### Loading States
All components show:
- Spinner during data fetch
- Disabled buttons during mutations
- Loading skeleton on initial load

---

## Component Props Reference

### KelolaPenilaian
```typescript
interface KelolaPenilaianProps {
  scheduleId?: string; // Optional: filter by schedule
}
```

### KelolaESertifikat
```typescript
interface KelolaESertifikatProps {
  scheduleId?: string; // Optional: filter by schedule
}
```

### KelolaLaporan
```typescript
// No props required
```

### Dashboard
```typescript
// No props required
```

### SertifikatVerify
```typescript
// No props required
```

---

## File Upload Specifications

### Revisi Sertifikat
- **Accepted formats:** PDF only
- **Max size:** Not specified (check backend)
- **Field name:** `file`

### Tambah Penilaian
- **No file upload required**
- Only form data (pesertaId, sesiDetailJadwalId, nilai, catatan)

---

## Search Functionality

All DataTable components support search:
- **KelolaPenilaian:** Search by peserta name
- **KelolaESertifikat:** Search by peserta name
- **KelolaLaporan (Sertifikat):** Search by peserta name
- **KelolaLaporan (Peserta):** Search by peserta name/email

---

## Responsive Design

All components are responsive:
- **Mobile:** Single column layout
- **Tablet:** 2 column grid
- **Desktop:** 3 column grid (Dashboard)

---

## Color Coding

### Status Badges (E-Sertifikat & Laporan)
- **DRAFT:** Gray (default)
- **PUBLISHED:** Green (success)
- **REVISION_ADMIN:** Orange (warning)
- **REVISION_PESERTA:** Orange (warning)
- **APPROVED:** Green (success)
- **REJECTED:** Red (danger)

### Dashboard Cards
- **Total Peserta:** Blue
- **Total Instruktur:** Green
- **Total Asesor:** Purple
- **Total Training:** Orange
- **Jadwal Training Aktif:** Yellow
- **Sertifikat Terbit:** Red

---

## Common Issues & Solutions

### Issue: "Cannot read property 'nama' of undefined"
**Solution:** Check if API response includes nested objects (peserta, jadwalTraining, etc.)

### Issue: "scheduleId is required"
**Solution:** Pass scheduleId prop to KelolaPenilaian or KelolaESertifikat

### Issue: "File upload not working"
**Solution:** Ensure FormData is used and Content-Type is multipart/form-data

### Issue: "Search not working"
**Solution:** Check if backend supports search parameter in query string

### Issue: "Pagination not updating"
**Solution:** Ensure useChangeUrl hook is properly imported and used

---

## Testing Checklist

### Before Deployment
- [ ] Test all CRUD operations
- [ ] Test search functionality
- [ ] Test pagination
- [ ] Test file upload/download
- [ ] Test status transitions (E-Sertifikat)
- [ ] Test public verification page
- [ ] Test responsive design on mobile
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test toast notifications

### User Acceptance Testing
- [ ] Admin can manage penilaian
- [ ] Admin can manage e-sertifikat
- [ ] Admin can view laporan
- [ ] Direktur can view laporan
- [ ] Direktur can view dashboard
- [ ] Asesor can manage penilaian
- [ ] Public can verify sertifikat

---

## Next Steps

1. **Backend Integration:**
   - Ensure all API endpoints are implemented
   - Test with real data
   - Verify file upload/download works

2. **Testing:**
   - Run through all user flows
   - Test edge cases
   - Test error scenarios

3. **Deployment:**
   - Build production bundle
   - Test in staging environment
   - Deploy to production

4. **Documentation:**
   - Update user manual
   - Create video tutorials
   - Train end users

---

## Support

For issues or questions:
1. Check IMPLEMENTATION_SUMMARY.md for technical details
2. Review API service files in `/services`
3. Check component source code for inline comments
4. Test with backend team for API issues
