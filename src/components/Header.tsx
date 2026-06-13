/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Calendar, BookOpen, Users, HelpCircle, GraduationCap, LayoutGrid, Lock, Unlock, X, Waves, Edit, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  titles: {
    brandName: string;
    brandSubtitle: string;
    [key: string]: string;
  };
  onUpdateTitles: (updated: { [key: string]: string }) => void;
}

export default function Header({ activeTab, setActiveTab, isAdmin, setIsAdmin, titles, onUpdateTitles }: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Branding dynamic editing
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [brandName, setBrandName] = useState(titles.brandName || "OSB Portal");
  const [brandSubtitle, setBrandSubtitle] = useState(titles.brandSubtitle || "Ocean Science Hub");

  const navItems = [
    { id: 'home', label: 'Overview', icon: LayoutGrid },
    { id: 'team', label: 'Team & Alumni', icon: Users },
    { id: 'events', label: 'Meets & Schedule', icon: Calendar },
    { id: 'resources', label: 'Resources & FAQ', icon: HelpCircle },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Amekh239') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid Password. Try again.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setIsEditingBrand(false);
  };

  const handleSaveBrand = () => {
    onUpdateTitles({
      brandName,
      brandSubtitle,
    });
    setIsEditingBrand(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row sm:py-3">
        {/* Brand / Logo */}
        <div id="brand-logo" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sky-400 shadow-sm border border-slate-800">
            <Waves className="h-5 w-5 animate-pulse" />
          </div>
          
          {isEditingBrand && isAdmin ? (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="font-sans text-xs font-bold text-slate-950 bg-white px-2 py-0.5 rounded border border-slate-200 focus:outline-none"
                  placeholder="Portal Name"
                />
                <input
                  type="text"
                  value={brandSubtitle}
                  onChange={(e) => setBrandSubtitle(e.target.value)}
                  className="font-mono text-[9px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 block focus:outline-none"
                  placeholder="Subtitle"
                />
              </div>
              <button
                onClick={handleSaveBrand}
                className="p-1 rounded-lg bg-slate-950 text-white hover:bg-slate-800"
                title="Save brand names"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  setBrandName(titles.brandName);
                  setBrandSubtitle(titles.brandSubtitle);
                  setIsEditingBrand(false);
                }}
                className="p-1 rounded-lg bg-white border border-slate-250 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="group relative flex items-center gap-2">
              <div>
                <h1 className="font-sans text-lg font-semibold tracking-tight text-slate-950 flex items-center gap-1">
                  {titles.brandName || brandName}
                </h1>
                <p className="font-mono text-[10px] uppercase tracking-wide text-slate-500">
                  {titles.brandSubtitle || brandSubtitle}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setBrandName(titles.brandName || brandName);
                    setBrandSubtitle(titles.brandSubtitle || brandSubtitle);
                    setIsEditingBrand(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                  title="Edit branding texts"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <nav id="navigation-bar" className="flex flex-wrap justify-center gap-1.5 rounded-xl bg-slate-100 p-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-sans text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-lg bg-white shadow-xs"
                    transition={{ type: 'spring', stdDeviation: 10, dampening: 15, duration: 0.3 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Admin login button upper right */}
        <div id="system-header-right" className="flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-250 font-mono font-bold uppercase py-0.5 px-2 rounded-full">
                Admin Mode Active
              </span>
              <button
                id="admin-logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 font-sans text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Unlock className="h-3.5 w-3.5 text-rose-500" />
                Logout
              </button>
            </div>
          ) : (
            <button
              id="admin-login-btn"
              onClick={() => { setShowLoginModal(true); setErrorMessage(''); }}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 font-sans text-xs font-semibold text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <Lock className="h-3.5 w-3.5 text-slate-300" />
              Admin Login
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div 
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-slate-900/40 backdrop-blur-xs"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowLoginModal(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-5"
            >
              <button
                id="close-login-modal"
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center space-y-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-sans text-base font-bold text-slate-950">Administrative Access</h3>
                <p className="font-sans text-xs text-slate-500">
                  Enter credentials to unlock text customization controls.
                </p>
              </div>

              {errorMessage && (
                <div className="text-[11px] font-semibold text-center text-rose-800 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-sans text-[11px] font-semibold text-slate-700">Access Key</label>
                  <input
                    id="admin-password-input"
                    type="password"
                    required
                    placeholder="Enter admin password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-sans text-xs focus:bg-white focus:border-slate-400 focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 rounded-xl bg-slate-100 py-2.5 text-center font-sans text-xs font-semibold text-slate-755 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="admin-submit-login"
                    type="submit"
                    className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center font-sans text-xs font-semibold text-white hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Verify Access
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
