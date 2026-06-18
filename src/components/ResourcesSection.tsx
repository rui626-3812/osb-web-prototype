/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ResourceItem, FAQItem, ResourceCategory } from '../types';
import { ExternalLink, BookOpen, HelpCircle, ChevronDown, ChevronUp, Link as LinkIcon, Award, Compass, Plus, Edit, Trash2, Check, X, Palette, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { resolveCategoryStyle } from '../utils';

interface ResourcesSectionProps {
  isAdmin: boolean;
  titles: {
    resourcesTitle: string;
    resourcesSubtitle: string;
    faqsTitle: string;
    faqsSubtitle: string;
    [key: string]: string;
  };
  onUpdateTitles: (updated: { [key: string]: string }) => void;
  resources: ResourceItem[];
  faqs: FAQItem[];
  onAddResource: (resource: Omit<ResourceItem, 'id'>) => void;
  onUpdateResource: (id: string, updated: Partial<ResourceItem>) => void;
  onDeleteResource: (id: string) => void;
  onAddFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  onUpdateFAQ: (id: string, updated: Partial<FAQItem>) => void;
  onDeleteFAQ: (id: string) => void;
  categories: ResourceCategory[];
  onUpdateCategories: (categories: ResourceCategory[]) => void;
}

export default function ResourcesSection({
  isAdmin,
  titles,
  onUpdateTitles,
  resources,
  faqs,
  onAddResource,
  onUpdateResource,
  onDeleteResource,
  onAddFAQ,
  onUpdateFAQ,
  onDeleteFAQ,
  categories,
  onUpdateCategories,
}: ResourcesSectionProps) {
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<'All' | 'General' | 'Requirements' | 'Contests'>('All');

  // Interactive Admin modes
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  // States to edit section header titles staterfully
  const [isEditingResHeader, setIsEditingResHeader] = useState(false);
  const [resTitle, setResTitle] = useState(titles.resourcesTitle || "Curated References & Resources");
  const [resSubtitle, setResSubtitle] = useState(titles.resourcesSubtitle || "Core documentation, templates, and training databases");

  const [isEditingFaqHeader, setIsEditingFaqHeader] = useState(false);
  const [faqTitle, setFaqTitle] = useState(titles.faqsTitle || "Frequently Asked Questions");
  const [faqSubtitle, setFaqSubtitle] = useState(titles.faqsSubtitle || "Everything you need to know to get started");

  const handleSaveResHeader = () => {
    onUpdateTitles({ resourcesTitle: resTitle, resourcesSubtitle: resSubtitle });
    setIsEditingResHeader(false);
  };

  const handleSaveFaqHeader = () => {
    onUpdateTitles({ faqsTitle: faqTitle, faqsSubtitle: faqSubtitle });
    setIsEditingFaqHeader(false);
  };

  // New Resource values
  const [newResTitle, setNewResTitle] = useState('');
  const [newResCategory, setNewResCategory] = useState<string>(categories[0]?.id || 'Algorithms');
  const [newResType, setNewResType] = useState<'Book' | 'Website' | 'Cheatsheet' | 'Platform'>('Website');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResDesc, setNewResDesc] = useState('');

  // New FAQ values
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState<'General' | 'Puzzles' | 'Contests' | 'Requirements'>('General');

  // Edit states
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [editResTitle, setEditResTitle] = useState('');
  const [editResCategory, setEditResCategory] = useState<string>('Algorithms');
  
  // Category customization helper definitions
  const COLOR_PRESETS = [
    { id: 'sky', label: 'Sky Blue', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-150' },
    { id: 'amber', label: 'Amber Orange', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-150' },
    { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-150' },
    { id: 'indigo', label: 'Indigo Purple', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-150' },
    { id: 'rose', label: 'Rose Red', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-150' },
    { id: 'violet', label: 'Violet Lavender', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-150' },
    { id: 'teal', label: 'Teal Cyan', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-150' },
    { id: 'slate', label: 'Slate Gray', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-150' }
  ];

  // Category management hooks
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatPreset, setNewCatPreset] = useState('sky');
  
  // Customize styling models
  const [isCustomStyleChecked, setIsCustomStyleChecked] = useState(false);
  const [customBg, setCustomBg] = useState('bg-slate-100');
  const [customText, setCustomText] = useState('text-slate-700');
  const [customBorder, setCustomBorder] = useState('border-slate-200');

  // Tracking categories currently editing inline
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryPreset, setEditingCategoryPreset] = useState('sky');
  const [isEditingCustomStyle, setIsEditingCustomStyle] = useState(false);
  const [editingCustomBg, setEditingCustomBg] = useState('');
  const [editingCustomText, setEditingCustomText] = useState('');
  const [editingCustomBorder, setEditingCustomBorder] = useState('');
  const [editResType, setEditResType] = useState<'Book' | 'Website' | 'Cheatsheet' | 'Platform'>('Website');
  const [editResUrl, setEditResUrl] = useState('');
  const [editResDesc, setEditResDesc] = useState('');

  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqQuestion, setEditFaqQuestion] = useState('');
  const [editFaqAnswer, setEditFaqAnswer] = useState('');
  const [editFaqCategory, setEditFaqCategory] = useState<'General' | 'Puzzles' | 'Contests' | 'Requirements'>('General');

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const handleAddResSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle || !newResUrl) return;
    onAddResource({
      title: newResTitle,
      category: newResCategory,
      type: newResType,
      url: newResUrl,
      description: newResDesc,
    });
    setIsAddingResource(false);
    setNewResTitle('');
    setNewResUrl('');
    setNewResDesc('');
    showToast('Platform reference catalogued.');
  };

  const handleAddFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion || !newFaqAnswer) return;
    onAddFAQ({
      question: newFaqQuestion,
      answer: newFaqAnswer,
      category: newFaqCategory,
    });
    setIsAddingFaq(false);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    showToast('FAQ logged successfully.');
  };

  const startEditRes = (res: ResourceItem) => {
    setEditingResId(res.id);
    setEditResTitle(res.title);
    setEditResCategory(res.category as any);
    setEditResType(res.type as any);
    setEditResUrl(res.url);
    setEditResDesc(res.description);
  };

  const handleSaveResEdit = (id: string) => {
    onUpdateResource(id, {
      title: editResTitle,
      category: editResCategory,
      type: editResType,
      url: editResUrl,
      description: editResDesc,
    });
    setEditingResId(null);
    showToast('Reference item updated.');
  };

  const startEditFAQ = (faq: FAQItem) => {
    setEditingFaqId(faq.id);
    setEditFaqQuestion(faq.question);
    setEditFaqAnswer(faq.answer);
    setEditFaqCategory(faq.category as any);
  };

  const handleSaveFAQEdit = (id: string) => {
    onUpdateFAQ(id, {
      question: editFaqQuestion,
      answer: editFaqAnswer,
      category: editFaqCategory,
    });
    setEditingFaqId(null);
    showToast('FAQ entry updated.');
  };

  // Category management CRUDS
  const startEditingCategory = (cat: ResourceCategory) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
    setEditingCategoryPreset(cat.colorPreset || 'custom');
    if (cat.colorPreset && cat.colorPreset !== 'custom') {
      setIsEditingCustomStyle(false);
      setEditingCustomBg('');
      setEditingCustomText('');
      setEditingCustomBorder('');
    } else {
      setIsEditingCustomStyle(true);
      setEditingCustomBg(cat.bgClass);
      setEditingCustomText(cat.textClass);
      setEditingCustomBorder(cat.borderClass);
    }
  };

  const handleSaveCategoryEdit = (id: string) => {
    if (!editingCategoryName.trim()) return;
    
    let bg = editingCustomBg;
    let text = editingCustomText;
    let border = editingCustomBorder;
    
    if (!isEditingCustomStyle) {
      const preset = COLOR_PRESETS.find(p => p.id === editingCategoryPreset);
      if (preset) {
        bg = preset.bg;
        text = preset.text;
        border = preset.border;
      }
    }
    
    const nextCategories = categories.map(cat => {
      if (cat.id === id) {
        return {
          ...cat,
          name: editingCategoryName,
          bgClass: bg || 'bg-slate-50',
          textClass: text || 'text-slate-700',
          borderClass: border || 'border-slate-150',
          colorPreset: isEditingCustomStyle ? 'custom' : editingCategoryPreset
        };
      }
      return cat;
    });
    
    onUpdateCategories(nextCategories);
    setEditingCategoryId(null);
    showToast('Category updated successfully.');
  };

  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      alert('You must keep at least one category!');
      return;
    }
    if (confirm(`Delete the "${id}" category? Resources belonging to this category will fallback to default gray.`)) {
      onUpdateCategories(categories.filter(cat => cat.id !== id));
      showToast('Category deleted.');
    }
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatId || !newCatName) return;
    
    // Check for duplicate ID
    const cleanId = newCatId.trim().replace(/\s+/g, '_');
    if (categories.some(cat => cat.id.toLowerCase() === cleanId.toLowerCase())) {
      alert('Category with this ID already exists!');
      return;
    }
    
    let bg = customBg;
    let text = customText;
    let border = customBorder;
    
    if (!isCustomStyleChecked) {
      const preset = COLOR_PRESETS.find(p => p.id === newCatPreset);
      if (preset) {
        bg = preset.bg;
        text = preset.text;
        border = preset.border;
      }
    }
    
    const newCategory: ResourceCategory = {
      id: cleanId,
      name: newCatName,
      bgClass: bg || 'bg-slate-50',
      textClass: text || 'text-slate-750',
      borderClass: border || 'border-slate-200',
      colorPreset: isCustomStyleChecked ? 'custom' : newCatPreset
    };
    
    onUpdateCategories([...categories, newCategory]);
    setNewCatId('');
    setNewCatName('');
    setNewCatPreset('sky');
    setIsCustomStyleChecked(false);
    showToast('New customizable category added.');
  };

  // Filter FAQs based on selected category
  const filteredFaqs = faqs.filter(faq => {
    if (selectedFaqCategory === 'All') return true;
    return faq.category === selectedFaqCategory;
  });

  return (
    <div id="resources-section" className="space-y-12">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 rounded-2xl bg-slate-900 text-white py-3 px-5 shadow-lg flex items-center gap-2 font-sans text-xs font-semibold"
          >
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* References & Links Directory */}
      <section id="references-links" className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {isEditingResHeader && isAdmin ? (
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-full max-w-md">
              <input
                type="text"
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                className="w-full font-sans text-sm font-bold text-slate-950 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="Resources Title"
              />
              <textarea
                value={resSubtitle}
                onChange={(e) => setResSubtitle(e.target.value)}
                className="w-full font-sans text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="Resources Subtitle"
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingResHeader(false)}
                  className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1 text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveResHeader}
                  className="rounded-lg bg-slate-950 text-white px-3 py-1 text-[10px] font-bold"
                >
                  Save Title
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative flex items-center gap-2">
              <div>
                <h2 className="font-sans text-xl font-bold text-slate-950 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-slate-700" /> {titles.resourcesTitle || resTitle}
                </h2>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                  {titles.resourcesSubtitle || resSubtitle}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setResTitle(titles.resourcesTitle || resTitle);
                    setResSubtitle(titles.resourcesSubtitle || resSubtitle);
                    setIsEditingResHeader(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition animate-fade-in"
                  title="Edit resources list headers"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="flex flex-wrap gap-2">
              <button
                id="manage-categories-btn"
                onClick={() => {
                  setIsManagingCategories(!isManagingCategories);
                  setIsAddingResource(false);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 font-sans text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Palette className="h-3.5 w-3.5 text-slate-600" />
                {isManagingCategories ? "Close Category Customizer" : "Customize Category Classes"}
              </button>
              <button
                id="add-res-trigger-btn"
                onClick={() => {
                  setIsAddingResource(!isAddingResource);
                  setIsManagingCategories(false);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 font-sans text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Resource Reference
              </button>
            </div>
          )}
        </div>

        {/* Category Customization Manager Panel */}
        <AnimatePresence>
          {isManagingCategories && (
            <motion.div
              id="category-customizer-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6 shadow-inner"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-250">
                <div>
                  <h3 className="font-sans text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Palette className="h-4 w-4 text-slate-700" /> Resource Category Class Customizer
                  </h3>
                  <p className="font-sans text-xs text-slate-500">
                    Fully customize category text, display names, and color presets in real time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManagingCategories(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Current Categories List */}
              <div className="space-y-3">
                <h4 className="font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">Active Categories</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((cat) => {
                    const isEditingThisCat = editingCategoryId === cat.id;
                    const catStyle = `${cat.bgClass} ${cat.textClass} ${cat.borderClass}`;
                    
                    return (
                      <div
                        key={cat.id}
                        className="flex flex-col justify-between border border-slate-200 bg-white p-4 rounded-xl hover:border-slate-300 transition"
                      >
                        {isEditingThisCat ? (
                          <div className="space-y-4 w-full">
                            <div className="space-y-1">
                              <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Category Name (Text)</label>
                              <input
                                type="text"
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 p-2 font-sans text-xs focus:outline-none focus:border-slate-400"
                                placeholder="e.g. Advanced Networks"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Color Preset</label>
                                <label className="inline-flex items-center gap-1 font-sans text-[10px] text-slate-600 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isEditingCustomStyle}
                                    onChange={(e) => setIsEditingCustomStyle(e.target.checked)}
                                    className="rounded border-slate-200 text-slate-900"
                                  />
                                  <span>Custom Tailwind Classes</span>
                                </label>
                              </div>

                              {!isEditingCustomStyle ? (
                                <div className="grid grid-cols-4 gap-1.5 pt-1">
                                  {COLOR_PRESETS.map((preset) => (
                                    <button
                                      key={preset.id}
                                      type="button"
                                      onClick={() => setEditingCategoryPreset(preset.id)}
                                      className={`rounded-lg border p-1 text-[10px] font-medium transition ${
                                        editingCategoryPreset === preset.id
                                          ? 'border-slate-900 bg-slate-900 text-white font-bold'
                                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {preset.label.split(' ')[0]}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="grid grid-cols-3 gap-2 pt-1">
                                  <div>
                                    <span className="text-[9px] text-slate-400 font-mono">Bg Class</span>
                                    <input
                                      type="text"
                                      value={editingCustomBg}
                                      onChange={(e) => setEditingCustomBg(e.target.value)}
                                      placeholder="bg-slate-50"
                                      className="w-full rounded-lg border border-slate-200 p-1.5 font-mono text-[10px]"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-400 font-mono">Text Class</span>
                                    <input
                                      type="text"
                                      value={editingCustomText}
                                      onChange={(e) => setEditingCustomText(e.target.value)}
                                      placeholder="text-slate-700"
                                      className="w-full rounded-lg border border-slate-200 p-1.5 font-mono text-[10px]"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-400 font-mono">Border Class</span>
                                    <input
                                      type="text"
                                      value={editingCustomBorder}
                                      onChange={(e) => setEditingCustomBorder(e.target.value)}
                                      placeholder="border-slate-150"
                                      className="w-full rounded-lg border border-slate-200 p-1.5 font-mono text-[10px]"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingCategoryId(null)}
                                className="rounded-lg border border-slate-200 px-3 py-1 font-sans text-[10px] font-bold text-slate-600 hover:bg-slate-55"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveCategoryEdit(cat.id)}
                                className="rounded-lg bg-slate-900 text-white px-3 py-1 font-sans text-[10px] font-bold hover:bg-slate-800"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <div className="space-y-1.5">
                              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ID: {cat.id}</span>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex rounded-md border px-2 py-0.5 font-sans text-[10px] font-bold uppercase ${catStyle}`}>
                                  {cat.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                title="Edit Category Styling/Text"
                                onClick={() => startEditingCategory(cat)}
                                className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-slate-800"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Delete Category"
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1.5 hover:bg-rose-50 border border-slate-100 hover:border-rose-200 rounded-lg text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add New Category Form Row */}
              <form onSubmit={handleAddCategorySubmit} className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">Create New Resource Division (Class)</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="font-sans text-[11px] font-bold text-slate-600">Unique ID (Alphanumeric)</label>
                    <input
                      type="text"
                      required
                      value={newCatId}
                      onChange={(e) => setNewCatId(e.target.value)}
                      placeholder="e.g. Advanced_Math"
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 font-sans text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-sans text-[11px] font-bold text-slate-600">Category Name (Display Label)</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Advanced Math & Geometry"
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 font-sans text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="font-sans text-[11px] font-bold text-slate-600">Styling Preset</label>
                      <label className="inline-flex items-center gap-1 font-sans text-[9px] text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isCustomStyleChecked}
                          onChange={(e) => setIsCustomStyleChecked(e.target.checked)}
                          className="rounded border-slate-200 text-slate-900"
                        />
                        <span>Custom CSS</span>
                      </label>
                    </div>

                    {!isCustomStyleChecked ? (
                      <select
                        value={newCatPreset}
                        onChange={(e) => setNewCatPreset(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 font-sans text-xs focus:outline-none"
                      >
                        {COLOR_PRESETS.map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.label} Settings
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex gap-1 animate-fade-in">
                        <input
                          type="text"
                          value={customBg}
                          onChange={(e) => setCustomBg(e.target.value)}
                          placeholder="bg-red-50"
                          title="Background Class"
                          className="w-1/3 rounded-lg border border-slate-200 p-1.5 font-mono text-[10px]"
                        />
                        <input
                          type="text"
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          placeholder="text-red-700"
                          title="Text Class"
                          className="w-1/3 rounded-lg border border-slate-200 p-1.5 font-mono text-[10px]"
                        />
                        <input
                          type="text"
                          value={customBorder}
                          onChange={(e) => setCustomBorder(e.target.value)}
                          placeholder="border-red-200"
                          title="Border Class"
                          className="w-1/3 rounded-lg border border-slate-200 p-1.5 font-mono text-[10px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 text-white font-sans text-xs font-semibold py-2 px-5 hover:bg-slate-800 transition shadow-xs"
                  >
                    <Plus className="h-4 w-4" /> Add Category & Preset
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Resource Block */}
        <AnimatePresence>
          {isAddingResource && (
            <motion.form
              id="add-res-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddResSubmit}
              className="bg-slate-100/70 rounded-2xl p-6 border border-slate-200 grid gap-4 sm:grid-cols-2 shadow-inner"
            >
              <div className="sm:col-span-2 flex justify-between items-center">
                <div>
                  <h4 className="font-sans text-sm font-bold text-slate-950">Catalogue New Training Resource</h4>
                  <p className="font-sans text-xs text-slate-500">Provide direct URLs or ebooks to list for competitors.</p>
                </div>
                <button type="button" onClick={() => setIsAddingResource(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-650">Resource Title</label>
                <input
                  type="text"
                  required
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  placeholder="e.g. USACO Guide"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-655">Resource URL Address</label>
                <input
                  type="url"
                  required
                  value={newResUrl}
                  onChange={(e) => setNewResUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-655">Category Class</label>
                <select
                  value={newResCategory}
                  onChange={(e) => setNewResCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-655">Medium Format</label>
                <select
                  value={newResType}
                  onChange={(e) => setNewResType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                >
                  <option value="Website">Platform / Website</option>
                  <option value="Book">Book / PDF File</option>
                  <option value="Cheatsheet">Notebook / Cheatsheet</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-655">Short Summary description</label>
                <textarea
                  rows={2}
                  required
                  value={newResDesc}
                  onChange={(e) => setNewResDesc(e.target.value)}
                  placeholder="Review the textbook's scope or dynamic exercises..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingResource(false)}
                  className="rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-2 px-4 font-sans text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-905 bg-slate-900 text-white hover:bg-slate-800 py-2 px-5 font-sans text-xs font-semibold"
                >
                  Log Reference File
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((res) => {
            const isEditingThisRes = editingResId === res.id;

            const { badgeClass: catBadge, displayName: catName } = resolveCategoryStyle(res.category, categories);

            if (isEditingThisRes) {
              return (
                <div
                  key={res.id}
                  className="flex flex-col gap-2.5 rounded-2xl border-2 border-indigo-300 bg-indigo-50/20 p-4 shadow-xs"
                >
                  <span className="font-mono text-[9px] font-bold text-indigo-700 uppercase">Updating Reference</span>
                  
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={editResTitle}
                      onChange={(e) => setEditResTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                    <input
                      type="url"
                      value={editResUrl}
                      onChange={(e) => setEditResUrl(e.target.value)}
                      placeholder="URL"
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                    <select
                      value={editResCategory}
                      onChange={(e) => setEditResCategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-[10px] focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editResType}
                      onChange={(e) => setEditResType(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-[10px] focus:outline-none"
                    >
                      <option value="Website">Website</option>
                      <option value="Book">Book/PDF</option>
                      <option value="Cheatsheet">Cheatsheet</option>
                    </select>
                    <textarea
                      value={editResDesc}
                      onChange={(e) => setEditResDesc(e.target.value)}
                      placeholder="Short Summary"
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingResId(null)}
                      className="rounded-md border border-slate-250 bg-white py-1 px-2.5 text-[9px] font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveResEdit(res.id)}
                      className="rounded-md bg-slate-900 py-1 px-2.5 text-[9px] font-bold text-white hover:bg-slate-850"
                    >
                      Save
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={res.id}
                id={`resource-card-${res.id}`}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-350 transition-all group relative"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      title="Edit reference"
                      onClick={() => startEditRes(res)}
                      className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      title="Archive reference"
                      onClick={() => {
                        if (confirm(`Remove "${res.title}" library link?`)) {
                          onDeleteResource(res.id);
                          showToast('Resource link removed.');
                        }
                      }}
                      className="p-1 rounded-md hover:bg-rose-50 text-slate-500 hover:text-rose-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${catBadge}`}>
                      {catName}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 uppercase font-semibold mr-8">
                      {res.type}
                    </span>
                  </div>

                  <h3 className="font-sans text-sm font-bold text-slate-900 group-hover:text-slate-950 leading-tight">
                    {res.title}
                  </h3>

                  <p className="font-sans text-[11px] text-slate-500 leading-relaxed text-slate-600">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-slate-900 hover:text-slate-750 transition-colors cursor-pointer"
                  >
                    <span>Inspect Resource</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Structured FAQs */}
      <section id="faqs" className="border-t border-slate-200/80 pt-12 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {isEditingFaqHeader && isAdmin ? (
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-full max-w-md">
              <input
                type="text"
                value={faqTitle}
                onChange={(e) => setFaqTitle(e.target.value)}
                className="w-full font-sans text-sm font-bold text-slate-950 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="FAQs Title"
              />
              <textarea
                value={faqSubtitle}
                onChange={(e) => setFaqSubtitle(e.target.value)}
                className="w-full font-sans text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none"
                placeholder="FAQs Subtitle"
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingFaqHeader(false)}
                  className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1 text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFaqHeader}
                  className="rounded-lg bg-slate-950 text-white px-3 py-1 text-[10px] font-bold"
                >
                  Save Title
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative flex items-center gap-2">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-sans text-xl font-bold text-slate-950 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-slate-700" /> {titles.faqsTitle || faqTitle}
                  </h2>
                  {isAdmin && (
                    <button
                      id="add-faq-trigger-btn"
                      onClick={() => setIsAddingFaq(!isAddingFaq)}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 font-sans text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add FAQ Record
                    </button>
                  )}
                </div>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                  {titles.faqsSubtitle || faqSubtitle}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setFaqTitle(titles.faqsTitle || faqTitle);
                    setFaqSubtitle(titles.faqsSubtitle || faqSubtitle);
                    setIsEditingFaqHeader(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                  title="Edit FAQ section headers"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* FAQ Category Selection */}
          <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 border border-slate-200/50">
            {(['All', 'General', 'Requirements', 'Contests'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFaqCategory(cat)}
                className={`rounded-lg px-2.5 py-1 font-sans text-[11px] font-medium transition-all cursor-pointer ${
                  selectedFaqCategory === cat
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Add FAQ Form Block */}
        <AnimatePresence>
          {isAddingFaq && (
            <motion.form
              id="add-faq-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddFaqSubmit}
              className="bg-slate-100/70 rounded-2xl p-6 border border-slate-200 grid gap-4 max-w-3xl shadow-inner"
            >
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h4 className="font-sans text-sm font-bold text-slate-950">Add FAQ Entry Info</h4>
                  <p className="font-sans text-xs text-slate-500 font-medium">Record clear procedural answers for incoming freshmen.</p>
                </div>
                <button type="button" onClick={() => setIsAddingFaq(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-650">Information Question</label>
                <input
                  type="text"
                  required
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  placeholder="e.g. Do I need to be a Mathematics major to join?"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-655">Category Group</label>
                <select
                  value={newFaqCategory}
                  onChange={(e) => setNewFaqCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                >
                  <option value="General">General / Administrative</option>
                  <option value="Requirements">Requirements & Eligibility</option>
                  <option value="Contests">Contests & Traveling Roster</option>
                  <option value="Puzzles">Scout Math Puzzles</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[11px] font-bold text-slate-650">Official answer payload</label>
                <textarea
                  rows={3}
                  required
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="Answer with straightforward details..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingFaq(false)}
                  className="rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-2 px-5 font-sans text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 py-2 px-6 font-sans text-xs font-semibold"
                >
                  Create FAQ Registry
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* FAQs Accordion Block */}
        <div className="max-w-3xl space-y-3">
          {filteredFaqs.length === 0 ? (
            <p className="font-sans text-xs text-slate-400 italic">No FAQs available for this specification.</p>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedFaqId === faq.id;
              const isEditingFAQ = editingFaqId === faq.id;

              if (isEditingFAQ) {
                return (
                  <div
                    key={faq.id}
                    className="flex flex-col gap-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50/20 p-5 shadow-xs bg-white"
                  >
                    <span className="font-mono text-[9px] font-bold text-indigo-700 uppercase">Updating FAQ Element</span>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editFaqQuestion}
                        onChange={(e) => setEditFaqQuestion(e.target.value)}
                        placeholder="FAQ Question"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 font-sans text-xs focus:outline-none"
                      />
                      <select
                        value={editFaqCategory}
                        onChange={(e) => setEditFaqCategory(e.target.value as any)}
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 font-sans text-[10px] focus:outline-none"
                      >
                        <option value="General">General</option>
                        <option value="Requirements">Requirements</option>
                        <option value="Contests">Contests</option>
                        <option value="Puzzles">Puzzles</option>
                      </select>
                      <textarea
                        value={editFaqAnswer}
                        onChange={(e) => setEditFaqAnswer(e.target.value)}
                        placeholder="FAQ Answer"
                        rows={3}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 font-sans text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-1.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingFaqId(null)}
                        className="rounded-lg border border-slate-250 bg-white py-1 px-3.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveFAQEdit(faq.id)}
                        className="rounded-lg bg-slate-900 py-1 px-3.5 text-[10px] font-bold text-white hover:bg-slate-800"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className="rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-250 transition-all group relative"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="flex-1 flex items-center justify-between text-left p-5 font-sans font-semibold text-xs sm:text-sm text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <span className="pr-10">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-4" />
                      )}
                    </button>

                    {isAdmin && (
                      <div className="absolute top-5 right-12 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          title="Edit FAQ"
                          onClick={() => startEditFAQ(faq)}
                          className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-850"
                        >
                          <Edit className="h-3. w-3" />
                        </button>
                        <button
                          title="Archive FAQ"
                          onClick={() => {
                            if (confirm(`Delete FAQ: "${faq.question}"?`)) {
                              onDeleteFAQ(faq.id);
                              showToast('FAQ archived.');
                            }
                          }}
                          className="p-1 rounded-md hover:bg-rose-50 text-slate-500 hover:text-rose-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-200/50 text-[11px] sm:text-xs text-slate-500 font-sans leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
