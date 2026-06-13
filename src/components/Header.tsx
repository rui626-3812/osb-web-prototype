/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Calendar, BookOpen, Users, HelpCircle, GraduationCap, LayoutGrid, Lock, Unlock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function Header({ activeTab, setActiveTab, isAdmin, setIsAdmin }: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row sm:py-3">
        {/* Brand / Logo */}
        <div id="brand-logo" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <span className="font-mono text-lg font-bold tracking-wider">Ω</span>
          </div>
          <div>
            <h1 className="font-sans text-lg font-semibold tracking-tight text-slate-950">Olympiad Portal</h1>
            <p className="font-mono text-[10px] uppercase tracking-wide text-slate-500">Coding & Mathematics Hub</p>
          </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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

                <button
                  id="admin-submit-login"
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 py-2.5 text-center font-sans text-xs font-semibold text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Verify Access
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
