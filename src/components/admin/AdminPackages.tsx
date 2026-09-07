import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Eye, EyeOff, Star, AlertCircle, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { PackageItem } from '../../types';

interface AdminPackagesProps {
  adminToken: string;
}

export const AdminPackages: React.FC<AdminPackagesProps> = ({ adminToken }) => {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState(15999);
  const [originalPrice, setOriginalPrice] = useState(21999);
  const [duration, setDuration] = useState('5 Nights / 6 Days');
  const [destinations, setDestinations] = useState('Kochi • Munnar • Thekkady • Alleppey');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop');
  const [tag, setTag] = useState('Most Popular');
  const [shortDescription, setShortDescription] = useState('A classic Kerala vacation covering misty tea plantations, spice wildlife sanctuary, and an overnight houseboat backwater cruise.');
  const [highlightsText, setHighlightsText] = useState('Overnight Alleppey Houseboat with all meals\nMunnar Tea Museum & Eravikulam National Park\nPeriyar Lake boat safari & Spice plantation walk\nPrivate AC vehicle with dedicated driver');
  const [inclusionsText, setInclusionsText] = useState('Pick up & drop at Kochi Airport/Railway Station\nPrivate AC Sedan/Innova for all transfers\nHandpicked 3-star deluxe hotel stays\nDaily buffet breakfast\nDeluxe Private Alleppey Houseboat with lunch, tea, dinner & breakfast\nDriver bata, fuel, parking and all toll taxes');
  const [exclusionsText, setExclusionsText] = useState('Airfare or Train tickets to/from Kochi\nEntry tickets to monuments, museums & boat safaris\nPersonal expenses, laundry & tips\nAnything not specifically mentioned in inclusions');
  const [hotelInfo, setHotelInfo] = useState('3-Star & 4-Star Premium Deluxe category hotels. Clean, sanitized, tea garden or valley view rooms with attached modern bathrooms.');
  const [transportInfo, setTransportInfo] = useState('Dedicated AC Sedan (Swift Dzire/Etios) for 2 adults or AC Innova Crysta for families. Chauffeur with 8+ years Kerala route experience.');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isPublished, setIsPublished] = useState(true);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/packages', {
        headers: { 'x-admin-token': adminToken }
      });
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [adminToken]);

  const handleOpenCreate = () => {
    setEditingPkg(null);
    setName('');
    setPrice(18999);
    setOriginalPrice(24999);
    setDuration('4 Nights / 5 Days');
    setDestinations('Munnar • Alleppey');
    setImage('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop');
    setTag('Special Offer');
    setShortDescription('Experience the best of Kerala with misty tea hills in Munnar and serene backwaters in Alleppey.');
    setHighlightsText('Munnar tea plantations and waterfalls\nPrivate Alleppey Houseboat cruise\nDaily breakfast\nDedicated AC car');
    setInclusionsText('Hotel accommodation\nDaily breakfast\nPrivate AC car with driver\nHouseboat with all meals\nAll road taxes & fuel');
    setExclusionsText('Flight/train tickets\nMonument entry fees\nPersonal expenses');
    setHotelInfo('Deluxe 3/4-star verified properties.');
    setTransportInfo('Sanitized AC Sedan/Innova with experienced driver.');
    setIsFeatured(false);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setPrice(pkg.price);
    setOriginalPrice(pkg.originalPrice || pkg.price + 5000);
    setDuration(pkg.duration);
    setDestinations(pkg.destinations);
    setImage(pkg.image);
    setTag(pkg.tag || '');
    setShortDescription(pkg.shortDescription || '');
    setHighlightsText((pkg.highlights || []).join('\n'));
    setInclusionsText((pkg.inclusions || []).join('\n'));
    setExclusionsText((pkg.exclusions || []).join('\n'));
    setHotelInfo(pkg.hotelInformation || '');
    setTransportInfo(pkg.transportationInformation || '');
    setIsFeatured(!!pkg.isFeatured);
    setIsPublished(pkg.isPublished !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Package name is required.');
      return;
    }

    if (!price || price <= 0) {
      setError('Valid starting price is required.');
      return;
    }

    try {
      setIsSaving(true);
      const pkgData = {
        name: name.trim(),
        price: Number(price),
        originalPrice: Number(originalPrice) || Number(price) + 4000,
        duration: duration.trim(),
        destinations: destinations.trim(),
        image: image.trim(),
        tag: tag.trim() || undefined,
        shortDescription: shortDescription.trim(),
        highlights: highlightsText.split('\n').map(s => s.trim()).filter(Boolean),
        inclusions: inclusionsText.split('\n').map(s => s.trim()).filter(Boolean),
        exclusions: exclusionsText.split('\n').map(s => s.trim()).filter(Boolean),
        hotelInformation: hotelInfo.trim(),
        transportationInformation: transportInfo.trim(),
        isFeatured,
        isPublished
      };

      let res;
      if (editingPkg) {
        res = await fetch(`/api/admin/packages/${editingPkg.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': adminToken
          },
          body: JSON.stringify(pkgData)
        });
      } else {
        res = await fetch('/api/admin/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': adminToken
          },
          body: JSON.stringify(pkgData)
        });
      }

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save package');
      }

      setIsModalOpen(false);
      fetchPackages();
    } catch (err: any) {
      setError(err.message || 'Error saving package');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (pkg: PackageItem) => {
    if (!window.confirm(`Are you sure you want to delete the package "${pkg.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': adminToken }
      });
      if (res.ok) {
        fetchPackages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePublish = async (pkg: PackageItem) => {
    try {
      const updated = !pkg.isPublished;
      await fetch(`/api/admin/packages/${pkg.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ isPublished: updated })
      });
      fetchPackages();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-900">
            Kerala Tour Packages Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Create, edit, publish, or price Kerala tour packages. Changes update on the public site immediately.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Table Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="p-3.5 pl-6">Package</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Destinations</th>
                <th className="p-3.5">Starting Price</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-3.5 pl-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={pkg.image}
                        alt=""
                        className="w-12 h-10 rounded-lg object-cover bg-neutral-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-neutral-900 line-clamp-1">{pkg.name}</div>
                        {pkg.tag && (
                          <span className="text-[10px] text-amber-700 font-semibold">{pkg.tag}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-neutral-600 whitespace-nowrap">{pkg.duration}</td>
                  <td className="p-3.5 text-neutral-500 max-w-xs truncate">{pkg.destinations}</td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-neutral-900">₹{pkg.price.toLocaleString('en-IN')}</span>
                    {pkg.originalPrice && (
                      <span className="text-neutral-400 line-through text-[11px] ml-1.5">
                        ₹{pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleTogglePublish(pkg)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                        pkg.isPublished !== false
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {pkg.isPublished !== false ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3.5">
                    {pkg.isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">—</span>
                    )}
                  </td>
                  <td className="p-3.5 pr-6 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                      title="Edit Package"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
              <h3 className="text-lg font-bold font-heading text-neutral-900">
                {editingPkg ? 'Edit Package' : 'Add New Kerala Package'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">
                    Package Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 5 Nights Kerala Romantic Escape"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Starting Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 4 Nights / 5 Days"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. Honeymoon Special / Best Seller"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Destinations Covered</label>
                  <input
                    type="text"
                    value={destinations}
                    onChange={(e) => setDestinations(e.target.value)}
                    placeholder="e.g. Kochi • Munnar • Thekkady • Alleppey"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Short Summary</label>
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">
                    Highlights (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">
                    Inclusions (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={inclusionsText}
                    onChange={(e) => setInclusionsText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">
                    Exclusions (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={exclusionsText}
                    onChange={(e) => setExclusionsText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Hotel Information</label>
                  <textarea
                    rows={2}
                    value={hotelInfo}
                    onChange={(e) => setHotelInfo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-800 mb-1">Transportation Information</label>
                  <textarea
                    rows={2}
                    value={transportInfo}
                    onChange={(e) => setTransportInfo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2 sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4"
                    />
                    <span className="font-bold text-neutral-800">Publish Immediately on Website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span className="font-bold text-neutral-800">Mark as Featured</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer shadow-xs disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Save Package'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
